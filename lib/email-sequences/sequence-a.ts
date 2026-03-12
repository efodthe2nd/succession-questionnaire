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
  spouseName: string | null
  childNames: string[]         // first names only
  signOffName: string | null   // q7_5 — how they sign their name
  coreValue: string | null     // q2_5
  legacyStatement: string | null // q4_3
  finalWish: string | null     // q7_6
  advice: string | null        // q7_4
}

// ─── HTML helpers ─────────────────────────────────────────────────────────────

function emailShell(content: string): string {
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
          <!-- Header -->
          <tr>
            <td style="padding:40px 40px 20px;text-align:center;background-color:#1a1a1a;border-radius:12px 12px 0 0;">
              <h1 style="margin:0;font-size:28px;font-weight:normal;color:#ffffff;">
                Succession <span style="color:#B5A692;">Story</span>
              </h1>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;background-color:#1a1a1a;border-radius:0 0 12px 12px;text-align:center;">
              <p style="margin:0 0 8px;font-size:16px;color:#ffffff;font-family:'Georgia',serif;">
                Succession <span style="color:#B5A692;">Story</span>
              </p>
              <p style="margin:0 0 12px;font-size:13px;color:#B5A692;font-style:italic;">Your legacy, written for you.</p>
              <p style="margin:0;font-size:11px;color:#555555;">
                You're receiving this because you completed the Succession Story questionnaire.
                <br/><a href="https://www.successionstory.now/unsubscribe" style="color:#555555;">Unsubscribe</a>
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

function quote(text: string): string {
  return `
    <div style="border-left:4px solid #B5A692;padding:16px 24px;margin:0 0 24px;background-color:#f8f6f2;border-radius:0 8px 8px 0;">
      <p style="margin:0;font-size:18px;line-height:1.5;color:#1a1a1a;font-style:italic;">&ldquo;${text}&rdquo;</p>
    </div>`
}

function highlight(text: string): string {
  return `
    <div style="background-color:#f8f6f2;padding:20px 24px;border-radius:8px;margin:0 0 24px;">
      <p style="margin:0;font-size:16px;line-height:1.6;color:#1a1a1a;">${text}</p>
    </div>`
}

// ─── Email generators ─────────────────────────────────────────────────────────

function email1(p_: SequenceAPersonalisation): string {
  const familyLine = buildFamilyLine(p_)
  return emailShell(`
    ${h2('Your letter is waiting to be written.')}
    ${p(`You answered every question. You shared ${familyLine} — the people who matter most to you.`)}
    ${p('The only thing standing between them and your letter is $97 and a few seconds.')}
    ${p('Everything you wrote is saved. We\'re ready to write your Succession Story the moment you complete your purchase.')}
    ${ctaButton('Complete Your Purchase →')}
    ${p('<em style="color:#8a7f78;">Pay only when you\'re ready. Your answers are safe.</em>')}
  `)
}

function email2(p_: SequenceAPersonalisation): string {
  const signOff = p_.signOffName ?? 'you'
  return emailShell(`
    ${h2(`${signOff} — your letter isn't finished yet.`)}
    ${p('You went all the way through. Every section. Every question.')}
    ${p('Most people never do that. Most people think about writing something like this for years — and never act on it. You acted on it.')}
    ${p('The questionnaire is done. The hard part is over. What\'s left is just unlocking the letter we write from your answers.')}
    ${ctaButton('Get My Letter →')}
    ${p('<em style="color:#8a7f78;">$97. 30-day money-back guarantee. No questions asked.</em>')}
  `)
}

function email3(p_: SequenceAPersonalisation): string {
  const value = p_.coreValue
    ? p_.coreValue.split(':')[0].trim() // e.g. "Integrity" from "Integrity: Always try..."
    : 'what you value most'
  return emailShell(`
    ${h2(`You said the most important thing you can pass down is ${value}.`)}
    ${p('That\'s not in your will. It\'s not in your estate plan. It won\'t transfer automatically.')}
    ${p('It transfers through a letter. Your letter — written in your voice, from the answers you already gave us.')}
    ${highlight(`<strong>Your answer, word for word:</strong><br/><br/><em>"${p_.coreValue ?? value}"</em>`)}
    ${p('That deserves to be read. By the people it was meant for.')}
    ${ctaButton('Send Them This →')}
  `)
}

function email4(p_: SequenceAPersonalisation): string {
  const legacy = p_.legacyStatement ?? 'leave something meaningful behind'
  return emailShell(`
    ${h2('You already wrote what you want your legacy to be.')}
    ${p('When we asked what you hoped to leave behind, here\'s what you said:')}
    ${quote(legacy)}
    ${p('That\'s the letter. That\'s what your family will carry forward. We just need to write it out for them in full — and we can\'t do that until you complete your purchase.')}
    ${p('Everything else is done. This is the last step.')}
    ${ctaButton('Finish What You Started →')}
  `)
}

function email5(p_: SequenceAPersonalisation): string {
  const wish = p_.finalWish ?? 'stay close and look after each other'
  const childLine = p_.childNames.length > 0
    ? p_.childNames.join(', ')
    : 'the people you love'
  return emailShell(`
    ${h2(`You said you want ${childLine} to ${wish}.`)}
    ${p('That wish lives in your questionnaire right now. Undelivered.')}
    ${p('A Succession Story takes that wish — and everything else you shared — and turns it into something they can hold. Read. Come back to.')}
    ${p('Not a memory of you. A message from you. There\'s a difference.')}
    ${ctaButton('Deliver This Message →')}
    ${p('<em style="color:#8a7f78;">Your answers expire in 48 hours if your account remains inactive.</em>')}
  `)
}

function email6(p_: SequenceAPersonalisation): string {
  const childLine = p_.childNames.length > 0
    ? p_.childNames.join(', ')
    : 'your family'
  return emailShell(`
    ${h2('Your answers expire tomorrow.')}
    ${p(`${childLine} — the people you wrote about — don't know this letter exists.`)}
    ${p('They don\'t know you answered every question. They don\'t know you thought about what to say to each of them. They won\'t know any of it unless this letter gets written.')}
    ${p('Tomorrow your submission will be cleared from our system if it remains unpaid. We\'ll have to start fresh if you come back after that.')}
    ${ctaButton('Complete Before Tomorrow →')}
    ${p('<em style="color:#8a7f78;">$97. Everything you\'ve written, preserved and delivered as your finished Succession Story.</em>')}
  `)
}

function email7(p_: SequenceAPersonalisation): string {
  const advice = p_.advice ?? 'Chase your dreams with courage'
  const signOff = p_.signOffName ?? 'You'
  return emailShell(`
    ${h2('Last one from us.')}
    ${p('When we asked what advice you\'d give the people you love, you wrote:')}
    ${quote(advice)}
    ${p(`${signOff} wrote that. It's sitting in our system, undelivered.`)}
    ${p('We won\'t keep emailing you. But your account stays open. When the time feels right — the questionnaire is there, your answers are saved, and we\'ll write your letter the moment you\'re ready.')}
    ${ctaButton('Complete My Succession Story →')}
    ${p('<em style="color:#8a7f78;font-size:14px;">This is the last email we\'ll send. Your letter is still yours to finish.</em>')}
  `)
}

// ─── Helper: build family reference line ──────────────────────────────────────

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
    subject: (p_: SequenceAPersonalisation) =>
      `Your legacy letter is waiting and your answers are saved.`,
    getHTML: email1,
  },
  {
    step: 2,
    delayHours: 48,
    subject: (p_: SequenceAPersonalisation) =>
      `${p_.signOffName ?? 'Your letter'} — the hard part is done.`,
    getHTML: email2,
  },
  {
    step: 3,
    delayHours: 72,
    subject: (p_: SequenceAPersonalisation) =>
      `You said the most important thing you can pass down is this.`,
    getHTML: email3,
  },
  {
    step: 4,
    delayHours: 96,
    subject: (p_: SequenceAPersonalisation) =>
      `You already wrote what you want your legacy to be.`,
    getHTML: email4,
  },
  {
    step: 5,
    delayHours: 120,
    subject: (p_: SequenceAPersonalisation) =>
      `Your answers are still here. Your family doesn't know that yet.`,
    getHTML: email5,
  },
  {
    step: 6,
    delayHours: 144,
    subject: (p_: SequenceAPersonalisation) =>
      `Your answers expire tomorrow.`,
    getHTML: email6,
  },
  {
    step: 7,
    delayHours: 168,
    subject: (p_: SequenceAPersonalisation) =>
      `Last one from us.`,
    getHTML: email7,
  },
]

// ─── Personalisation fetcher ──────────────────────────────────────────────────
// Call this from the cron job to get personalisation data for a submission

export function extractPersonalisation(
  answers: { question_id: string; answer_text: string }[]
): SequenceAPersonalisation {
  const get = (id: string) => answers.find(a => a.question_id === id)?.answer_text ?? null

  // Children names — collect all q3_child_X_name entries
  const childNames: string[] = []
  answers.forEach(a => {
    if (a.question_id.match(/^q3_child_\d+_name$/)) {
      childNames.push(a.answer_text.trim())
    }
  })

  return {
    spouseName: get('q3_spouse_0_name'),
    childNames,
    signOffName: get('q7_5'),
    coreValue: get('q2_5'),
    legacyStatement: get('q4_3'),
    finalWish: get('q7_6'),
    advice: get('q7_4'),
  }
}