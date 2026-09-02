import { getCurrentAdmin } from '@/lib/actions/admin/auth';
import { AdminNav } from '@/components/admin/admin-nav';
import { Toaster } from '@/components/ui/sonner';
import { redirect } from 'next/navigation';

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, profile } = await getCurrentAdmin();

  if (!user || profile?.role !== 'admin') {
    redirect('/admin/login');
  }

  return (
    <div className="min-h-screen flex bg-[#FAFAF9] text-[#171717] font-sans antialiased selection:bg-teal-700 selection:text-white">
      {/* Toast Notifications Provider */}
      <Toaster richColors position="top-right" />

      {/* Fixed Left Sidebar */}
      <AdminNav
        userEmail={user.email}
        adminName={profile?.full_name || 'Administrator'}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-60">
        <main className="flex-1 p-5 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
