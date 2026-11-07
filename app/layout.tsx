import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Card Assist | Premium Wedding Invitation Designer & Luxury Print Atelier',
  description:
    'Design, customise, preview, and order luxury Indian wedding invitations online. Featuring 24K real gold foil, hand-deckled artisanal cotton paper, authentic religious shlokas, and print-ready high-resolution vector PDF delivery.',
  keywords: [
    'Indian wedding invitations',
    'bespoke wedding cards',
    'gold foil wedding cards',
    'nikah invitation designer',
    'anand karaj wedding cards',
    'custom wedding card designer',
    'luxury wedding stationery India',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen flex flex-col bg-[#FFFEFA] text-stone-900 antialiased selection:bg-gold-200 selection:text-gold-900">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

