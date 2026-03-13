// lib/email-sequences/sequence-c.ts
// Sequence C — Started questionnaire, dropped off mid-way
// 4 emails over 7 days
// Trigger: current_section_index >= 3, status = 'in_progress', no activity 4+ hrs

export const SECTION_NAMES: Record<number, string> = {
  1: 'First Things First',
  2: 'Guidance For Stewardship',
  3: 'The Story Behind My Gifts',
  4: 'My Beliefs and Values',
  5: 'My Family',
  6: 'Pivotal Experiences In My Life',
  7: 'My Legacy',
  8: 'Final Thoughts',
  9: 'Tone and Voice',
}

const NEXT_SECTION_TEASE: Record<number, string> = {
  3: 'your beliefs and the values you want to pass down',
  4: 'the stories about your family, your spouse, your children, the people who shaped you',
  5: 'the pivotal experiences that made you who you are',
  6: 'your legacy and what you want to be remembered for',
  7: 'your final thoughts and the last words you want them to carry',
  8: 'the tone and voice of your letter',
}

export interface SequenceCContext {
  stoppedAtSection: number
  stoppedAtSectionName: string
  nextSectionTease: string
  email: string
  unsubscribeToken: string
}

// ─── Shared helpers ───────────────────────────────────────────────────────────

function buildUnsubscribeUrl(email: string, token: string): string {
  return `https://www.successionstory.now/api/unsubscribe?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`
}

function emailShell(content: string, unsubscribeUrl: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;font-family:'Georgia',serif;background-color:#f8f6f2;">
  <table role="presentation" style="width:100%;border-collapse:collapse;">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table role="presentation" style="max-width:600px;width:100%;border-collapse:collapse;background-color:#ffffff;border-radius:12px;box-shadow:0 4px 6px rgba(0,0,0,0.1);">
          <tr>
            <td style="padding:40px 40px 20px;text-align:center;background-color:#1a1a1a;border-radius:12px 12px 0 0;">
              <h1 style="margin:0;font-size:28px;font-weight:normal;color:#ffffff;">
                Succession <span style="color:#B5A692;">Story</span>
              </h1>
            </td>
          </tr>
          <tr>
            <td style="padding:40px;">
              ${content}
            </td>
          </tr>
          <tr>
            <td style="padding:24px 40px;background-color:#1a1a1a;border-radius:0 0 12px 12px;text-align:center;">
              <p style="margin:0 0 8px;font-size:16px;color:#ffffff;font-family:'Georgia',serif;">
                Succession <span style="color:#B5A692;">Story</span>
              </p>
              <p style="margin:0 0 12px;font-size:13px;color:#B5A692;font-style:italic;">Your legacy, written for you.</p>
              <p style="margin:0;font-size:11px;color:#555555;">
                You're receiving this because you started the Succession Story questionnaire.
                <br/><a href="${unsubscribeUrl}" style="color:#555555;">Unsubscribe</a>
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

function ctaButton(label: string): string {
  return `
    <table role="presentation" style="width:100%;border-collapse:collapse;">
      <tr>
        <td align="center" style="padding:24px 0;">
          <a href="https://www.successionstory.now/questionnaire"
             style="display:inline-block;padding:16px 40px;background-color:#1a1a1a;color:#B5A692;text-decoration:none;font-size:16px;font-weight:500;border-radius:30px;">
            ${label}
          </a>
        </td>
      </tr>
    </table>`
}

function p(text: string): string {
  return `<p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#4a4a4a;">${text}</p>`
}

function h2(text: string): string {
  return `<h2 style="margin:0 0 20px;font-size:24px;color:#1a1a1a;font-weight:normal;">${text}</h2>`
}

function savedBadge(sectionName: string): string {
  return `
    <div style="background-color:#f8f6f2;border-left:4px solid #B5A692;padding:16px 20px;border-radius:0 8px 8px 0;margin:0 0 24px;">
      <p style="margin:0 0 4px;font-size:12px;color:#B5A692;text-transform:uppercase;letter-spacing:0.1em;font-weight:600;">Progress saved</p>
      <p style="margin:0;font-size:15px;color:#1a1a1a;">You completed: <strong>${sectionName}</strong></p>
      <p style="margin:4px 0 0;font-size:13px;color:#8a7f78;">Your answers are exactly where you left them.</p>
    </div>`
}

// ─── Email generators ─────────────────────────────────────────────────────────

// Email 1 — Day 1. Remind them where they stopped. Show them what is still ahead.
function email1(ctx: SequenceCContext): string {
  const unsubUrl = buildUnsubscribeUrl(ctx.email, ctx.unsubscribeToken)
  return emailShell(`
    ${h2('You were halfway through something important.')}
    ${savedBadge(ctx.stoppedAtSectionName)}
    ${p(`You made it through <strong>${ctx.stoppedAtSectionName}</strong>. That section asks the questions most people avoid their whole lives.`)}
    ${p(`What comes next is ${ctx.nextSectionTease}. Those are the answers your family will read most closely.`)}
    ${p('Everything you wrote is saved. You pick up exactly where you left off.')}
    ${ctaButton('Continue Where I Left Off')}
    ${p('<em style="color:#8a7f78;font-size:14px;">No payment until your letter is written and you are happy with it.</em>')}
  `, unsubUrl)
}

// Email 2 — Day 2. The questions they haven't answered yet. Make it specific.
function email2(ctx: SequenceCContext): string {
  const unsubUrl = buildUnsubscribeUrl(ctx.email, ctx.unsubscribeToken)
  return emailShell(`
    ${h2('The questions you have not answered are the ones they will want most.')}
    ${p(`You stopped at <strong>${ctx.stoppedAtSectionName}</strong>.`)}
    ${p(`Still ahead: ${ctx.nextSectionTease}.`)}
    ${p('Those are the questions most people say they wish their parents had answered. Not the financial ones. The personal ones. The ones that say who you are, not just what you own.')}
    ${p('Your answers so far are still there. Fifteen minutes is probably all you need to finish.')}
    ${ctaButton('Finish the Questionnaire')}
  `, unsubUrl)
}

// Email 3 — Day 4. Social proof. Normalise the feeling of completion.
function email3(ctx: SequenceCContext): string {
  const unsubUrl = buildUnsubscribeUrl(ctx.email, ctx.unsubscribeToken)
  return emailShell(`
    ${h2('"The hardest part was starting. Once I was in it, I could not stop."')}
    ${p('That is what most people tell us after they finish.')}
    ${p(`You already did the hard part. You started. You answered real questions. You made it to <strong>${ctx.stoppedAtSectionName}</strong> before life got in the way.`)}
    ${p('The people who finish consistently say the same thing: they did not expect to feel the way they felt reading their own letter. Like hearing yourself clearly for the first time.')}
    ${p('Your answers are saved. Come back when you have fifteen quiet minutes.')}
    ${ctaButton('Pick Up Where I Left Off')}
    ${p('<em style="color:#8a7f78;font-size:14px;">Free to finish. Pay only when your letter is ready.</em>')}
  `, unsubUrl)
}

// Email 4 — Day 7. Last one. No pressure. Leave the door wide open.
function email4(ctx: SequenceCContext): string {
  const unsubUrl = buildUnsubscribeUrl(ctx.email, ctx.unsubscribeToken)
  return emailShell(`
    ${h2('Your progress is still here. Come back when you are ready.')}
    ${p('This is the last email we will send about your questionnaire.')}
    ${p(`You made it to <strong>${ctx.stoppedAtSectionName}</strong>. That work is not lost. Your account stays open and your answers stay saved.`)}
    ${p('Whenever the time feels right, tomorrow, next week, whenever, just log back in and continue. The letter will be there waiting to be written.')}
    ${ctaButton('Return to My Questionnaire')}
    ${p('<em style="color:#8a7f78;font-size:14px;">We are glad you started. The rest is yours to finish whenever you are ready.</em>')}
  `, unsubUrl)
}

// ─── Step config ──────────────────────────────────────────────────────────────

export const SEQUENCE_C_STEPS = [
  {
    step: 1,
    delayHours: 24,
    subject: (_ctx: SequenceCContext) =>
      `You were halfway through something important.`,
    getHTML: email1,
  },
  {
    step: 2,
    delayHours: 48,
    subject: (_ctx: SequenceCContext) =>
      `The questions you have not answered are the ones they will want most.`,
    getHTML: email2,
  },
  {
    step: 3,
    delayHours: 96,
    subject: (_ctx: SequenceCContext) =>
      `"The hardest part was starting." You already did that.`,
    getHTML: email3,
  },
  {
    step: 4,
    delayHours: 168,
    subject: (_ctx: SequenceCContext) =>
      `Your progress is saved. Come back when you are ready.`,
    getHTML: email4,
  },
]

// ─── Context builder ──────────────────────────────────────────────────────────

export function buildSequenceCContext(
  currentSectionIndex: number,
  email: string,
  unsubscribeToken: string
): SequenceCContext {
  const sectionName =
    SECTION_NAMES[currentSectionIndex] ?? `Section ${currentSectionIndex}`
  const nextTease =
    NEXT_SECTION_TEASE[currentSectionIndex] ??
    'the remaining sections of your story'

  return {
    stoppedAtSection: currentSectionIndex,
    stoppedAtSectionName: sectionName,
    nextSectionTease: nextTease,
    email,
    unsubscribeToken,
  }
}