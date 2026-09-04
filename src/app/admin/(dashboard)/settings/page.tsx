import { getSiteSettingsAction } from '@/lib/actions/admin/settings';
import { DEFAULT_SITE_SETTINGS } from '@/lib/validations/admin';
import { SettingsForm } from '@/components/admin/settings-form';

export default async function AdminSettingsPage() {
  const res = await getSiteSettingsAction();
  const initialSettings = res.success && res.data ? res.data : DEFAULT_SITE_SETTINGS;

  return (
    <div className="space-y-6 font-sans">
      {/* Page Header */}
      <div className="pb-6 border-b border-border">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Settings
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Pengaturan konten website publik, jam operasional, ulasan testimoni, dan FAQ dinamis.
        </p>
      </div>

      {/* Form Component */}
      <SettingsForm initialSettings={initialSettings} />
    </div>
  );
}
