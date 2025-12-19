import { Lora, Poppins, Antic, Over_the_Rainbow, Handlee, Caveat, Kalam } from 'next/font/google';
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
const antic = Antic({
  subsets: ['latin'],
  variable: '--font-antic',
  weight: ['400'],
});

const overTheRainbow = Over_the_Rainbow({
  subsets: ['latin'],
  variable: '--font-over-the-rainbow',
  weight: ['400'],
});

const handlee = Handlee({
  subsets: ['latin'],
  variable: '--font-handlee',
  weight: ['400'],
});

const caveat = Caveat({
  subsets: ['latin'],
  variable: '--font-caveat',
  weight: ['400', '700'],
});

const kalam = Kalam({
  subsets: ['latin'],
  variable: '--font-kalam',
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
    <html lang="en" suppressHydrationWarning className={`${lora.variable} ${poppins.variable} ${antic.variable} ${overTheRainbow.variable} ${handlee.variable} ${caveat.variable} ${kalam.variable}`}>
      <body className="font-body">{children}</body>
    </html>
  );
}