'use client';

import { useState, useTransition } from 'react';
import { SiteSettingsInput, DEFAULT_SITE_SETTINGS } from '@/lib/validations/admin';
import { updateSiteSettingsAction } from '@/lib/actions/admin/settings';
import {
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
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
        message: 'Pengaturan dikembalikan ke nilai default. Klik Simpan untuk menerapkan.',
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
          message: 'Pengaturan website berhasil disimpan.',
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
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl text-xs">
      {/* Notification Banner */}
      {status.message && (
        <div
          className={`flex items-start gap-2.5 p-3 rounded-lg border ${
            status.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          {status.type === 'success' ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
          )}
          <div className="flex-1">
            <p className="font-semibold">{status.type === 'success' ? 'Berhasil' : 'Kendala'}</p>
            <p className="mt-0.5">{status.message}</p>
          </div>
        </div>
      )}

      {/* Section 1: Hero & Branding */}
      <div className="rounded-lg border border-stone-200 bg-white p-5 space-y-4">
        <div className="border-b border-stone-200 pb-2.5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-stone-900">
            Hero Banner & Slogan Utama
          </h2>
          <p className="text-[11px] text-stone-500 mt-0.5">
            Judul headline dan narasi penawaran utama di halaman depan.
          </p>
        </div>

        <div className="space-y-3.5">
          <div>
            <label className="block text-[11px] font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Judul Utama (Hero Title) *
            </label>
            <input
              type="text"
              required
              value={formData.hero_title}
              onChange={(e) => handleChange('hero_title', e.target.value)}
              placeholder="Contoh: Liburan Terbaik Bersama Doamandeh"
              className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs text-stone-900 placeholder:text-stone-400 focus:border-teal-700 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Subjudul / Deskripsi Hero *
            </label>
            <textarea
              rows={2}
              required
              value={formData.hero_subtitle}
              onChange={(e) => handleChange('hero_subtitle', e.target.value)}
              placeholder="Jelaskan ringkasan nilai tawar layanan Doamandeh..."
              className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs text-stone-900 placeholder:text-stone-400 focus:border-teal-700 focus:outline-none resize-none"
            />
          </div>
        </div>
      </div>

      {/* Section 2: Profil Bisnis */}
      <div className="rounded-lg border border-stone-200 bg-white p-5 space-y-4">
        <div className="border-b border-stone-200 pb-2.5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-stone-900">
            Tentang Doamandeh
          </h2>
          <p className="text-[11px] text-stone-500 mt-0.5">
            Narasi pengenalan reputasi bisnis dan standar layanan.
          </p>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-stone-700 uppercase tracking-wider mb-1">
            Teks Profil Bisnis (About Text) *
          </label>
          <textarea
            rows={3}
            required
            value={formData.about_text}
            onChange={(e) => handleChange('about_text', e.target.value)}
            placeholder="Ceritakan latar belakang, standar keamanan, dan layanan unggulan..."
            className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs text-stone-900 placeholder:text-stone-400 focus:border-teal-700 focus:outline-none resize-none"
          />
        </div>
      </div>

      {/* Section 3: Kontak Operasional */}
      <div className="rounded-lg border border-stone-200 bg-white p-5 space-y-4">
        <div className="border-b border-stone-200 pb-2.5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-stone-900">
            Kontak & Operasional
          </h2>
          <p className="text-[11px] text-stone-500 mt-0.5">
            Kontak resmi untuk pemesanan WhatsApp dan konsultasi pelanggan.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-[11px] font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Nomor WhatsApp Customer Service *
            </label>
            <input
              type="text"
              required
              value={formData.contact_whatsapp}
              onChange={(e) => handleChange('contact_whatsapp', e.target.value)}
              placeholder="+62 812-3456-7890"
              className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs text-stone-900 font-mono focus:border-teal-700 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Nomor Telepon Kantor
            </label>
            <input
              type="text"
              value={formData.contact_phone}
              onChange={(e) => handleChange('contact_phone', e.target.value)}
              placeholder="+62 812-3456-7890"
              className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs text-stone-900 font-mono focus:border-teal-700 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Email Resmi
            </label>
            <input
              type="email"
              value={formData.contact_email}
              onChange={(e) => handleChange('contact_email', e.target.value)}
              placeholder="info@doamandeh.com"
              className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs text-stone-900 focus:border-teal-700 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Alamat Kantor / Studio
            </label>
            <input
              type="text"
              value={formData.contact_address}
              onChange={(e) => handleChange('contact_address', e.target.value)}
              placeholder="Jl. Raya Canggu No. 88, Badung, Bali"
              className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs text-stone-900 focus:border-teal-700 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Section 4: Media Sosial */}
      <div className="rounded-lg border border-stone-200 bg-white p-5 space-y-4">
        <div className="border-b border-stone-200 pb-2.5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-stone-900">
            Tautan Media Sosial
          </h2>
          <p className="text-[11px] text-stone-500 mt-0.5">
            Tautan profil publik untuk ditampilkan di footer website.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div>
            <label className="block text-[11px] font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Instagram Link
            </label>
            <input
              type="text"
              value={formData.sosmed_instagram}
              onChange={(e) => handleChange('sosmed_instagram', e.target.value)}
              placeholder="https://instagram.com/doamandeh"
              className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs text-stone-900 focus:border-teal-700 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Facebook Link
            </label>
            <input
              type="text"
              value={formData.sosmed_facebook}
              onChange={(e) => handleChange('sosmed_facebook', e.target.value)}
              placeholder="https://facebook.com/doamandeh"
              className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs text-stone-900 focus:border-teal-700 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-stone-700 uppercase tracking-wider mb-1">
              TikTok Link
            </label>
            <input
              type="text"
              value={formData.sosmed_tiktok}
              onChange={(e) => handleChange('sosmed_tiktok', e.target.value)}
              placeholder="https://tiktok.com/@doamandeh"
              className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs text-stone-900 focus:border-teal-700 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center justify-between pt-2 border-t border-stone-200">
        <button
          type="button"
          onClick={handleReset}
          disabled={isPending}
          className="inline-flex items-center gap-1.5 rounded-lg border border-stone-200 bg-white px-3.5 py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-50 disabled:opacity-50"
        >
          <RotateCcw className="h-3.5 w-3.5 text-stone-400" />
          <span>Reset Default</span>
        </button>

        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#0F766E] px-4 py-2 text-xs font-medium text-white hover:bg-[#115E59] transition-colors disabled:opacity-50"
        >
          {isPending ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span>Menyimpan...</span>
            </>
          ) : (
            <>
              <Save className="h-3.5 w-3.5" />
              <span>Simpan Pengaturan</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
