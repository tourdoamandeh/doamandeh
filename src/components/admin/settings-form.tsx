'use client';

import { useState, useTransition } from 'react';
import { SiteSettingsInput, DEFAULT_SITE_SETTINGS } from '@/lib/validations/admin';
import { updateSiteSettingsAction } from '@/lib/actions/admin/settings';
import {
  Sparkles,
  Info,
  Phone,
  Mail,
  MapPin,
  Share2,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Globe,
} from 'lucide-react';

interface SettingsFormProps {
  initialSettings: SiteSettingsInput;
}

export function SettingsForm({ initialSettings }: SettingsFormProps) {
  const [formData, setFormData] = useState<SiteSettingsInput>(initialSettings);
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string | null;
  }>({ type: null, message: null });

  function handleChange(
    field: keyof SiteSettingsInput,
    value: string
  ) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (status.type) {
      setStatus({ type: null, message: null });
    }
  }

  function handleReset() {
    if (confirm('Kembalikan seluruh teks pengaturan ke konfigurasi bawaan (default)?')) {
      setFormData(DEFAULT_SITE_SETTINGS);
      setStatus({
        type: 'success',
        message: 'Pengaturan dikembalikan ke nilai default. Jangan lupa klik Simpan Pengaturan.',
      });
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus({ type: null, message: null });

    startTransition(async () => {
      const res = await updateSiteSettingsAction(formData);
      if (res.success) {
        setStatus({
          type: 'success',
          message: 'Pengaturan website berhasil disimpan dan diperbarui!',
        });
      } else {
        setStatus({
          type: 'error',
          message: res.error || 'Gagal menyimpan pengaturan.',
        });
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl">
      {/* Notification Banner */}
      {status.message && (
        <div
          className={`flex items-start gap-3 p-4 rounded-2xl border ${
            status.type === 'success'
              ? 'bg-emerald-950/40 border-emerald-800/80 text-emerald-200'
              : 'bg-red-950/40 border-red-800/80 text-red-200'
          } animate-in fade-in duration-200 shadow-lg`}
        >
          {status.type === 'success' ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
          )}
          <div className="flex-1 text-xs sm:text-sm">
            <span className="font-semibold block">
              {status.type === 'success' ? 'Berhasil!' : 'Terjadi Kendala'}
            </span>
            <span className="opacity-90">{status.message}</span>
          </div>
        </div>
      )}

      {/* Section 1: Hero & Branding */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 shadow-xl space-y-5">
        <div className="flex items-center gap-3 border-b border-zinc-800/80 pb-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-white">
              Hero Banner & Slogan Utama
            </h2>
            <p className="text-xs text-zinc-400">
              Pengaturan judul headline dan deskripsi penawaran di bagian teratas website.
            </p>
          </div>
        </div>

        <div className="space-y-4 text-xs sm:text-sm">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Judul Utama (Hero Title) *
            </label>
            <input
              type="text"
              required
              value={formData.hero_title}
              onChange={(e) => handleChange('hero_title', e.target.value)}
              placeholder="Contoh: Nikmati Liburan Terbaik Bersama Doamandeh"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Subjudul / Deskripsi Hero *
            </label>
            <textarea
              rows={3}
              required
              value={formData.hero_subtitle}
              onChange={(e) => handleChange('hero_subtitle', e.target.value)}
              placeholder="Jelaskan ringkasan nilai tawar layanan Doamandeh..."
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none"
            />
          </div>
        </div>
      </div>

      {/* Section 2: About Us */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 shadow-xl space-y-5">
        <div className="flex items-center gap-3 border-b border-zinc-800/80 pb-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Info className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-white">
              Profil Bisnis & Tentang Doamandeh
            </h2>
            <p className="text-xs text-zinc-400">
              Narasi pengenalan reputasi bisnis, standar layanan, dan komitmen kepada wisatawan.
            </p>
          </div>
        </div>

        <div className="space-y-4 text-xs sm:text-sm">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Teks Profil Bisnis (About Text) *
            </label>
            <textarea
              rows={4}
              required
              value={formData.about_text}
              onChange={(e) => handleChange('about_text', e.target.value)}
              placeholder="Ceritakan latar belakang, standar keamanan, dan layanan unggulan Doamandeh..."
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none"
            />
          </div>
        </div>
      </div>

      {/* Section 3: Contact & Location */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 shadow-xl space-y-5">
        <div className="flex items-center gap-3 border-b border-zinc-800/80 pb-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Phone className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-white">
              Informasi Kontak & Operasional
            </h2>
            <p className="text-xs text-zinc-400">
              Kontak resmi yang akan dihubungi oleh customer saat melakukan pemesanan atau konsultasi.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300 mb-1.5">
              <Phone className="h-3.5 w-3.5 text-zinc-400" />
              <span>Nomor Telepon Kantor</span>
            </label>
            <input
              type="text"
              value={formData.contact_phone}
              onChange={(e) => handleChange('contact_phone', e.target.value)}
              placeholder="+62 812-3456-7890"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300 mb-1.5">
              <Phone className="h-3.5 w-3.5 text-emerald-400" />
              <span>Nomor WhatsApp Customer Care *</span>
            </label>
            <input
              type="text"
              required
              value={formData.contact_whatsapp}
              onChange={(e) => handleChange('contact_whatsapp', e.target.value)}
              placeholder="+62 812-3456-7890"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300 mb-1.5">
              <Mail className="h-3.5 w-3.5 text-zinc-400" />
              <span>Email Resmi</span>
            </label>
            <input
              type="email"
              value={formData.contact_email}
              onChange={(e) => handleChange('contact_email', e.target.value)}
              placeholder="info@doamandeh.com"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300 mb-1.5">
              <MapPin className="h-3.5 w-3.5 text-zinc-400" />
              <span>Alamat Kantor / Studio</span>
            </label>
            <input
              type="text"
              value={formData.contact_address}
              onChange={(e) => handleChange('contact_address', e.target.value)}
              placeholder="Jl. Raya Canggu No. 88, Badung, Bali"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>
        </div>
      </div>

      {/* Section 4: Social Media Links */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 shadow-xl space-y-5">
        <div className="flex items-center gap-3 border-b border-zinc-800/80 pb-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Share2 className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-white">
              Tautan Media Sosial
            </h2>
            <p className="text-xs text-zinc-400">
              Link profil media sosial Doamandeh untuk meningkatkan trust dan jangkauan audiens.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm">
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300 mb-1.5">
              <Globe className="h-3.5 w-3.5 text-pink-400" />
              <span>Instagram Link</span>
            </label>
            <input
              type="text"
              value={formData.sosmed_instagram}
              onChange={(e) => handleChange('sosmed_instagram', e.target.value)}
              placeholder="https://instagram.com/doamandeh"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300 mb-1.5">
              <Globe className="h-3.5 w-3.5 text-blue-400" />
              <span>Facebook Link</span>
            </label>
            <input
              type="text"
              value={formData.sosmed_facebook}
              onChange={(e) => handleChange('sosmed_facebook', e.target.value)}
              placeholder="https://facebook.com/doamandeh"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300 mb-1.5">
              <Globe className="h-3.5 w-3.5 text-zinc-300" />
              <span>TikTok Link</span>
            </label>
            <input
              type="text"
              value={formData.sosmed_tiktok}
              onChange={(e) => handleChange('sosmed_tiktok', e.target.value)}
              placeholder="https://tiktok.com/@doamandeh"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>
        </div>
      </div>

      {/* Form Action Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-zinc-800">
        <button
          type="button"
          onClick={handleReset}
          disabled={isPending}
          className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-xs font-medium text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors disabled:opacity-50"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Reset ke Default</span>
        </button>

        <button
          type="submit"
          disabled={isPending}
          className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-6 py-3 text-xs font-bold text-black hover:bg-amber-400 transition-all shadow-xl shadow-amber-500/20 disabled:opacity-50"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Menyimpan Pengaturan...</span>
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              <span>Simpan Perubahan Pengaturan</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
