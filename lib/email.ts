import sgMail from '@sendgrid/mail'

// Initialize SendGrid if API key is available
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY
const SENDGRID_FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL || 'noreply@successionstory.com'

if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY)
}

interface WelcomeEmailParams {
  to: string
  passwordResetLink: string
}

/**
 * Generates the HTML content for the welcome email
 */
function generateWelcomeEmailHTML(passwordResetLink: string): string {
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

              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #4a4a4a;">
                Thank you for your purchase. You now have access to create your personal legacy letter - a meaningful companion to your estate plan that shares your values, wisdom, and love with your family.
              </p>

              <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.6; color: #4a4a4a;">
                To get started, please set your password by clicking the button below:
              </p>

              <!-- CTA Button -->
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td align="center" style="padding: 20px 0;">
                    <a href="${passwordResetLink}"
                       style="display: inline-block; padding: 16px 40px; background-color: #1a1a1a; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 500; border-radius: 30px; transition: background-color 0.3s;">
                      Set Your Password
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 30px 0 20px; font-size: 16px; line-height: 1.6; color: #4a4a4a;">
                Once you've set your password, you can log in and begin answering our guided questions. Your responses will be crafted into a beautiful, personalized letter in your own voice.
              </p>

              <!-- What to Expect Section -->
              <div style="background-color: #f8f6f2; padding: 24px; border-radius: 8px; margin: 30px 0;">
                <h3 style="margin: 0 0 16px; font-size: 18px; color: #1a1a1a; font-weight: 600;">
                  What to Expect
                </h3>
                <ul style="margin: 0; padding-left: 20px; font-size: 15px; line-height: 1.8; color: #4a4a4a;">
                  <li>A guided questionnaire that takes about 30-60 minutes</li>
                  <li>Voice-to-text options for easier storytelling</li>
                  <li>Your completed Succession Story delivered within 24 hours</li>
                </ul>
              </div>

              <p style="margin: 0 0 10px; font-size: 14px; color: #888888;">
                If the button doesn't work, copy and paste this link into your browser:
              </p>
              <p style="margin: 0 0 30px; font-size: 14px; color: #B5A692; word-break: break-all;">
                ${passwordResetLink}
              </p>
            </td>
          </tr>

          <!-- Support Section -->
          <tr>
            <td style="padding: 0 40px 40px;">
              <div style="border-top: 1px solid #e5e5e5; padding-top: 30px;">
                <h3 style="margin: 0 0 12px; font-size: 16px; color: #1a1a1a; font-weight: 600;">
                  Need Help?
                </h3>
                <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #4a4a4a;">
                  If you have any questions or need assistance, please don't hesitate to reach out to our support team at
                  <a href="mailto:successionstory.now@gmail.com" style="color: #B5A692; text-decoration: none;">successionstory.now@gmail.com</a>
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #f8f6f2; border-radius: 0 0 12px 12px; text-align: center;">
              <p style="margin: 0 0 10px; font-size: 14px; color: #888888;">
                Succession Story - Your legacy, in your words.
              </p>
              <p style="margin: 0; font-size: 12px; color: #aaaaaa;">
                This email was sent because you purchased access to Succession Story.
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
function generateWelcomeEmailText(passwordResetLink: string): string {
  return `
Welcome to Succession Story

Thank you for your purchase. You now have access to create your personal legacy letter - a meaningful companion to your estate plan that shares your values, wisdom, and love with your family.

To get started, please set your password by clicking the link below:

${passwordResetLink}

Once you've set your password, you can log in and begin answering our guided questions. Your responses will be crafted into a beautiful, personalized letter in your own voice.

What to Expect:
- A guided questionnaire that takes about 30-60 minutes
- Voice-to-text options for easier storytelling
- Your completed Succession Story delivered within 24 hours

Need Help?
If you have any questions or need assistance, please don't hesitate to reach out to our support team at successionstory.now@gmail.com

---
Succession Story - Your legacy, in your words.
This email was sent because you purchased access to Succession Story.
`
}

/**
 * Sends a welcome email with password setup link
 *
 * @returns true if email was sent successfully, false otherwise
 */
export async function sendWelcomeEmail({
  to,
  passwordResetLink,
}: WelcomeEmailParams): Promise<boolean> {
  // Check if SendGrid is configured
  if (!SENDGRID_API_KEY) {
    console.warn(
      '[Email] SendGrid API key not configured. Skipping welcome email.',
      { to, passwordResetLink }
    )
    return false
  }

  const msg = {
    to,
    from: {
      email: SENDGRID_FROM_EMAIL,
      name: 'Succession Story',
    },
    subject: 'Welcome to Succession Story - Set Your Password',
    text: generateWelcomeEmailText(passwordResetLink),
    html: generateWelcomeEmailHTML(passwordResetLink),
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
