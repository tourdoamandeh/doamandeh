import { getSiteSettingsAction } from '@/lib/actions/admin/settings';
import { DEFAULT_SITE_SETTINGS } from '@/lib/validations/admin';
import { SettingsForm } from '@/components/admin/settings-form';
import { Settings as SettingsIcon } from 'lucide-react';

export default async function AdminSettingsPage() {
  const res = await getSiteSettingsAction();
  const initialSettings = res.success && res.data ? res.data : DEFAULT_SITE_SETTINGS;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-zinc-800 pb-5">
        <div className="flex items-center gap-2 mb-1">
          <SettingsIcon className="h-4 w-4 text-amber-400" />
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
            Konfigurasi & Konten
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Pengaturan Website
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 mt-1">
          Kelola teks headline hero, profil tentang Doamandeh, nomor kontak WhatsApp, dan tautan sosial media.
        </p>
      </div>

      {/* Form Component */}
      <SettingsForm initialSettings={initialSettings} />
    </div>
  );
}
