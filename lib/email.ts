import sgMail from '@sendgrid/mail'

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY
const SENDGRID_FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL || 'noreply@successionstory.com'

if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY)
}

// ─── INTERFACES ───────────────────────────────────────────────────

interface WelcomeEmailParams {
  to: string
  magicLink: string
}

interface SubmissionNotificationParams {
  submitterName: string
  submitterEmail: string
  submissionId: string
}

// ─── HTML GENERATORS ──────────────────────────────────────────────

function generateWelcomeEmailHTML(magicLink: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>You're in. Start your letter.</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Georgia', serif; background-color: #f8f6f2;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">

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
                Your account is ready.
              </h2>

              <p style="margin: 0 0 16px; font-size: 16px; line-height: 1.6; color: #4a4a4a;">
                Most people think about writing something like this for years. You took the first step. That matters.
              </p>

              <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.6; color: #4a4a4a;">
                Click the button below to continue your letter. No password needed.
              </p>

              <!-- CTA Button -->
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td align="center" style="padding: 0 0 30px;">
                    <a href="${magicLink}"
                       style="display: inline-block; padding: 16px 40px; background-color: #1a1a1a; color: #B5A692; text-decoration: none; font-size: 16px; font-weight: 500; border-radius: 30px;">
                      Continue writing my letter
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 16px; font-size: 13px; line-height: 1.6; color: #8a7f78; text-align: center;">
                This link is personal to you. It expires in 24 hours.
              </p>

              <!-- Divider -->
              <div style="border-top: 1px solid #e8e4de; margin: 30px 0;"></div>

              <!-- What Happens Next -->
              <h3 style="margin: 0 0 16px; font-size: 18px; color: #1a1a1a; font-weight: 600;">
                What happens next
              </h3>

              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="width: 28px; vertical-align: top; padding-top: 2px;">
                    <span style="font-size: 13px; color: #B5A692; font-weight: 600;">01</span>
                  </td>
                  <td style="vertical-align: top; padding-bottom: 16px;">
                    <p style="margin: 0; font-size: 15px; line-height: 1.6; color: #4a4a4a;">
                      <strong style="color: #1a1a1a;">Answer the guided questions.</strong> No writing skill needed. You talk, we write.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="width: 28px; vertical-align: top; padding-top: 2px;">
                    <span style="font-size: 13px; color: #B5A692; font-weight: 600;">02</span>
                  </td>
                  <td style="vertical-align: top; padding-bottom: 16px;">
                    <p style="margin: 0; font-size: 15px; line-height: 1.6; color: #4a4a4a;">
                      <strong style="color: #1a1a1a;">We write your letter.</strong> Your answers become a finished letter in your voice.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="width: 28px; vertical-align: top; padding-top: 2px;">
                    <span style="font-size: 13px; color: #B5A692; font-weight: 600;">03</span>
                  </td>
                  <td style="vertical-align: top;">
                    <p style="margin: 0; font-size: 15px; line-height: 1.6; color: #4a4a4a;">
                      <strong style="color: #1a1a1a;">Your family keeps it forever.</strong> A finished letter, ready to share when the moment feels right.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Closing -->
              <div style="border-top: 1px solid #e8e4de; margin: 30px 0 20px;"></div>
              <p style="margin: 0; font-size: 15px; line-height: 1.6; color: #4a4a4a; font-style: italic;">
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
              <p style="margin: 0 0 16px; font-size: 14px; color: #B5A692; font-style: italic;">
                Your legacy, written for you.
              </p>
              <p style="margin: 0 0 12px; font-size: 12px; color: #888888;">
                You received this because you signed up at Succession Story. This link expires in 24 hours.
              </p>
              <p style="margin: 0; font-size: 11px; line-height: 1.4; color: #555555;">
                Succession Story does not provide legal or tax advice and does not create or modify any estate plan.
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

function generateWelcomeEmailText(magicLink: string): string {
  return `
SUCCESSION STORY

Your account is ready.

Most people think about writing something like this for years. You took the first step.

Click the link below to continue your letter. No password needed.

${magicLink}

This link is personal to you and expires in 24 hours.

---

WHAT HAPPENS NEXT

01. Answer the guided questions. No writing skill needed. You talk, we write.
02. We write your letter. Your answers become a finished letter in your voice.
03. Your family keeps it forever.

No blank pages. No long workbooks. No pressure to find the right words.

---

Succession Story
Your legacy, written for you.
`
}

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
                We recommend reading your letter once on your own in a quiet place. Give yourself a few uninterrupted minutes to sit with it.
              </p>

              <p style="margin: 0 0 16px; font-size: 16px; line-height: 1.6; color: #4a4a4a;">
                If you would like to adjust the tone, add a memory, or change the way something was written, log back into your account, update your responses, and resubmit. We will send you the revision.
              </p>

              <!-- CTA Button -->
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td align="center" style="padding: 20px 0;">
                    <a href="https://www.successionstory.now/login"
                       style="display: inline-block; padding: 16px 40px; background-color: #1a1a1a; color: #B5A692; text-decoration: none; font-size: 16px; font-weight: 500; border-radius: 30px;">
                      Log back in
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 16px 0 30px; font-size: 16px; line-height: 1.6; color: #4a4a4a;">
                This is the companion to your estate plan. Legal documents transfer assets. This letter carries your intention.
              </p>

              <h3 style="margin: 30px 0 16px; font-size: 18px; color: #1a1a1a; font-weight: 600;">
                Need anything?
              </h3>
              <p style="margin: 0 0 16px; font-size: 16px; line-height: 1.6; color: #4a4a4a;">
                Simply reply to this email and we'll take care of it.
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
              <p style="margin: 20px 0 0; font-size: 11px; line-height: 1.4; color: #888888;">
                Succession Story does not provide legal or tax advice, does not create or modify any estate plan, and does not affect or override your will, trust, or other legal documents.
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

// ─── EXPORTED FUNCTIONS ───────────────────────────────────────────

/**
 * Sends welcome email with a one-click magic link to /questionnaire.
 * No password. No login step. One click lands them in the funnel.
 */
export async function sendWelcomeEmail({
  to,
  magicLink,
}: WelcomeEmailParams): Promise<boolean> {
  if (!SENDGRID_API_KEY) {
    console.warn('[Email] SendGrid API key not configured. Skipping welcome email.', { to })
    return false
  }

  const msg = {
    to,
    from: {
      email: SENDGRID_FROM_EMAIL,
      name: 'Succession Story',
    },
    subject: 'One click to start your letter.',
    text: generateWelcomeEmailText(magicLink),
    html: generateWelcomeEmailHTML(magicLink),
  }

  try {
    await sgMail.send(msg)
    console.log('[Email] Welcome email sent successfully', { to })
    return true
  } catch (error) {
    console.error('[Email] Failed to send welcome email:', error)
    return false
  }
}

/**
 * Sends the final Succession Story PDF as an email attachment.
 */
export async function sendLetterEmail(
  to: string,
  pdfBase64: string
): Promise<boolean> {
  if (!SENDGRID_API_KEY) {
    console.warn('[Email] SendGrid API key not configured. Skipping letter delivery email.', { to })
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

/**
 * Sends an internal notification when someone submits the questionnaire.
 */
export async function sendSubmissionNotificationEmail({
  submitterName,
  submitterEmail,
  submissionId,
}: SubmissionNotificationParams): Promise<boolean> {
  if (!SENDGRID_API_KEY) {
    console.warn('[Email] SendGrid API key not configured. Skipping submission notification.')
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

Name: ${submitterName}
Email: ${submitterEmail}
Submission ID: ${submissionId}
Submitted at: ${new Date().toLocaleString()}

View in admin: https://www.successionstory.now/admin
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
          <tr>
            <td style="padding: 30px 40px; background-color: #1a1a1a; border-radius: 12px 12px 0 0;">
              <h1 style="margin: 0; font-size: 24px; font-weight: normal; color: #ffffff;">
                Succession <span style="color: #B5A692;">Story</span>
              </h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px; font-size: 22px; color: #1a1a1a; font-weight: normal;">
                New Questionnaire Submission
              </h2>
              <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.6; color: #4a4a4a;">
                <strong>${submitterName}</strong> has just submitted their questionnaire.
              </p>
              <div style="background-color: #f8f6f2; padding: 24px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 0 0 8px; font-size: 15px; color: #4a4a4a;"><strong>Name:</strong> ${submitterName}</p>
                <p style="margin: 0 0 8px; font-size: 15px; color: #4a4a4a;"><strong>Email:</strong> ${submitterEmail}</p>
                <p style="margin: 0 0 8px; font-size: 15px; color: #4a4a4a;"><strong>Submission ID:</strong> ${submissionId}</p>
                <p style="margin: 0; font-size: 15px; color: #4a4a4a;"><strong>Submitted at:</strong> ${new Date().toLocaleString()}</p>
              </div>
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
          <tr>
            <td style="padding: 24px 40px; background-color: #1a1a1a; border-radius: 0 0 12px 12px; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #888888;">Automated notification from Succession Story</p>
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