import type { Metadata } from 'next';
import { AdminThemeProvider } from '@/components/admin/admin-theme';

export const metadata: Metadata = {
  title: "Admin CMS | Do'amandeh Tours & Travel",
  description: "Panel Pengelolaan Do'amandeh Tours and Travel",
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
    <AdminThemeProvider>
      <div className="min-h-screen bg-background text-foreground font-sans">
        {children}
      </div>
    </AdminThemeProvider>
  );
}
