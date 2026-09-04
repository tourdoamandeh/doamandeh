import type { Metadata } from 'next';
import { AdminTheme } from '@/components/admin/admin-theme';

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
    <div className="min-h-screen bg-background text-foreground font-sans">
      <AdminTheme />
      {children}
    </div>
  );
}
