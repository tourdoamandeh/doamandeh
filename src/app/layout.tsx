import type { Metadata, Viewport } from 'next';
import { Jost, League_Spartan } from 'next/font/google';
import './globals.css';

const jost = Jost({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-jost',
  display: 'swap',
  fallback: ['Futura', 'Futura-Bold', 'Century Gothic', 'sans-serif'],
});

const futura = League_Spartan({
  weight: ['300', '400', '500', '600', '700', '800'],
  subsets: ['latin'],
  variable: '--font-futura',
  display: 'swap',
  fallback: ['Futura', 'Futura-Bold', 'Century Gothic', 'sans-serif'],
});

export const viewport: Viewport = {
  themeColor: '#FAF9F4',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://doamandeh.com'),
  title: {
    default: "Do'amandeh Tours & Travel | Editorial Geometric Minimalist Bali",
    template: "%s | Do'amandeh Tours & Travel",
  },
  description:
    'Layanan wisata & lifestyle eksklusif di Bali: Sewa Motor & Mobil matic, Professional Tattoo Studio, Villa Private Pool, Paket Tour Travel, dan Surfing Lesson.',
  keywords: [
    "Do'amandeh",
    'Sewa Motor Bali',
    'Sewa Mobil Bali',
    'Tattoo Studio Bali',
    'Tattoo Canggu',
    'Sewa Villa Bali',
    'Paket Tour Bali',
    'Surfing Lesson Bali',
    'Wisata Canggu',
  ],
  authors: [{ name: "Do'amandeh Tours and Travel" }],
  creator: "Do'amandeh Tours and Travel",
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: "Do'amandeh Tours & Travel | Partner Liburan & Lifestyle di Bali",
    description:
      'Layanan wisata lengkap di Bali: Sewa Motor & Mobil, Tato Studio higienis, Villa nyaman, Paket Tour, dan Kelas Surfing.',
    siteName: "Do'amandeh Tours & Travel",
    locale: 'id_ID',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

import { HashScrollHandler } from '@/components/public/hash-scroll-handler';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      data-scroll-behavior="smooth"
      className={`${jost.variable} ${futura.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-paper text-ink font-sans selection:bg-sun selection:text-ink">
        <HashScrollHandler />
        {children}
      </body>
    </html>
  );
}
