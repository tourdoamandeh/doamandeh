import { getCurrentAdmin } from '@/lib/actions/admin/auth';
import { AppSidebar } from '@/components/admin/app-sidebar';
import { AdminHeader } from '@/components/admin/admin-header';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
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
    <SidebarProvider defaultOpen={true}>
      {/* Toast Notifications */}
      <Toaster richColors position="top-right" />

      {/* Official shadcn Collapsible App Sidebar */}
      <AppSidebar
        userEmail={user.email}
        adminName={profile?.full_name || 'Administrator'}
      />

      {/* Main Content Area in SidebarInset */}
      <SidebarInset>
        {/* Top Operations Header with SidebarTrigger & Breadcrumb */}
        <AdminHeader />

        <div className="flex flex-1 flex-col p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
