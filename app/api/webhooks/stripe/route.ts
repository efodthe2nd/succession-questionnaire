import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase-admin";
import { sendWelcomeEmail } from "@/lib/email";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover",
});

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    console.error("[Stripe Webhook] Missing stripe-signature header");
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, WEBHOOK_SECRET);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[Stripe Webhook] Signature verification failed:", message);
    return NextResponse.json({ error: `Webhook signature verification failed: ${message}` }, { status: 400 });
  }

  console.log("[Stripe Webhook] Received event:", event.type);

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const customerEmail = session.customer_details?.email || session.customer_email;

    if (!customerEmail) {
      console.error("[Stripe Webhook] No customer email found in session", { sessionId: session.id });
      return NextResponse.json({ error: "No customer email found" }, { status: 400 });
    }

    console.log("[Stripe Webhook] Processing payment for:", customerEmail);

    try {
      const supabaseAdmin = createAdminClient();

      // Check if user already exists
      const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
      const existingUser = existingUsers?.users?.find((u) => u.email === customerEmail);

      let userId: string;

      if (existingUser) {
        // User exists from squeeze page registration — just use their id
        console.log("[Stripe Webhook] User already exists:", customerEmail);
        userId = existingUser.id;
      } else {
        // New user — came direct to landing page, never registered via squeeze
        const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
          email: customerEmail,
          email_confirm: true,
        });

        if (createError) {
          console.error("[Stripe Webhook] Failed to create user:", createError);
          return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
        }

        console.log("[Stripe Webhook] Created new user:", customerEmail);
        userId = newUser.user.id;
      }

      // Generate magic link pointing straight to /questionnaire
      const { data: linkData } = await supabaseAdmin.auth.admin.generateLink({
        type: "magiclink",
        email: customerEmail,
        options: {
          redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/questionnaire`,
        },
      });

      const magicLink =
        linkData?.properties?.action_link ||
        `${process.env.NEXT_PUBLIC_SITE_URL}/login`;

      // Send welcome email with magic link
      const emailSent = await sendWelcomeEmail({ to: customerEmail, magicLink });

      if (!emailSent) {
        console.warn("[Stripe Webhook] Welcome email not sent", { customerEmail });
      }

      // Mark submission as paid
      const { error: submissionError } = await supabaseAdmin
        .from("submissions")
        .update({ paid: true })
        .eq("user_id", userId)
        .eq("status", "completed");

      if (submissionError) {
        console.error("[Stripe Webhook] Failed to update submission:", submissionError);
      }

      // Update leads table funnel stage
      await supabaseAdmin
        .from("leads")
        .upsert({ email: customerEmail, funnel_stage: "paid" }, { onConflict: "email" });

      console.log("[Stripe Webhook] Successfully processed payment for:", customerEmail);

      return NextResponse.json({ success: true, userId, emailSent });
    } catch (error) {
      console.error("[Stripe Webhook] Error processing checkout:", error);
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}