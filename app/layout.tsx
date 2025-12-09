import { Lora, Poppins } from 'next/font/google';
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
    <html lang="en" className={`${lora.variable} ${poppins.variable}`}>
      <body className="font-body">{children}</body>
    </html>
  );
}