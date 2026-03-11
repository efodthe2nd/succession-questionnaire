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
 * Generates the HTML content for the letter delivery email
 */
function generateLetterEmailHTML(): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Succession Story Is Ready</title>
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
                Your Succession Story is Ready.
              </h2>

              <p style="margin: 0 0 16px; font-size: 16px; line-height: 1.6; color: #4a4a4a;">
                Thank you for trusting us with something this personal. We've taken your responses and shaped them into a letter that reflects your voice, your values, and the meaning behind what you've built.
              </p>

              <p style="margin: 0 0 16px; font-size: 16px; line-height: 1.6; color: #4a4a4a;">
                Your completed letter is attached as a PDF to this email.
              </p>

              <p style="margin: 0 0 16px; font-size: 16px; line-height: 1.6; color: #4a4a4a;">
                We recommend reading your letter once on your own in a quiet place. Give yourself a few uninterrupted minutes to sit with it. This is often the first time clients see their values, memories, and intentions gathered in one place. Reading it slowly allows you to notice whether it truly sounds like you and whether it says what you meant to say.
              </p>

              <p style="margin: 0 0 16px; font-size: 16px; line-height: 1.6; color: #4a4a4a;">
                If you would like to adjust the tone, add a memory, or change the way you wrote or said something, simply log back into your account, update your responses, and resubmit the questionnaire. We will send you the revision.
              </p>

              <!-- CTA Button -->
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td align="center" style="padding: 20px 0;">
                    <a href="https://www.successionstory.now/login"
                       style="display: inline-block; padding: 16px 40px; background-color: #1a1a1a; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 500; border-radius: 30px;">
                      Login Here
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 16px 0 30px; font-size: 16px; line-height: 1.6; color: #4a4a4a;">
                This is the companion to your estate plan. Legal documents transfer assets. This letter carries your intention.
              </p>

              <!-- A Quick Reminder Section -->
              <h3 style="margin: 30px 0 16px; font-size: 18px; color: #1a1a1a; font-weight: 600;">
                A Quick Reminder
              </h3>
              <p style="margin: 0 0 16px; font-size: 16px; line-height: 1.6; color: #4a4a4a;">
                Your Succession Story is not a will, trust, or legal document, and it does not modify or replace your estate plan in any way. It is a companion to your legal documents. Those control the transfer of assets. This letter carries the meaning, values, and personal guidance behind them.
              </p>

              <!-- What Happens Next Section -->
              <h3 style="margin: 30px 0 16px; font-size: 18px; color: #1a1a1a; font-weight: 600;">
                What Happens Next
              </h3>
              <p style="margin: 0 0 16px; font-size: 16px; line-height: 1.6; color: #4a4a4a;">
                You may print your Succession Story and share it privately, or save it for a moment that feels right. Many clients choose to share it while they are here to answer questions, tell more stories, and enjoy the conversation that follows. Others choose to include a copy along with their estate plan documents.
              </p>
              <p style="margin: 0 0 16px; font-size: 16px; line-height: 1.6; color: #4a4a4a;">
                If you would prefer for us to deliver your letter on a specific future date, we offer scheduled delivery. Just let us know the timing and we will handle it with care.
              </p>
              <p style="margin: 0 0 16px; font-size: 16px; line-height: 1.6; color: #4a4a4a;">
                If you are satisfied with your Succession Story, you may choose to permanently delete your questionnaire responses. Simply use the delete option in your dashboard or email successionstory@gmail.com and we will take care of it. Once removed, your content cannot be restored.
              </p>

              <!-- Need anything Section -->
              <h3 style="margin: 30px 0 16px; font-size: 18px; color: #1a1a1a; font-weight: 600;">
                Need anything?
              </h3>
              <p style="margin: 0 0 8px; font-size: 16px; line-height: 1.6; color: #4a4a4a;">
                Simply reply to this email and we'll take care of it.
              </p>
              <p style="margin: 0 0 16px; font-size: 16px; line-height: 1.6; color: #4a4a4a;">
                We're honored to help you preserve what matters.
              </p>

              <p style="margin: 30px 0 0; font-size: 16px; line-height: 1.6; color: #4a4a4a; font-style: italic;">
                No blank pages. No long workbooks. No pressure to find the right words.
              </p>
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
              <p style="margin: 0 0 16px; font-size: 12px; color: #888888;">
                You're receiving this email because you purchased access to Succession Story.
              </p>
              <!-- Disclaimer -->
              <p style="margin: 20px 0 0; font-size: 11px; line-height: 1.4; color: #888888;">
                Succession Story does not provide legal or tax advice, does not create or modify any estate plan, and does not affect or override your will, trust, or other legal documents. Anything you write, including wishes about specific assets, is for personal expression only and has no legal effect. Thank you for choosing Succession Story.
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
 * Generates the HTML content for the welcome email with credentials
 */
function generateWelcomeEmailHTML(email: string, password: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>You're in — Succession Story</title>
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
                You're in. Your account is ready.
              </h2>

              <p style="margin: 0 0 16px; font-size: 16px; line-height: 1.6; color: #4a4a4a;">
                Most people think about writing a letter like this for years. You actually did something about it. That already puts you ahead.
              </p>

              <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.6; color: #4a4a4a;">
                Here's how this works: you answer a short guided questionnaire — 30 minutes, mostly multiple choice. We take your answers and write your Succession Story in your voice. You only pay when it's ready and you're happy with it.
              </p>

              <!-- Login Details Box -->
              <div style="background-color: #f8f6f2; padding: 24px; border-radius: 8px; margin: 0 0 30px;">
                <h3 style="margin: 0 0 16px; font-size: 18px; color: #1a1a1a; font-weight: 600;">
                  Your Login Details
                </h3>
                <p style="margin: 0 0 8px; font-size: 15px; color: #4a4a4a;">
                  <strong>Email:</strong> ${email}
                </p>
                <p style="margin: 0 0 16px; font-size: 15px; color: #4a4a4a;">
                  <strong>Temporary Password:</strong> ${password}
                </p>
                <p style="margin: 0; font-size: 13px; color: #8a7f78;">
                  We recommend changing your password after your first login.
                </p>
              </div>

              <!-- CTA Button -->
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td align="center" style="padding: 0 0 30px;">
                    <a href="https://www.successionstory.now/login"
                       style="display: inline-block; padding: 16px 40px; background-color: #1a1a1a; color: #B5A692; text-decoration: none; font-size: 16px; font-weight: 500; border-radius: 30px;">
                      Log In &amp; Start Now →
                    </a>
                  </td>
                </tr>
              </table>

              <!-- What Happens Next -->
              <h3 style="margin: 0 0 16px; font-size: 18px; color: #1a1a1a; font-weight: 600;">
                What happens next
              </h3>

              <div style="margin: 0 0 30px;">
                <div style="display: flex; margin-bottom: 16px;">
                  <table role="presentation" style="width: 100%; border-collapse: collapse;">
                    <tr>
                      <td style="width: 28px; vertical-align: top; padding-top: 2px;">
                        <span style="font-size: 13px; color: #B5A692; font-weight: 600;">01</span>
                      </td>
                      <td style="vertical-align: top; padding-bottom: 16px;">
                        <p style="margin: 0; font-size: 15px; line-height: 1.6; color: #4a4a4a;">
                          <strong style="color: #1a1a1a;">Log in with the details above.</strong> Your email will be prefilled on the login page.
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td style="width: 28px; vertical-align: top; padding-top: 2px;">
                        <span style="font-size: 13px; color: #B5A692; font-weight: 600;">02</span>
                      </td>
                      <td style="vertical-align: top; padding-bottom: 16px;">
                        <p style="margin: 0; font-size: 15px; line-height: 1.6; color: #4a4a4a;">
                          <strong style="color: #1a1a1a;">Answer the guided questionnaire.</strong> 30 minutes. Mostly multiple choice. Voice-to-text available. Your progress saves automatically — you can stop and come back anytime.
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td style="width: 28px; vertical-align: top; padding-top: 2px;">
                        <span style="font-size: 13px; color: #B5A692; font-weight: 600;">03</span>
                      </td>
                      <td style="vertical-align: top; padding-bottom: 16px;">
                        <p style="margin: 0; font-size: 15px; line-height: 1.6; color: #4a4a4a;">
                          <strong style="color: #1a1a1a;">We write your letter.</strong> Once you submit, we write your Succession Story in your voice. You'll be asked to pay $97 at this point — only after you've seen what we've built from your answers.
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td style="width: 28px; vertical-align: top; padding-top: 2px;">
                        <span style="font-size: 13px; color: #B5A692; font-weight: 600;">04</span>
                      </td>
                      <td style="vertical-align: top;">
                        <p style="margin: 0; font-size: 15px; line-height: 1.6; color: #4a4a4a;">
                          <strong style="color: #1a1a1a;">Your letter arrives by email.</strong> A finished PDF — your values, your stories, your message — written for the people you love. Ready to share whenever the moment feels right.
                        </p>
                      </td>
                    </tr>
                  </table>
                </div>
              </div>

              <!-- Divider -->
              <div style="border-top: 1px solid #e8e4de; margin: 10px 0 30px;"></div>

              <!-- Closing -->
              <p style="margin: 0 0 8px; font-size: 16px; line-height: 1.6; color: #4a4a4a; font-style: italic;">
                No blank pages. No long workbooks. No pressure to find the right words.
              </p>
              <p style="margin: 0; font-size: 16px; line-height: 1.6; color: #4a4a4a; font-style: italic;">
                You simply share what matters. We'll take it from here.
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #1a1a1a; border-radius: 0 0 12px 12px; text-align: center;">
              <p style="margin: 0 0 8px; font-size: 18px; color: #ffffff; font-family: 'Georgia', serif;">
                Succession <span style="color: #B5A692;">Story</span>
              </p>
              <p style="margin: 0 0 16px; font-size: 14px; color: #B5A692; font-style: italic;">
                Your legacy, written for you.
              </p>
              <p style="margin: 0 0 12px; font-size: 12px; color: #888888;">
                You're receiving this email because you created a free account at Succession Story.
              </p>
              <p style="margin: 0; font-size: 11px; line-height: 1.4; color: #555555;">
                Succession Story does not provide legal or tax advice and does not create or modify any estate plan.
                Your letter is for personal expression only and has no legal effect.
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
interface SubmissionNotificationParams {
  submitterName: string
  submitterEmail: string
  submissionId: string
}

/**
 * Sends an email notification when someone submits the questionnaire
 */
export async function sendSubmissionNotificationEmail({
  submitterName,
  submitterEmail,
  submissionId,
}: SubmissionNotificationParams): Promise<boolean> {
  // Check if SendGrid is configured
  if (!SENDGRID_API_KEY) {
    console.warn(
      '[Email] SendGrid API key not configured. Skipping submission notification.'
    )
    return false
  }

  const notificationEmail = process.env.SUBMISSION_NOTIFICATION_EMAIL || 'successionstory.now@gmail.com'

  const msg = {
    to: notificationEmail,
    from: {
      email: SENDGRID_FROM_EMAIL,
      name: 'Succession Story',
    },
    subject: `New Submission: ${submitterName} just completed their questionnaire`,
    text: `
NEW QUESTIONNAIRE SUBMISSION

${submitterName} has just submitted their Succession Story questionnaire.

Submitter Details:
- Name: ${submitterName}
- Email: ${submitterEmail}
- Submission ID: ${submissionId}
- Submitted at: ${new Date().toLocaleString()}

You can view the full submission in the admin dashboard:
https://www.successionstory.now/admin

---
Succession Story
Automated Notification
`,
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Submission</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Georgia', serif; background-color: #f8f6f2;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 30px 40px; background-color: #1a1a1a; border-radius: 12px 12px 0 0;">
              <h1 style="margin: 0; font-size: 24px; font-weight: normal; color: #ffffff;">
                Succession <span style="color: #B5A692;">Story</span>
              </h1>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px; font-size: 22px; color: #1a1a1a; font-weight: normal;">
                New Questionnaire Submission
              </h2>

              <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.6; color: #4a4a4a;">
                <strong>${submitterName}</strong> has just submitted their Succession Story questionnaire.
              </p>

              <!-- Details Box -->
              <div style="background-color: #f8f6f2; padding: 24px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin: 0 0 16px; font-size: 16px; color: #1a1a1a; font-weight: 600;">
                  Submitter Details
                </h3>
                <p style="margin: 0 0 8px; font-size: 15px; color: #4a4a4a;">
                  <strong>Name:</strong> ${submitterName}
                </p>
                <p style="margin: 0 0 8px; font-size: 15px; color: #4a4a4a;">
                  <strong>Email:</strong> ${submitterEmail}
                </p>
                <p style="margin: 0 0 8px; font-size: 15px; color: #4a4a4a;">
                  <strong>Submission ID:</strong> ${submissionId}
                </p>
                <p style="margin: 0; font-size: 15px; color: #4a4a4a;">
                  <strong>Submitted at:</strong> ${new Date().toLocaleString()}
                </p>
              </div>

              <!-- CTA Button -->
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td align="center" style="padding: 20px 0;">
                    <a href="https://www.successionstory.now/admin"
                       style="display: inline-block; padding: 14px 32px; background-color: #1a1a1a; color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 500; border-radius: 30px;">
                      View in Admin Dashboard
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; background-color: #1a1a1a; border-radius: 0 0 12px 12px; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #888888;">
                Automated notification from Succession Story
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`,
  }

  try {
    await sgMail.send(msg)
    console.log('[Email] Submission notification sent successfully', { submitterName, submitterEmail })
    return true
  } catch (error) {
    console.error('[Email] Failed to send submission notification:', error)
    return false
  }
}

/**
 * Sends the final Succession Story PDF as an email attachment
 *
 * @returns true if email was sent successfully, false otherwise
 */
export async function sendLetterEmail(
  to: string,
  pdfBase64: string
): Promise<boolean> {
  // Check if SendGrid is configured
  if (!SENDGRID_API_KEY) {
    console.warn(
      '[Email] SendGrid API key not configured. Skipping letter delivery email.',
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
    subject: 'Your Succession Story Is Ready',
    text: 'Your Succession Story is ready. We have attached the final PDF to this email.',
    html: generateLetterEmailHTML(),
    attachments: [
      {
        content: pdfBase64,
        filename: 'Your-Succession-Story.pdf',
        type: 'application/pdf',
        disposition: 'attachment',
      },
    ],
  }

  try {
    await sgMail.send(msg)
    console.log('[Email] Letter delivery email sent successfully', { to })
    return true
  } catch (error) {
    console.error('[Email] Failed to send letter delivery email:', error)
    return false
  }
}

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
