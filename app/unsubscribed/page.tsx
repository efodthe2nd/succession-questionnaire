// app/unsubscribed/page.tsx
// Shown after a successful unsubscribe via /api/unsubscribe

export default function UnsubscribedPage() {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Unsubscribed | Succession Story</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:wght@300;400&display=swap"
          rel="stylesheet"
        />
        <style>{`
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

          body {
            background-color: #0f0e0d;
            color: #f9f6f1;
            font-family: 'DM Sans', sans-serif;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 40px 20px;
          }

          .grain {
            position: fixed;
            inset: 0;
            pointer-events: none;
            z-index: 0;
            opacity: 0.025;
            background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
            background-size: 200px 200px;
          }

          .container {
            position: relative;
            z-index: 1;
            max-width: 520px;
            width: 100%;
            text-align: center;
            animation: fadeUp 0.8s ease both;
          }

          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(24px); }
            to   { opacity: 1; transform: translateY(0); }
          }

          .wordmark {
            font-family: 'Cormorant Garamond', Georgia, serif;
            font-size: 22px;
            font-weight: 300;
            letter-spacing: 0.08em;
            color: #f9f6f1;
            margin-bottom: 56px;
            opacity: 0.6;
          }

          .wordmark span {
            color: #B5A692;
          }

          .icon {
            width: 56px;
            height: 56px;
            border: 1px solid #B5A692;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 32px;
            animation: fadeUp 0.8s 0.15s ease both;
            opacity: 0;
          }

          .icon svg {
            width: 22px;
            height: 22px;
            stroke: #B5A692;
            fill: none;
            stroke-width: 1.5;
            stroke-linecap: round;
            stroke-linejoin: round;
          }

          .heading {
            font-family: 'Cormorant Garamond', Georgia, serif;
            font-size: clamp(28px, 5vw, 38px);
            font-weight: 300;
            line-height: 1.2;
            color: #f9f6f1;
            margin-bottom: 20px;
            animation: fadeUp 0.8s 0.25s ease both;
            opacity: 0;
          }

          .body {
            font-size: 15px;
            line-height: 1.7;
            color: #8a7f78;
            font-weight: 300;
            max-width: 380px;
            margin: 0 auto 48px;
            animation: fadeUp 0.8s 0.35s ease both;
            opacity: 0;
          }

          .divider {
            width: 40px;
            height: 1px;
            background: #B5A692;
            margin: 0 auto 48px;
            opacity: 0.4;
            animation: fadeUp 0.8s 0.4s ease both;
          }

          .note {
            font-size: 13px;
            color: #4a4542;
            line-height: 1.6;
            animation: fadeUp 0.8s 0.45s ease both;
            opacity: 0;
          }

          .note a {
            color: #B5A692;
            text-decoration: none;
            border-bottom: 1px solid transparent;
            transition: border-color 0.2s;
          }

          .note a:hover {
            border-bottom-color: #B5A692;
          }
        `}</style>
      </head>
      <body>
        <div className="grain" />
        <div className="container">
          <div className="wordmark">
            Succession <span>Story</span>
          </div>

          <div className="icon">
            <svg viewBox="0 0 24 24">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>

          <h1 className="heading">
            You have been unsubscribed.
          </h1>

          <p className="body">
            You will not receive any more emails from us. Your account remains open if you ever want to come back and finish your letter.
          </p>

          <div className="divider" />

          <p className="note">
            Changed your mind?{' '}
            <a href="https://www.successionstory.now/login">
              Log back in
            </a>{' '}
            to continue your Succession Story.
          </p>
        </div>
      </body>
    </html>
  )
}