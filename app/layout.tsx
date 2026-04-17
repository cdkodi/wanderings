import type { Metadata } from 'next';
import { Playfair_Display, Lato } from 'next/font/google';
import Nav from '@/components/Nav';
import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const lato = Lato({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  variable: '--font-lato',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Our Wanderings',
  description: 'A personal travel journal — every journey, remembered.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${lato.variable}`}>
        <header className="sticky top-0 z-50 bg-sand/90 backdrop-blur-sm border-b border-muted/20">
          <Nav />
        </header>
        {children}
        <footer className="bg-ink text-sand/60 py-10 px-6">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="font-playfair text-sand/80 text-lg">Our Wanderings</p>
            <p className="font-lato text-xs tracking-wide">Every journey, remembered.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
