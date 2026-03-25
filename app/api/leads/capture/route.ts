import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendWelcomeEmail } from "@/lib/email";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

const QUESTIONNAIRE_URL = `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`;

export async function POST(req: NextRequest) {
  try {
    const { email, source = "variant-1" } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();

    // 1. Save to leads table
    const { error: leadError } = await supabaseAdmin
      .from("leads")
      .upsert({ email: cleanEmail, source }, { onConflict: "email" });

    if (leadError) {
      console.error("[leads/capture] leads upsert error:", leadError);
    }

    // 2. Create user if they don't exist
    const { error: signUpError } = await supabaseAdmin.auth.admin.createUser({
      email: cleanEmail,
      email_confirm: true,
      user_metadata: { source },
    });

    // Ignore "already registered" — user exists, that's fine
    if (signUpError && !signUpError.message.includes("already been registered")) {
      console.error("[leads/capture] createUser error:", signUpError);
      return NextResponse.json({ error: "Failed to create account" }, { status: 500 });
    }

    // 3. Generate magic link pointing directly to /questionnaire
    const { data: linkData, error: linkError } =
      await supabaseAdmin.auth.admin.generateLink({
        type: "magiclink",
        email: cleanEmail,
        options: {
          redirectTo: QUESTIONNAIRE_URL,
        },
      });

    if (linkError || !linkData?.properties?.action_link) {
      console.error("[leads/capture] generateLink error:", linkError);
      // Fallback: send to login page if magic link fails
      return NextResponse.json({ success: true, redirect: "/login" });
    }

    const magicLink = linkData.properties.action_link;

    // 4. Update funnel stage
    await supabaseAdmin
      .from("leads")
      .update({ funnel_stage: "email_sent" })
      .eq("email", cleanEmail);

    // 5. Fire welcome email in background — don't await it
    // This no longer blocks the redirect
    sendWelcomeEmail({ to: cleanEmail, magicLink }).catch((err) =>
      console.error("[leads/capture] welcome email error:", err)
    );

    // 6. Return magic link to frontend — frontend redirects immediately
    return NextResponse.json({ success: true, redirect: magicLink });

  } catch (err) {
    console.error("[leads/capture] Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}