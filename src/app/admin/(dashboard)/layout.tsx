import { getCurrentAdmin } from '@/lib/actions/admin/auth';
import { AdminNav } from '@/components/admin/admin-nav';
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
    <div className="min-h-screen flex flex-col lg:flex-row bg-zinc-950 text-zinc-100">
      <AdminNav
        userEmail={user.email}
        adminName={profile?.full_name || 'Admin'}
      />
      <main className="flex-1 min-w-0 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
