// lib/email-sequences/sequence-b.ts
// Sequence B — Signed up, never started
// 4 emails over 7 days targeting people who created an account but never opened the questionnaire

export interface SequenceBEmailParams {
  to: string
  step: number // 1-4
  email: string
  unsubscribeToken: string
}

// ─── Shared helpers ───────────────────────────────────────────────────────────

function buildUnsubscribeUrl(email: string, token: string): string {
  return `https://www.successionstory.now/api/unsubscribe?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`
}

function emailShell(content: string, unsubscribeUrl: string, footerNote: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
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
              ${content}
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 40px; background-color: #1a1a1a; border-radius: 0 0 12px 12px; text-align: center;">
              <p style="margin: 0 0 8px; font-size: 16px; color: #ffffff; font-family: 'Georgia', serif;">
                Succession <span style="color: #B5A692;">Story</span>
              </p>
              <p style="margin: 0 0 12px; font-size: 13px; color: #B5A692; font-style: italic;">Your legacy, written for you.</p>
              <p style="margin: 0; font-size: 11px; color: #555555;">
                ${footerNote}
                <br/>
                <a href="${unsubscribeUrl}" style="color: #555555;">Unsubscribe</a>
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

// ─── Email 1 — Day 1. Remove the friction. Show them what this actually is. ───

function generateSequenceBEmail1HTML(email: string, token: string): string {
  const unsubUrl = buildUnsubscribeUrl(email, token)
  return emailShell(`
    <h2 style="margin: 0 0 20px; font-size: 24px; color: #1a1a1a; font-weight: normal;">
      You signed up. Let's start your story.
    </h2>
    <p style="margin: 0 0 16px; font-size: 16px; line-height: 1.6; color: #4a4a4a;">
      Something in this idea landed for you. The thought of leaving something behind that actually says what you mean. Most people carry that thought for years and never act on it.
    </p>
    <p style="margin: 0 0 16px; font-size: 16px; line-height: 1.6; color: #4a4a4a;">
      The questionnaire takes 30 minutes. Mostly multiple choice. You answer. We write.
    </p>
    <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.6; color: #4a4a4a;">
      You pay nothing until your letter is written and you are happy with it.
    </p>
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
      <tr>
        <td align="center" style="padding: 0 0 30px;">
          <a href="https://www.successionstory.now/login"
             style="display: inline-block; padding: 16px 40px; background-color: #1a1a1a; color: #B5A692; text-decoration: none; font-size: 16px; font-weight: 500; border-radius: 30px;">
            Start the Questionnaire
          </a>
        </td>
      </tr>
    </table>
    <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #8a7f78; font-style: italic;">
      No blank pages. No writing ability needed. No pressure.
    </p>
  `, unsubUrl, "You're receiving this because you created a free account at Succession Story.")
}

// ─── Email 2 — Day 3. The gap your will cannot fill. Specific contrast. ────────

function generateSequenceBEmail2HTML(email: string, token: string): string {
  const unsubUrl = buildUnsubscribeUrl(email, token)
  return emailShell(`
    <h2 style="margin: 0 0 24px; font-size: 24px; color: #1a1a1a; font-weight: normal;">
      Your will says <em>who</em> gets the house.<br/>
      It doesn't say <em>why</em> you bought it.
    </h2>
    <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.6; color: #4a4a4a;">
      Your will says who gets the house. It doesn't say why you trust them with it. It doesn't say why you bought it.
    </p>
    <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.6; color: #4a4a4a;">
      Legal documents transfer assets. They do not transfer meaning. The values you have lived by, the stories that shaped you, the message you want your family to carry forward. None of that fits in a will.
    </p>
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
      That is what your Succession Story does. Thirty minutes of guided questions. We write the rest in your voice. You pay only when it is done.
    </p>
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
      <tr>
        <td align="center" style="padding: 0 0 20px;">
          <a href="https://www.successionstory.now/login"
             style="display: inline-block; padding: 16px 40px; background-color: #1a1a1a; color: #B5A692; text-decoration: none; font-size: 16px; font-weight: 500; border-radius: 30px;">
            Start for Free
          </a>
        </td>
      </tr>
    </table>
  `, unsubUrl, "You're receiving this because you created a free account at Succession Story.")
}

// ─── Email 3 — Day 5. The VOC gut-punch. Plant the fear. ────────────────────

function generateSequenceBEmail3HTML(email: string, token: string): string {
  const unsubUrl = buildUnsubscribeUrl(email, token)
  return emailShell(`
    <div style="border-left: 4px solid #B5A692; padding: 16px 24px; margin: 0 0 28px; background-color: #f8f6f2; border-radius: 0 8px 8px 0;">
      <p style="margin: 0 0 8px; font-size: 22px; line-height: 1.4; color: #1a1a1a; font-style: italic;">
        &ldquo;I know she loved me. But I don&apos;t know if she liked me.&rdquo;
      </p>
      <p style="margin: 0; font-size: 13px; color: #8a7f78;">
        Written by a daughter, six months after her mother's funeral
      </p>
    </div>
    <p style="margin: 0 0 16px; font-size: 16px; line-height: 1.6; color: #4a4a4a;">
      That line stays with us.
    </p>
    <p style="margin: 0 0 16px; font-size: 16px; line-height: 1.6; color: #4a4a4a;">
      Not because it is dramatic. Because it is so ordinary. Most families carry this question. Most parents assume love is enough. It's not. Not without the words to say it.
    </p>
    <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.6; color: #4a4a4a;">
      The questionnaire takes 30 minutes. Don't let your children wonder.
    </p>
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
      <tr>
        <td align="center" style="padding: 0 0 20px;">
          <a href="https://www.successionstory.now/login"
             style="display: inline-block; padding: 16px 40px; background-color: #1a1a1a; color: #B5A692; text-decoration: none; font-size: 16px; font-weight: 500; border-radius: 30px;">
            Write Your Letter
          </a>
        </td>
      </tr>
    </table>
    <p style="margin: 0; font-size: 14px; color: #8a7f78; text-align: center;">
      Free to start. Pay only when your letter is ready.
    </p>
  `, unsubUrl, "You're receiving this because you created a free account at Succession Story.")
}

// ─── Email 4 — Day 7. "The thing about someday." Personal story from Romy. ──────────────

function generateSequenceBEmail4HTML(email: string, token: string): string {
  const unsubUrl = buildUnsubscribeUrl(email, token)
  return emailShell(`
    <h2 style="margin: 0 0 20px; font-size: 22px; color: #1a1a1a; font-weight: normal;">
      The thing about &ldquo;someday&rdquo;
    </h2>
    <p style="margin: 0 0 16px; font-size: 16px; line-height: 1.6; color: #4a4a4a;">
      &ldquo;I'll do it someday.&rdquo;
    </p>
    <p style="margin: 0 0 16px; font-size: 16px; line-height: 1.6; color: #4a4a4a;">
      I've said it. You've probably said it. We all have things we mean to do when life slows down, when the kids are settled, when things feel less busy.
    </p>
    <p style="margin: 0 0 16px; font-size: 16px; line-height: 1.6; color: #4a4a4a;">
      But here is what twenty years of sitting with families has taught me:
    </p>
    <p style="margin: 0 0 16px; font-size: 16px; line-height: 1.6; color: #1a1a1a; font-style: italic;">
      Life does not slow down. It simply changes shape.
    </p>
    <p style="margin: 0 0 16px; font-size: 16px; line-height: 1.6; color: #4a4a4a;">
      The business of raising children becomes the business of grandchildren. The demands of building something become the demands of sustaining it. And the things we mean to do someday have a quiet way of becoming the things we never quite got to.
    </p>
    <p style="margin: 0 0 16px; font-size: 16px; line-height: 1.6; color: #4a4a4a;">
      You are not too busy to do this. You are exactly busy enough to need to do it now.
    </p>
    <p style="margin: 0 0 16px; font-size: 16px; line-height: 1.6; color: #4a4a4a;">
      Succession Story takes less than an hour. It asks nothing of you except honesty. And what it gives your family &mdash; clarity, connection, the sound of your voice when they need it most &mdash; cannot be replicated by anything else you could do today.
    </p>
    <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.6; color: #4a4a4a;">
      Someday is a beautiful word. Today is a better one.
    </p>
    <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.6; color: #4a4a4a;">
      Thirty minutes. Your words. Your voice. We handle the rest.
    </p>
    <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.6; color: #4a4a4a;">
      Warmly,<br/><strong>Romy</strong>
    </p>
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
      <tr>
        <td align="center" style="padding: 0 0 30px;">
          <a href="https://www.successionstory.now/login"
             style="display: inline-block; padding: 16px 40px; background-color: #1a1a1a; color: #B5A692; text-decoration: none; font-size: 16px; font-weight: 500; border-radius: 30px;">
            Start When You're Ready
          </a>
        </td>
      </tr>
    </table>
    <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #8a7f78; font-style: italic; text-align: center;">
      The letter your family will wish they had. You can still write it.
    </p>
  `, unsubUrl, "You're receiving this because you created a free account at Succession Story.")
}

// ─── Step config ──────────────────────────────────────────────────────────────

export const SEQUENCE_B_STEPS = [
  {
    step: 1,
    subject: "You signed up. Let's start your story.",
    delayHours: 24,
    getHTML: generateSequenceBEmail1HTML,
  },
  {
    step: 2,
    subject: "Your will says who. It doesn't say why.",
    delayHours: 72,
    getHTML: generateSequenceBEmail2HTML,
  },
  {
    step: 3,
    subject: '"I know she loved me. But I don\'t know if she liked me."',
    delayHours: 120,
    getHTML: generateSequenceBEmail3HTML,
  },
  {
    step: 4,
    subject: 'The thing about "someday"',
    delayHours: 168,
    getHTML: generateSequenceBEmail4HTML,
  },
]