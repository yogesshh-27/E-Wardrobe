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
  title: 'WARDROBE AI | Your Wardrobe. Your Style. Your AI Stylist.',
  description:
    'A luxury fashion-tech platform and AI personal stylist. Digitally organize your clothing, plan travel capsules, curate event looks, preview outfits virtually, and evolve your personal Style DNA.',
  keywords: [
    'WARDROBE AI',
    'AI wardrobe',
    'personal stylist',
    'travel packing',
    'smart capsule',
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
      <body className="min-h-screen bg-[#FAF8F5] text-[#1C1917] antialiased selection:bg-[#38BDF8]/20 selection:text-[#0284C7]">
        {children}
      </body>
    </html>
  );
}
