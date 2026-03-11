// lib/email-sequences/sequence-b.ts
// Sequence B — Signed up, never started
// 4 emails over 7 days targeting people who created an account but never opened the questionnaire

export interface SequenceBEmailParams {
  to: string
  step: number // 1-4
}

function generateSequenceBEmail1HTML(): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your account is ready</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Georgia', serif; background-color: #f8f6f2;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; background-color: #1a1a1a; border-radius: 12px 12px 0 0;">
              <h1 style="margin: 0; font-size: 28px; font-weight: normal; color: #ffffff;">
                Succession <span style="color: #B5A692;">Story</span>
              </h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px; font-size: 24px; color: #1a1a1a; font-weight: normal;">
                Your account is ready — the hard part is just starting.
              </h2>
              <p style="margin: 0 0 16px; font-size: 16px; line-height: 1.6; color: #4a4a4a;">
                You signed up. That means something already landed for you — the idea of leaving something behind that actually says what you mean.
              </p>
              <p style="margin: 0 0 16px; font-size: 16px; line-height: 1.6; color: #4a4a4a;">
                Most people never get this far. You did. The questionnaire takes 30 minutes. Mostly multiple choice. We handle the writing — you just answer.
              </p>
              <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.6; color: #4a4a4a;">
                You only pay when your letter is written and you're happy with it. Nothing to lose by starting.
              </p>
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td align="center" style="padding: 0 0 30px;">
                    <a href="https://www.successionstory.now/login"
                       style="display: inline-block; padding: 16px 40px; background-color: #1a1a1a; color: #B5A692; text-decoration: none; font-size: 16px; font-weight: 500; border-radius: 30px;">
                      Start the Questionnaire →
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #8a7f78; font-style: italic;">
                No blank pages. No long workbooks. No pressure to find the right words.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 40px; background-color: #1a1a1a; border-radius: 0 0 12px 12px; text-align: center;">
              <p style="margin: 0 0 8px; font-size: 16px; color: #ffffff; font-family: 'Georgia', serif;">
                Succession <span style="color: #B5A692;">Story</span>
              </p>
              <p style="margin: 0 0 12px; font-size: 13px; color: #B5A692; font-style: italic;">Your legacy, written for you.</p>
              <p style="margin: 0; font-size: 11px; color: #555555;">
                You're receiving this because you created a free account at Succession Story.
                <br/>
                <a href="https://www.successionstory.now/unsubscribe" style="color: #555555;">Unsubscribe</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

function generateSequenceBEmail2HTML(): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>What legal documents can't say</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Georgia', serif; background-color: #f8f6f2;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; background-color: #1a1a1a; border-radius: 12px 12px 0 0;">
              <h1 style="margin: 0; font-size: 28px; font-weight: normal; color: #ffffff;">
                Succession <span style="color: #B5A692;">Story</span>
              </h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 24px; font-size: 24px; color: #1a1a1a; font-weight: normal;">
                Your will says <em>who</em> gets the house.<br/>
                It doesn't say <em>why you bought it.</em>
              </h2>

              <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.6; color: #4a4a4a;">
                Legal documents transfer assets. They don't transfer meaning.
                The values you've lived by, the stories that shaped you, the message you want your family to carry forward — none of that fits in a will.
              </p>

              <!-- Contrast block -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 0 0 28px;">
                <tr>
                  <td style="width: 50%; padding: 16px; background-color: #f0ede8; border-radius: 8px 0 0 8px; vertical-align: top;">
                    <p style="margin: 0 0 6px; font-size: 12px; color: #8a7f78; text-transform: uppercase; letter-spacing: 0.1em;">Your will says</p>
                    <p style="margin: 0; font-size: 14px; color: #4a4a4a;">Who gets the money.</p>
                  </td>
                  <td style="width: 4px; background-color: #ffffff;"></td>
                  <td style="width: 50%; padding: 16px; background-color: #1a1a1a; border-radius: 0 8px 8px 0; vertical-align: top;">
                    <p style="margin: 0 0 6px; font-size: 12px; color: #B5A692; text-transform: uppercase; letter-spacing: 0.1em;">Your letter says</p>
                    <p style="margin: 0; font-size: 14px; color: #ffffff;">What you hope they do with it.</p>
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.6; color: #4a4a4a;">
                That's what your Succession Story does. Thirty minutes of guided questions. We write the rest in your voice.
                You only pay when it's done.
              </p>

              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td align="center" style="padding: 0 0 20px;">
                    <a href="https://www.successionstory.now/login"
                       style="display: inline-block; padding: 16px 40px; background-color: #1a1a1a; color: #B5A692; text-decoration: none; font-size: 16px; font-weight: 500; border-radius: 30px;">
                      Start for Free →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 40px; background-color: #1a1a1a; border-radius: 0 0 12px 12px; text-align: center;">
              <p style="margin: 0 0 8px; font-size: 16px; color: #ffffff; font-family: 'Georgia', serif;">
                Succession <span style="color: #B5A692;">Story</span>
              </p>
              <p style="margin: 0 0 12px; font-size: 13px; color: #B5A692; font-style: italic;">Your legacy, written for you.</p>
              <p style="margin: 0; font-size: 11px; color: #555555;">
                You're receiving this because you created a free account at Succession Story.
                <br/>
                <a href="https://www.successionstory.now/unsubscribe" style="color: #555555;">Unsubscribe</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

function generateSequenceBEmail3HTML(): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>I know she loved me</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Georgia', serif; background-color: #f8f6f2;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; background-color: #1a1a1a; border-radius: 12px 12px 0 0;">
              <h1 style="margin: 0; font-size: 28px; font-weight: normal; color: #ffffff;">
                Succession <span style="color: #B5A692;">Story</span>
              </h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <!-- Pull quote -->
              <div style="border-left: 4px solid #B5A692; padding: 16px 24px; margin: 0 0 28px; background-color: #f8f6f2; border-radius: 0 8px 8px 0;">
                <p style="margin: 0 0 8px; font-size: 22px; line-height: 1.4; color: #1a1a1a; font-style: italic;">
                  &ldquo;I know she loved me. But I don&apos;t know if she <em>liked</em> me.&rdquo;
                </p>
                <p style="margin: 0; font-size: 13px; color: #8a7f78;">
                  — Written by a daughter, six months after her mother's funeral
                </p>
              </div>

              <p style="margin: 0 0 16px; font-size: 16px; line-height: 1.6; color: #4a4a4a;">
                That line has stayed with us since we first read it.
              </p>

              <p style="margin: 0 0 16px; font-size: 16px; line-height: 1.6; color: #4a4a4a;">
                Not because it's dramatic. Because it's so ordinary. Most families carry this question. And most parents have no idea — because they assumed love was enough. It isn't. Not without words.
              </p>

              <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.6; color: #4a4a4a;">
                Your account is still here. The questionnaire takes 30 minutes. Don't let your children wonder.
              </p>

              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td align="center" style="padding: 0 0 20px;">
                    <a href="https://www.successionstory.now/login"
                       style="display: inline-block; padding: 16px 40px; background-color: #1a1a1a; color: #B5A692; text-decoration: none; font-size: 16px; font-weight: 500; border-radius: 30px;">
                      Write Your Letter →
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 0; font-size: 14px; color: #8a7f78; text-align: center;">
                Free to start. Pay only when your letter is ready.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 40px; background-color: #1a1a1a; border-radius: 0 0 12px 12px; text-align: center;">
              <p style="margin: 0 0 8px; font-size: 16px; color: #ffffff; font-family: 'Georgia', serif;">
                Succession <span style="color: #B5A692;">Story</span>
              </p>
              <p style="margin: 0 0 12px; font-size: 13px; color: #B5A692; font-style: italic;">Your legacy, written for you.</p>
              <p style="margin: 0; font-size: 11px; color: #555555;">
                You're receiving this because you created a free account at Succession Story.
                <br/>
                <a href="https://www.successionstory.now/unsubscribe" style="color: #555555;">Unsubscribe</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

function generateSequenceBEmail4HTML(): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Last one from us</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Georgia', serif; background-color: #f8f6f2;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; background-color: #1a1a1a; border-radius: 12px 12px 0 0;">
              <h1 style="margin: 0; font-size: 28px; font-weight: normal; color: #ffffff;">
                Succession <span style="color: #B5A692;">Story</span>
              </h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px; font-size: 22px; color: #1a1a1a; font-weight: normal;">
                This is the last email we'll send.
              </h2>

              <p style="margin: 0 0 16px; font-size: 16px; line-height: 1.6; color: #4a4a4a;">
                We won't keep nudging you. That's not what this is.
              </p>

              <p style="margin: 0 0 16px; font-size: 16px; line-height: 1.6; color: #4a4a4a;">
                But your account is still active. Your login still works. If the time ever feels right — tomorrow, next month, whenever — the questionnaire will be there.
              </p>

              <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.6; color: #4a4a4a;">
                Thirty minutes. Your words. Your voice. We handle the rest.
              </p>

              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td align="center" style="padding: 0 0 30px;">
                    <a href="https://www.successionstory.now/login"
                       style="display: inline-block; padding: 16px 40px; background-color: #1a1a1a; color: #B5A692; text-decoration: none; font-size: 16px; font-weight: 500; border-radius: 30px;">
                      Start When You're Ready →
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #8a7f78; font-style: italic; text-align: center;">
                We're glad you considered it. The letter your family will wish they had — you can still write it.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 40px; background-color: #1a1a1a; border-radius: 0 0 12px 12px; text-align: center;">
              <p style="margin: 0 0 8px; font-size: 16px; color: #ffffff; font-family: 'Georgia', serif;">
                Succession <span style="color: #B5A692;">Story</span>
              </p>
              <p style="margin: 0 0 12px; font-size: 13px; color: #B5A692; font-style: italic;">Your legacy, written for you.</p>
              <p style="margin: 0; font-size: 11px; color: #555555;">
                You're receiving this because you created a free account at Succession Story.
                <br/>
                <a href="https://www.successionstory.now/unsubscribe" style="color: #555555;">Unsubscribe</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

export const SEQUENCE_B_STEPS = [
  {
    step: 1,
    subject: "Your account is ready — the letter isn't written yet.",
    delayHours: 24, // 1 day after signup
    getHTML: generateSequenceBEmail1HTML,
  },
  {
    step: 2,
    subject: "Your will says who. It doesn't say why.",
    delayHours: 72, // 3 days after signup
    getHTML: generateSequenceBEmail2HTML,
  },
  {
    step: 3,
    subject: '"I know she loved me. But I don\'t know if she liked me."',
    delayHours: 120, // 5 days after signup
    getHTML: generateSequenceBEmail3HTML,
  },
  {
    step: 4,
    subject: "This is the last email we'll send.",
    delayHours: 168, // 7 days after signup
    getHTML: generateSequenceBEmail4HTML,
  },
]