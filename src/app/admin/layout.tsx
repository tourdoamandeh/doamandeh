import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin CMS | Doamandeh Tours & Travel',
  description: 'Panel Pengelolaan Doamandeh Tours and Travel',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-amber-500 selection:text-black">
      {children}
    </div>
  );
}
