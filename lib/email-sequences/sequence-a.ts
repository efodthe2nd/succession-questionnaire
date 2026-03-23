// lib/email-sequences/sequence-a.ts
// Sequence A — Completed questionnaire, did NOT pay
// 7 emails over 7 days, personalised from their actual answers

import sgMail from '@sendgrid/mail'

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY!
const SENDGRID_FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL || 'noreply@successionstory.com'

if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY)
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SequenceAPersonalisation {
  email: string              // needed to build unsubscribe link
  unsubscribeToken: string   // needed to build unsubscribe link
  spouseName: string | null
  childNames: string[]
  signOffName: string | null   // q7_5
  coreValue: string | null     // q2_5
  legacyStatement: string | null // q4_3
  finalWish: string | null     // q7_6
  advice: string | null        // q7_4
}

// ─── HTML helpers ─────────────────────────────────────────────────────────────

function emailShell(content: string, unsubscribeUrl: string, footerNote: string): string {
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
                ${footerNote}
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

function ctaButton(label: string, href: string = 'https://www.successionstory.now/questionnaire'): string {
  return `
    <table role="presentation" style="width:100%;border-collapse:collapse;">
      <tr>
        <td align="center" style="padding:24px 0;">
          <a href="${href}"
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

function quote(text: string): string {
  return `
    <div style="border-left:4px solid #B5A692;padding:16px 24px;margin:0 0 24px;background-color:#f8f6f2;border-radius:0 8px 8px 0;">
      <p style="margin:0;font-size:18px;line-height:1.5;color:#1a1a1a;font-style:italic;">&ldquo;${text}&rdquo;</p>
    </div>`
}

function signOff(name: string): string {
  return `<p style="margin:24px 0 0;font-size:16px;line-height:1.6;color:#4a4a4a;">Warmly,<br/><strong>${name}</strong></p>`
}

function buildUnsubscribeUrl(email: string, token: string): string {
  return `https://www.successionstory.now/api/unsubscribe?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`
}

// ─── Email generators ─────────────────────────────────────────────────────────

// Email 1 — Day 1. Pure WIIFM. You did the work. One step left.
function email1(p_: SequenceAPersonalisation): string {
  const familyLine = buildFamilyLine(p_)
  const unsubUrl = buildUnsubscribeUrl(p_.email, p_.unsubscribeToken)
  return emailShell(`
    ${p(`You answered every question. You shared your thoughts about ${familyLine}. Everything is ready.`)}
    ${p('But your letter is not written yet.')}
    ${p(`The only thing left is to confirm your payment, and we'll turn your answers into the letter your family will treasure.`)}
    ${p('$97. Your answers are saved, and we\'ll take care of the rest.')}
    ${ctaButton('Write My Letter Now')}
    ${p('<em style="color:#8a7f78;">30-day money-back guarantee. No questions asked.</em>')}
  `, unsubUrl, "You're receiving this because you completed the Succession Story questionnaire.")
}

// Email 2 — Day 2. Reframe the effort they already invested.
function email2(p_: SequenceAPersonalisation): string {
  const signOffName = p_.signOffName ?? 'Friend'
  const unsubUrl = buildUnsubscribeUrl(p_.email, p_.unsubscribeToken)
  return emailShell(`
    ${p('Most people think about doing something like this for years. They sit with the intention. They never act on it.')}
    ${p('You acted on it. You answered every section. Every question.')}
    ${p('The only remaining step is unlocking the letter we write from your answers. That is it. Nothing more to fill in. Nothing more to think through.')}
    ${p('Let us take it from here. Your letter is ready to be written.')}
    ${ctaButton('Get My Letter')}
    ${p('<em style="color:#8a7f78;">$97. 30-day money-back guarantee. No questions asked.</em>')}
  `, unsubUrl, "You're receiving this because you completed the Succession Story questionnaire.")
}

// Email 3 — Day 3. Mirror their own words back at them. Identity moment.
function email3(p_: SequenceAPersonalisation): string {
  const value = p_.coreValue
    ? p_.coreValue.split(':')[0].trim()
    : 'what you value most'
  const unsubUrl = buildUnsubscribeUrl(p_.email, p_.unsubscribeToken)
  return emailShell(`
    ${p(`You told us the most important thing you want to pass down is ${value}.`)}
    ${p('That is not in your will. It is not in your estate plan. It\'s in your words.')}
    ${p('Your letter will carry your voice, your values, and your wisdom. It\'s ready to be written from the answers you\'ve already shared.')}
    ${quote(p_.coreValue ?? value)}
    ${p('That deserves to be read by the people it was meant for.')}
    ${ctaButton('Send Them This')}
  `, unsubUrl, "You're receiving this because you completed the Succession Story questionnaire.")
}

// Email 4 — Day 4. Pure personalisation. Show them what they wrote.
function email4(p_: SequenceAPersonalisation): string {
  const legacy = p_.legacyStatement ?? 'leave something meaningful behind'
  const unsubUrl = buildUnsubscribeUrl(p_.email, p_.unsubscribeToken)
  return emailShell(`
    ${p('When we asked what you hoped to leave behind, you wrote:')}
    ${quote(legacy)}
    ${p('That\'s your legacy. That\'s what your family will carry forward.')}
    ${p('We\'re ready to turn your words into the letter they\'ll hold onto forever. Make sure they hear you.')}
    ${ctaButton('Finish What You Started')}
  `, unsubUrl, "You're receiving this because you completed the Succession Story questionnaire.")
}

// Email 5 — Day 5. Urgency. Undelivered wish.
function email5(p_: SequenceAPersonalisation): string {
  const wish = p_.finalWish ?? 'stay close and look after each other'
  const childLine = p_.childNames.length > 0
    ? p_.childNames.join(', ')
    : 'the people you love'
  const unsubUrl = buildUnsubscribeUrl(p_.email, p_.unsubscribeToken)
  return emailShell(`
    ${p(`You said you want ${childLine} to ${wish}.`)}
    ${p('That wish is sitting in your questionnaire right now. Undelivered.')}
    ${p('Your Succession Story takes that wish and everything else you shared and turns it into something they can hold. Read. Come back to.')}
    ${p('Not a memory of you.<br/>A message from you.<br/>The difference matters.')}
    ${ctaButton('Deliver This Message')}
    ${p('<em style="color:#8a7f78;">Your answers expire in 48 hours if your account stays inactive.</em>')}
  `, unsubUrl, "You're receiving this because you completed the Succession Story questionnaire.")
}

// Email 6 — Day 6. Price increase urgency. Personal note from Romy.
function email6(p_: SequenceAPersonalisation): string {
  const unsubUrl = buildUnsubscribeUrl(p_.email, p_.unsubscribeToken)
  return emailShell(`
    ${p('I want to give you a little advance notice about something, because you deserve more than a last-minute rush.')}
    ${p('On Friday, Succession Story\'s founding member price of $97 increases to the standard price of $197.')}
    ${p('I\'ve kept it at $97 since we launched because I wanted our earliest members, those who believed in this before anyone else did, have access at a price that felt easy to say yes to.')}
    ${p('If you\'ve been thinking about creating your Succession Story, now is the time.')}
    ${p('After Friday it will still be worth every penny at $197. But right now, it\'s worth every penny at $97.')}
    ${ctaButton('Finish My Story Now')}
    ${p('If you have any questions before you continue, simply reply to this email. I read every one.')}
    ${signOff('Romy')}
    ${p('<em style="color:#8a7f78;">$97. Everything you wrote, preserved and delivered as your finished Succession Story.</em>')}
  `, unsubUrl, "You're receiving this because you completed the Succession Story questionnaire.")
}

// Email 7 — Day 7. Final day. Price urgency. Last chance. Signed by Romy Frazier.
function email7(p_: SequenceAPersonalisation): string {
  const advice = p_.advice ?? 'Chase your dreams with courage'
  const signOffName = p_.signOffName ?? 'You'
  const unsubUrl = buildUnsubscribeUrl(p_.email, p_.unsubscribeToken)
  return emailShell(`
    ${p('When we asked what advice you would give the people you love, you wrote:')}
    ${quote(advice)}
    ${p(`${signOffName} wrote that. It is sitting in our system, undelivered.`)}
    ${p('Today is the last day to create your Succession Story at the founding member price of $97.')}
    ${p('At midnight tonight, the price moves to $197 and it will stay there.')}
    ${p('If you have been waiting for the right moment: this is a moment.<br/>Not a perfect one. Just a real one.')}
    ${ctaButton('My Succession Story for $97, Today Only')}
    ${p('Whatever you decide, I\'m grateful you\'ve let me into your inbox. That means something to me.')}
    ${signOff('Romy Frazier, Esq.<br/>Founder, Succession Story')}
    ${p('<em style="color:#8a7f78;font-size:14px;">P.S. If you miss tonight\'s deadline and still want to create your Succession Story, it will be there for you at $197. The price changes. The need doesn\'t.</em>')}
  `, unsubUrl, "You're receiving this because you completed the Succession Story questionnaire.")
}

// ─── Helper ───────────────────────────────────────────────────────────────────

function buildFamilyLine(p_: SequenceAPersonalisation): string {
  const names: string[] = []
  if (p_.spouseName) names.push(p_.spouseName)
  names.push(...p_.childNames)
  if (names.length === 0) return 'your loved ones'
  if (names.length === 1) return names[0]
  if (names.length === 2) return `${names[0]} and ${names[1]}`
  return `${names.slice(0, -1).join(', ')}, and ${names[names.length - 1]}`
}

// ─── Step config ──────────────────────────────────────────────────────────────

export const SEQUENCE_A_STEPS = [
  {
    step: 1,
    delayHours: 24,
    subject: (_p: SequenceAPersonalisation) =>
      `Your answers are saved. We are ready to write your story for you.`,
    getHTML: email1,
  },
  {
    step: 2,
    delayHours: 48,
    subject: (p_: SequenceAPersonalisation) =>
      `${p_.signOffName ?? 'Friend'}, you've done your part. Let us handle the rest.`,
    getHTML: email2,
  },
  {
    step: 3,
    delayHours: 72,
    subject: (_p: SequenceAPersonalisation) =>
      `You said the most important thing you can pass down is this.`,
    getHTML: email3,
  },
  {
    step: 4,
    delayHours: 96,
    subject: (_p: SequenceAPersonalisation) =>
      `Your legacy is ready to be written.`,
    getHTML: email4,
  },
  {
    step: 5,
    delayHours: 120,
    subject: (_p: SequenceAPersonalisation) =>
      `Your family doesn't know this letter exists.`,
    getHTML: email5,
  },
  {
    step: 6,
    delayHours: 144,
    subject: (_p: SequenceAPersonalisation) =>
      `A heads up before Friday.`,
    getHTML: email6,
  },
  {
    step: 7,
    delayHours: 168,
    subject: (_p: SequenceAPersonalisation) =>
      `Today is the last day.`,
    getHTML: email7,
  },
]

// ─── Personalisation extractor ────────────────────────────────────────────────

export function extractPersonalisation(
  answers: { question_id: string; answer_text: string }[],
  email: string,
  unsubscribeToken: string
): SequenceAPersonalisation {
  const get = (id: string) => answers.find(a => a.question_id === id)?.answer_text ?? null

  const childNames: string[] = []
  answers.forEach(a => {
    if (a.question_id.match(/^q3_child_\d+_name$/)) {
      childNames.push(a.answer_text.trim())
    }
  })

  return {
    email,
    unsubscribeToken,
    spouseName: get('q3_spouse_0_name'),
    childNames,
    signOffName: get('q7_5'),
    coreValue: get('q2_5'),
    legacyStatement: get('q4_3'),
    finalWish: get('q7_6'),
    advice: get('q7_4'),
  }
}