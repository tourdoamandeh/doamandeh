import { getSiteSettingsAction } from '@/lib/actions/admin/settings';
import { DEFAULT_SITE_SETTINGS } from '@/lib/validations/admin';
import { SettingsForm } from '@/components/admin/settings-form';

export default async function AdminSettingsPage() {
  const res = await getSiteSettingsAction();
  const initialSettings = res.success && res.data ? res.data : DEFAULT_SITE_SETTINGS;

  return (
    <div className="space-y-6 font-sans">
      {/* Editorial Header */}
      <div className="pb-2 border-b-2 border-brown/20">
        <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-brown/70">
          // KONTEN DINAMIS WEBSITE &amp; CMS
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight uppercase text-brown mt-0.5">
          Pengaturan Konten &amp; Operasional
        </h1>
        <p className="text-xs text-brown/80 mt-1 font-light">
          Ubah seluruh teks judul, kutipan hero per layanan, ulasan testimoni, pertanyaan FAQ, kontak WhatsApp, dan jam operasional tanpa hardcode.
        </p>
      </div>

      {/* Form Component */}
      <SettingsForm initialSettings={initialSettings} />
    </div>
  );
}
