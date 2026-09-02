import { getSiteSettingsAction } from '@/lib/actions/admin/settings';
import { DEFAULT_SITE_SETTINGS } from '@/lib/validations/admin';
import { SettingsForm } from '@/components/admin/settings-form';

export default async function AdminSettingsPage() {
  const res = await getSiteSettingsAction();
  const initialSettings = res.success && res.data ? res.data : DEFAULT_SITE_SETTINGS;

  return (
    <div className="space-y-6">
      {/* Operations Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-stone-900">
          Pengaturan Website
        </h1>
        <p className="text-xs text-stone-500 mt-0.5">
          Konfigurasi konten dinamis, nomor kontak WhatsApp, dan informasi operasional.
        </p>
      </div>

      {/* Form Component */}
      <SettingsForm initialSettings={initialSettings} />
    </div>
  );
}
