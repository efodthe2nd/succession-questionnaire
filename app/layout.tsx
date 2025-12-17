import { Lora, Poppins, Caveat, Dancing_Script, Indie_Flower, Satisfy } from 'next/font/google';
import type { Metadata } from 'next';
import './globals.css';

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
  weight: ['400', '700'],
});

const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-poppins',
  weight: ['400', '500', '600'],
});

// Handwriting style fonts
const caveat = Caveat({
  subsets: ['latin'],
  variable: '--font-caveat',
  weight: ['400', '700'],
});

const dancingScript = Dancing_Script({
  subsets: ['latin'],
  variable: '--font-dancing-script',
  weight: ['400', '700'],
});

const indieFlower = Indie_Flower({
  subsets: ['latin'],
  variable: '--font-indie-flower',
  weight: ['400'],
});

const satisfy = Satisfy({
  subsets: ['latin'],
  variable: '--font-satisfy',
  weight: ['400'],
});

export const metadata: Metadata = {
  title: 'Succession Questionnaire',
  description: 'Create your legacy letter',
  icons: {
    icon: '/favicon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${lora.variable} ${poppins.variable} ${caveat.variable} ${dancingScript.variable} ${indieFlower.variable} ${satisfy.variable}`}>
      <body className="font-body">{children}</body>
    </html>
  );
}