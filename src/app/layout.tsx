import type { Metadata, Viewport } from 'next';
import { League_Spartan } from 'next/font/google';
import './globals.css';

const futura = League_Spartan({
  weight: ['300', '400', '500', '600', '700', '800'],
  subsets: ['latin'],
  variable: '--font-futura',
  display: 'swap',
  fallback: ['Futura', 'Futura-Bold', 'Century Gothic', 'sans-serif'],
});

export const viewport: Viewport = {
  themeColor: '#FFFFFF',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://doamandeh.com'),
  title: {
    default: 'Doamandeh Tours & Travel | Editorial Geometric Minimalist Bali',
    template: '%s | Doamandeh Tours & Travel',
  },
  description:
    'Layanan wisata & lifestyle eksklusif di Bali: Sewa Motor & Mobil matic, Professional Tattoo Studio, Villa Private Pool, Paket Tour Travel, dan Surfing Lesson.',
  keywords: [
    'Doamandeh',
    'Sewa Motor Bali',
    'Sewa Mobil Bali',
    'Tattoo Studio Bali',
    'Tattoo Canggu',
    'Sewa Villa Bali',
    'Paket Tour Bali',
    'Surfing Lesson Bali',
    'Wisata Canggu',
  ],
  authors: [{ name: 'Doamandeh Tours and Travel' }],
  creator: 'Doamandeh Tours and Travel',
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'Doamandeh Tours & Travel | Partner Liburan & Lifestyle di Bali',
    description:
      'Layanan wisata lengkap di Bali: Sewa Motor & Mobil, Tato Studio higienis, Villa nyaman, Paket Tour, dan Kelas Surfing.',
    siteName: 'Doamandeh Tours & Travel',
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${futura.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-black font-sans selection:bg-peach selection:text-black">
        {children}
      </body>
    </html>
  );
}
