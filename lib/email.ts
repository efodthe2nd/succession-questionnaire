import sgMail from '@sendgrid/mail'

// Initialize SendGrid if API key is available
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY
const SENDGRID_FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL || 'noreply@successionstory.com'

if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY)
}

interface WelcomeEmailParams {
  to: string
  password: string
}

/**
 * Generates the HTML content for the welcome email with credentials
 */
function generateWelcomeEmailHTML(email: string, password: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Succession Story</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Georgia', serif; background-color: #f8f6f2;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; background-color: #1a1a1a; border-radius: 12px 12px 0 0;">
              <h1 style="margin: 0; font-size: 28px; font-weight: normal; color: #ffffff;">
                Succession <span style="color: #B5A692;">Story</span>
              </h1>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px; font-size: 24px; color: #1a1a1a; font-weight: normal;">
                Welcome to Succession Story
              </h2>

              <p style="margin: 0 0 16px; font-size: 16px; line-height: 1.6; color: #4a4a4a;">
                Thank you for your purchase. You're all set. From here, we'll begin writing your Succession Story for you. All we need is your input through a simple, guided experience.
              </p>

              <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.6; color: #4a4a4a;">
                This is a companion to your estate plan. It captures the meaning, values, and intentions behind what you've built, in your own voice, without the work of writing a letter yourself.
              </p>

              <!-- Login Details Box -->
              <div style="background-color: #f8f6f2; padding: 24px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin: 0 0 16px; font-size: 18px; color: #1a1a1a; font-weight: 600;">
                  Your Login Details
                </h3>
                <p style="margin: 0 0 8px; font-size: 15px; color: #4a4a4a;">
                  <strong>Email:</strong> ${email}
                </p>
                <p style="margin: 0; font-size: 15px; color: #4a4a4a;">
                  <strong>Temporary Password:</strong> ${password}
                </p>
              </div>

              <!-- CTA Button -->
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td align="center" style="padding: 20px 0;">
                    <a href="https://www.successionstory.now/login"
                       style="display: inline-block; padding: 16px 40px; background-color: #1a1a1a; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 500; border-radius: 30px;">
                      Log In Now
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 30px; font-size: 14px; color: #888888; text-align: center;">
                We recommend changing your password after your first login.
              </p>

              <!-- How It Works Section -->
              <h3 style="margin: 30px 0 16px; font-size: 18px; color: #1a1a1a; font-weight: 600;">
                How It Works
              </h3>
              <p style="margin: 0 0 16px; font-size: 16px; line-height: 1.6; color: #4a4a4a;">
                Once you log in, you'll move through an easy, guided questionnaire. Most prompts are multiple choice, with a few short reflections where you can type or speak your thoughts. You don't need to worry about structure, tone, or wording. We handle that for you.
              </p>
              <p style="margin: 0 0 16px; font-size: 16px; line-height: 1.6; color: #4a4a4a;">
                <strong>You simply share what matters.</strong><br />
                <strong>We turn it into a polished Succession Story.</strong>
              </p>

              <!-- What to Expect Section -->
              <h3 style="margin: 30px 0 16px; font-size: 18px; color: #1a1a1a; font-weight: 600;">
                Here's what to expect:
              </h3>
              <ul style="margin: 0 0 20px; padding-left: 20px; font-size: 15px; line-height: 1.8; color: #4a4a4a;">
                <li>A guided experience that you can finish in less than a couple of hours</li>
                <li>A timer that counts down two hours, to encourage you to finish quickly</li>
                <li>Multiple choice prompts and optional voice-to-text for ease</li>
                <li>Your completed Succession Story written for you and delivered within 24 hours</li>
              </ul>
              <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.6; color: #4a4a4a;">
                No blank pages.<br />
                No long workbooks.<br />
                No pressure to get it perfect.
              </p>

              <!-- Gift Section -->
              <div style="background-color: #f8f6f2; padding: 24px; border-radius: 8px; margin: 30px 0;">
                <h3 style="margin: 0 0 12px; font-size: 18px; color: #1a1a1a; font-weight: 600;">
                  Giving This as a Gift?
                </h3>
                <p style="margin: 0 0 16px; font-size: 15px; line-height: 1.6; color: #4a4a4a;">
                  If this purchase is a gift, you can download a printable digital gift certificate directly from this email. Just click the "Print Gift Certificate" button below and share it when the moment feels right.
                </p>
                <table role="presentation" style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td align="center" style="padding: 10px 0 0;">
                      <a href="https://www.successionstory.now/gift-certificate"
                         style="display: inline-block; padding: 12px 30px; background-color: #B5A692; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 500; border-radius: 30px;">
                        Print Gift Certificate
                      </a>
                    </td>
                  </tr>
                </table>
              </div>

              <!-- Support Section -->
              <div style="border-top: 1px solid #e5e5e5; padding-top: 30px; margin-top: 30px;">
                <h3 style="margin: 0 0 12px; font-size: 16px; color: #1a1a1a; font-weight: 600;">
                  Need a Hand?
                </h3>
                <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #4a4a4a;">
                  If you have questions or want help getting started, we're here. Simply send us an email at
                  <a href="mailto:successionstory.now@gmail.com" style="color: #B5A692; text-decoration: none;">successionstory.now@gmail.com</a>.
                </p>
                <p style="margin: 16px 0 0; font-size: 14px; line-height: 1.6; color: #4a4a4a;">
                  We're glad you chose Succession Story. We'll take it from here.
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #1a1a1a; border-radius: 0 0 12px 12px; text-align: center;">
              <p style="margin: 0 0 8px; font-size: 18px; color: #ffffff; font-family: 'Georgia', serif;">
                Succession <span style="color: #B5A692;">Story</span>
              </p>
              <p style="margin: 0 0 16px; font-size: 14px; color: #ffffff; font-style: italic;">
                Your legacy, written for you.
              </p>
              <p style="margin: 0; font-size: 12px; color: #888888;">
                You're receiving this email because you purchased access to Succession Story.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`
}

/**
 * Generates plain text version of the welcome email
 */
function generateWelcomeEmailText(email: string, password: string): string {
  return `
WELCOME TO SUCCESSION STORY

Thank you for your purchase. You're all set. From here, we'll begin writing your Succession Story for you. All we need is your input through a simple, guided experience.

This is a companion to your estate plan. It captures the meaning, values, and intentions behind what you've built, in your own voice, without the work of writing a letter yourself.

---

YOUR LOGIN DETAILS

Email: ${email}
Temporary Password: ${password}

Log in at: https://www.successionstory.now/login

We recommend changing your password after your first login.

---

HOW IT WORKS

Once you log in, you'll move through an easy, guided questionnaire. Most prompts are multiple choice, with a few short reflections where you can type or speak your thoughts. You don't need to worry about structure, tone, or wording. We handle that for you.

You simply share what matters.
We turn it into a polished Succession Story.

---

HERE'S WHAT TO EXPECT:

- A guided experience that you can finish in less than a couple of hours
- A timer that counts down two hours, to encourage you to finish quickly
- Multiple choice prompts and optional voice-to-text for ease
- Your completed Succession Story written for you and delivered within 24 hours

No blank pages.
No long workbooks.
No pressure to get it perfect.

---

GIVING THIS AS A GIFT?

If this purchase is a gift, you can download a printable digital gift certificate at:
https://www.successionstory.now/gift-certificate

Share it when the moment feels right.

---

NEED A HAND?

If you have questions or want help getting started, we're here. Simply send us an email at successionstory.now@gmail.com.

We're glad you chose Succession Story. We'll take it from here.

---

Succession Story
Your legacy, written for you.

You're receiving this email because you purchased access to Succession Story.
`
}

/**
 * Generates a readable random password
 */
export function generatePassword(): string {
  const adjectives = ['Happy', 'Bright', 'Swift', 'Calm', 'Bold', 'Kind', 'Wise', 'Pure']
  const nouns = ['Star', 'Moon', 'Tree', 'Lake', 'Bird', 'Rose', 'Wind', 'Wave']
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)]
  const noun = nouns[Math.floor(Math.random() * nouns.length)]
  const num = Math.floor(Math.random() * 900) + 100 // 100-999
  return `${adj}${noun}${num}`
}

/**
 * Sends a welcome email with login credentials
 *
 * @returns true if email was sent successfully, false otherwise
 */
export async function sendWelcomeEmail({
  to,
  password,
}: WelcomeEmailParams): Promise<boolean> {
  // Check if SendGrid is configured
  if (!SENDGRID_API_KEY) {
    console.warn(
      '[Email] SendGrid API key not configured. Skipping welcome email.',
      { to }
    )
    return false
  }

  const msg = {
    to,
    from: {
      email: SENDGRID_FROM_EMAIL,
      name: 'Succession Story',
    },
    subject: "You're in. Let us write your Succession Story.",
    text: generateWelcomeEmailText(to, password),
    html: generateWelcomeEmailHTML(to, password),
  }

  try {
    await sgMail.send(msg)
    console.log('[Email] Welcome email sent successfully', { to })
    return true
  } catch (error) {
    console.error('[Email] Failed to send welcome email:', error)
    // Don't throw - we don't want to break the webhook if email fails
    return false
  }
}
