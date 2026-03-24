import {
  Lora,
  Poppins,
  Antic,
  Over_the_Rainbow,
  Handlee,
  Caveat,
  Kalam,
  Cormorant_Garamond,
  DM_Sans,
} from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";
import AuthCallbackHandler from "@/components/AuthCallbackHandler";
import FacebookPixel from "@/components/FacebookPixel";
import Script from 'next/script';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-dm-sans',
  display: 'swap',
})

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  weight: ["400", "700"],
});

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["400", "500", "600"],
});

// Handwriting style fonts
const antic = Antic({
  subsets: ["latin"],
  variable: "--font-antic",
  weight: ["400"],
});

const overTheRainbow = Over_the_Rainbow({
  subsets: ["latin"],
  variable: "--font-over-the-rainbow",
  weight: ["400"],
});

const handlee = Handlee({
  subsets: ["latin"],
  variable: "--font-handlee",
  weight: ["400"],
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  weight: ["400", "700"],
});

const kalam = Kalam({
  subsets: ["latin"],
  variable: "--font-kalam",
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Your wealth has a story.",
  description: "Create your legacy letter",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${lora.variable} ${poppins.variable} ${antic.variable} ${overTheRainbow.variable} ${handlee.variable} ${caveat.variable} ${kalam.variable} ${cormorant.variable} ${dmSans.variable}`}
    >
      <head>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-LPNMBTNFFG"
          strategy="afterInteractive"
        />
        <Script id="ga-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-LPNMBTNFFG');
          `}
        </Script>
      </head>
      <body className="font-body">
        <FacebookPixel />
        <AuthCallbackHandler />
        {children}

      </body>
    </html>
  );
}
