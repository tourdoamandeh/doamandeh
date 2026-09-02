import { getSiteSettingsAction } from '@/lib/actions/admin/settings';
import { DEFAULT_SITE_SETTINGS } from '@/lib/validations/admin';
import { SettingsForm } from '@/components/admin/settings-form';

export default async function AdminSettingsPage() {
  const res = await getSiteSettingsAction();
  const initialSettings = res.success && res.data ? res.data : DEFAULT_SITE_SETTINGS;

  return (
    <div className="space-y-6">
      {/* Operations Header with Breadcrumb */}
      <div className="border-b border-stone-200 pb-4">
        <div className="flex items-center gap-2 text-xs font-medium text-stone-500 mb-1">
          <span>Admin</span>
          <span>/</span>
          <span className="text-stone-900 font-semibold">Pengaturan</span>
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-stone-900">
            Pengaturan Website
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Konfigurasi konten dinamis, nomor kontak WhatsApp, dan informasi operasional.
          </p>
        </div>
      </div>

      {/* Form Component */}
      <SettingsForm initialSettings={initialSettings} />
    </div>
  );
}
