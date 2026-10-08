import type { Metadata } from 'next';
import { Cormorant_Garamond, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'E-Wardrobe | Your Wardrobe. Your Style. AI-Powered.',
  description:
    'An intelligent personal styling platform. Organize your wardrobe, discover daily and occasion looks, preview outfits virtually, and complete your capsule wardrobe with curated recommendations.',
  keywords: [
    'AI wardrobe',
    'personal stylist',
    'capsule wardrobe',
    'outfit generator',
    'virtual try on',
    'fashion tech',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${plusJakarta.variable}`}>
      <body className="min-h-screen bg-[#FAF8F5] text-[#1C1917] antialiased selection:bg-[#B4533C]/15 selection:text-[#B4533C]">
        {children}
      </body>
    </html>
  );
}
