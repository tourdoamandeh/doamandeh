'use client';

import { useState, useTransition } from 'react';
import { SiteSettingsInput, DEFAULT_SITE_SETTINGS } from '@/lib/validations/admin';
import { updateSiteSettingsAction } from '@/lib/actions/admin/settings';
import { toast } from 'sonner';
import {
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Plus,
  Trash2,
} from 'lucide-react';

interface SettingsFormProps {
  initialSettings: SiteSettingsInput;
}

interface TestimonialItem {
  id: string;
  name: string;
  location: string;
  serviceCategory: string;
  rating: number;
  comment: string;
  date: string;
  image: string;
}

interface FaqItem {
  num: string;
  question: string;
  answer: string;
}

type TabType =
  | 'hero'
  | 'about'
  | 'services_cta'
  | 'testimonials'
  | 'faq'
  | 'contact_hours'
  | 'social';

export function SettingsForm({ initialSettings }: SettingsFormProps) {
  const [formData, setFormData] = useState<SiteSettingsInput>(initialSettings);
  const [activeTab, setActiveTab] = useState<TabType>('hero');
  const [showSecondCS, setShowSecondCS] = useState<boolean>(
    Boolean(initialSettings.contact_whatsapp_2 && initialSettings.contact_whatsapp_2.trim().length > 0)
  );
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string | null;
  }>({ type: null, message: null });

  // Parse Testimonials
  let parsedTestimonials: TestimonialItem[] = [];
  try {
    parsedTestimonials = JSON.parse(formData.testimonials_data || '[]');
  } catch {
    parsedTestimonials = [];
  }

  // Parse FAQs
  let parsedFaqs: FaqItem[] = [];
  try {
    parsedFaqs = JSON.parse(formData.faq_data || '[]');
  } catch {
    parsedFaqs = [];
  }

  function handleChange(field: keyof SiteSettingsInput, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (status.type) {
      setStatus({ type: null, message: null });
    }
  }

  function handleTestimonialsChange(newList: TestimonialItem[]) {
    handleChange('testimonials_data', JSON.stringify(newList));
  }

  function handleUpdateTestimonial(index: number, field: keyof TestimonialItem, val: string | number) {
    const updated = [...parsedTestimonials];
    updated[index] = { ...updated[index], [field]: val };
    handleTestimonialsChange(updated);
  }

  function handleAddTestimonial() {
    const newItem: TestimonialItem = {
      id: Date.now().toString(),
      name: 'Pelanggan Baru',
      location: 'Indonesia',
      serviceCategory: 'Paket Tour',
      rating: 5,
      comment: 'Pengalaman liburan yang sangat berkesan bersama tim Doamandeh.',
      date: 'September 2026',
      image: '/assets/testimonial-tour.svg',
    };
    handleTestimonialsChange([...parsedTestimonials, newItem]);
  }

  function handleDeleteTestimonial(index: number) {
    const updated = parsedTestimonials.filter((_, i) => i !== index);
    handleTestimonialsChange(updated);
  }

  function handleFaqsChange(newList: FaqItem[]) {
    handleChange('faq_data', JSON.stringify(newList));
  }

  function handleUpdateFaq(index: number, field: keyof FaqItem, val: string) {
    const updated = [...parsedFaqs];
    updated[index] = { ...updated[index], [field]: val };
    handleFaqsChange(updated);
  }

  function handleAddFaq() {
    const nextNum = (parsedFaqs.length + 1).toString().padStart(2, '0');
    const newItem: FaqItem = {
      num: nextNum,
      question: 'Pertanyaan Baru',
      answer: 'Tuliskan jawaban lengkap di sini.',
    };
    handleFaqsChange([...parsedFaqs, newItem]);
  }

  function handleDeleteFaq(index: number) {
    const updated = parsedFaqs.filter((_, i) => i !== index);
    handleFaqsChange(updated);
  }

  function handleReset() {
    if (confirm('Kembalikan seluruh teks pengaturan ke konfigurasi bawaan (default)?')) {
      setFormData(DEFAULT_SITE_SETTINGS);
      setShowSecondCS(false);
      setStatus({
        type: 'success',
        message: 'Pengaturan dikembalikan ke nilai default. Klik Simpan untuk menerapkan.',
      });
      toast.info('Pengaturan dikembalikan ke nilai default. Klik Simpan untuk menerapkan.');
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
          message: 'Pengaturan website berhasil disimpan ke database.',
        });
        toast.success('Pengaturan website berhasil disimpan dan diperbarui!');
      } else {
        setStatus({
          type: 'error',
          message: res.error || 'Gagal menyimpan pengaturan.',
        });
        toast.error(res.error || 'Gagal menyimpan pengaturan.');
      }
    });
  }

  const tabs: { id: TabType; label: string }[] = [
    { id: 'hero', label: 'Hero & Slogan' },
    { id: 'about', label: 'Tentang Kami' },
    { id: 'services_cta', label: 'Katalog & CTA' },
    { id: 'testimonials', label: 'Testimoni' },
    { id: 'faq', label: 'FAQ' },
    { id: 'contact_hours', label: 'Kontak & Operasional' },
    { id: 'social', label: 'Media Sosial' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl text-xs font-sans">
      {/* Notification Banner */}
      {status.message && (
        <div
          className={`flex items-start gap-3 p-4 rounded-none border-2 ${
            status.type === 'success'
              ? 'bg-softyellow border-brown text-brown'
              : 'bg-softwhite border-black text-black'
          }`}
        >
          {status.type === 'success' ? (
            <CheckCircle2 className="h-5 w-5 text-brown shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="h-5 w-5 text-black shrink-0 mt-0.5" />
          )}
          <div className="flex-1">
            <p className="font-bold uppercase tracking-wider text-xs">
              {status.type === 'success' ? 'Berhasil Disimpan' : 'Kendala Sistem'}
            </p>
            <p className="mt-0.5 font-light">{status.message}</p>
          </div>
        </div>
      )}

      {/* Editorial Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b-2 border-brown/30">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-none border-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-brown text-softyellow border-brown'
                : 'bg-softwhite text-brown border-brown/40 hover:bg-softyellow'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: HERO & SLOGAN */}
      {activeTab === 'hero' && (
        <div className="rounded-none border-2 border-brown bg-softwhite p-6 space-y-5 shadow-none">
          <div className="border-b-2 border-brown/20 pb-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-brown">
              Hero Section &amp; Kutipan Layanan
            </h2>
            <p className="text-[11px] text-brown/70 mt-0.5">
              Judul utama hero dan narasi kutipan per kategori yang berganti otomatis di banner landing page.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-brown mb-1.5">
                Judul Hero Utama (Gunakan Enter untuk baris baru) *
              </label>
              <textarea
                rows={3}
                required
                value={formData.hero_title}
                onChange={(e) => handleChange('hero_title', e.target.value)}
                placeholder="Doamandeh, \n— Rencanakan \nPerjalanan"
                className="w-full rounded-none border-2 border-brown bg-softyellow/40 px-3 py-2 text-xs text-black focus:border-black focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-brown mb-1.5">
                Subjudul / Tagline Hero *
              </label>
              <input
                type="text"
                required
                value={formData.hero_subtitle}
                onChange={(e) => handleChange('hero_subtitle', e.target.value)}
                className="w-full rounded-none border-2 border-brown bg-softyellow/40 px-3 py-2 text-xs text-black focus:border-black focus:bg-white focus:outline-none"
              />
            </div>

            {/* Service Slide Quotes */}
            <div className="pt-3 border-t-2 border-brown/20 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-brown">
                Kutipan &amp; Narasi Banner per Kategori Layanan
              </h3>

              {/* Travel */}
              <div className="p-4 rounded-none bg-softyellow/30 border border-brown/30 space-y-2.5">
                <p className="font-bold text-brown uppercase text-[11px]">01. Paket Travel</p>
                <div>
                  <label className="block text-[9px] font-bold uppercase text-brown/70 mb-1">Kutipan Foto</label>
                  <textarea
                    rows={2}
                    value={formData.hero_slide_travel_quote}
                    onChange={(e) => handleChange('hero_slide_travel_quote', e.target.value)}
                    className="w-full rounded-none border border-brown bg-white px-2.5 py-1.5 text-xs text-black focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase text-brown/70 mb-1">Deskripsi Singkat</label>
                  <textarea
                    rows={2}
                    value={formData.hero_slide_travel_desc}
                    onChange={(e) => handleChange('hero_slide_travel_desc', e.target.value)}
                    className="w-full rounded-none border border-brown bg-white px-2.5 py-1.5 text-xs text-black focus:outline-none"
                  />
                </div>
              </div>

              {/* Villa */}
              <div className="p-4 rounded-none bg-softyellow/30 border border-brown/30 space-y-2.5">
                <p className="font-bold text-brown uppercase text-[11px]">02. Villa Stay</p>
                <div>
                  <label className="block text-[9px] font-bold uppercase text-brown/70 mb-1">Kutipan Foto</label>
                  <textarea
                    rows={2}
                    value={formData.hero_slide_villa_quote}
                    onChange={(e) => handleChange('hero_slide_villa_quote', e.target.value)}
                    className="w-full rounded-none border border-brown bg-white px-2.5 py-1.5 text-xs text-black focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase text-brown/70 mb-1">Deskripsi Singkat</label>
                  <textarea
                    rows={2}
                    value={formData.hero_slide_villa_desc}
                    onChange={(e) => handleChange('hero_slide_villa_desc', e.target.value)}
                    className="w-full rounded-none border border-brown bg-white px-2.5 py-1.5 text-xs text-black focus:outline-none"
                  />
                </div>
              </div>

              {/* Surfing */}
              <div className="p-4 rounded-none bg-softyellow/30 border border-brown/30 space-y-2.5">
                <p className="font-bold text-brown uppercase text-[11px]">03. Surfing Lesson</p>
                <div>
                  <label className="block text-[9px] font-bold uppercase text-brown/70 mb-1">Kutipan Foto</label>
                  <textarea
                    rows={2}
                    value={formData.hero_slide_surfing_quote}
                    onChange={(e) => handleChange('hero_slide_surfing_quote', e.target.value)}
                    className="w-full rounded-none border border-brown bg-white px-2.5 py-1.5 text-xs text-black focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase text-brown/70 mb-1">Deskripsi Singkat</label>
                  <textarea
                    rows={2}
                    value={formData.hero_slide_surfing_desc}
                    onChange={(e) => handleChange('hero_slide_surfing_desc', e.target.value)}
                    className="w-full rounded-none border border-brown bg-white px-2.5 py-1.5 text-xs text-black focus:outline-none"
                  />
                </div>
              </div>

              {/* Vehicle */}
              <div className="p-4 rounded-none bg-softyellow/30 border border-brown/30 space-y-2.5">
                <p className="font-bold text-brown uppercase text-[11px]">04. Sewa Kendaraan</p>
                <div>
                  <label className="block text-[9px] font-bold uppercase text-brown/70 mb-1">Kutipan Foto</label>
                  <textarea
                    rows={2}
                    value={formData.hero_slide_vehicle_quote}
                    onChange={(e) => handleChange('hero_slide_vehicle_quote', e.target.value)}
                    className="w-full rounded-none border border-brown bg-white px-2.5 py-1.5 text-xs text-black focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase text-brown/70 mb-1">Deskripsi Singkat</label>
                  <textarea
                    rows={2}
                    value={formData.hero_slide_vehicle_desc}
                    onChange={(e) => handleChange('hero_slide_vehicle_desc', e.target.value)}
                    className="w-full rounded-none border border-brown bg-white px-2.5 py-1.5 text-xs text-black focus:outline-none"
                  />
                </div>
              </div>

              {/* Tattoo */}
              <div className="p-4 rounded-none bg-softyellow/30 border border-brown/30 space-y-2.5">
                <p className="font-bold text-brown uppercase text-[11px]">05. Tato Studio</p>
                <div>
                  <label className="block text-[9px] font-bold uppercase text-brown/70 mb-1">Kutipan Foto</label>
                  <textarea
                    rows={2}
                    value={formData.hero_slide_tattoo_quote}
                    onChange={(e) => handleChange('hero_slide_tattoo_quote', e.target.value)}
                    className="w-full rounded-none border border-brown bg-white px-2.5 py-1.5 text-xs text-black focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase text-brown/70 mb-1">Deskripsi Singkat</label>
                  <textarea
                    rows={2}
                    value={formData.hero_slide_tattoo_desc}
                    onChange={(e) => handleChange('hero_slide_tattoo_desc', e.target.value)}
                    className="w-full rounded-none border border-brown bg-white px-2.5 py-1.5 text-xs text-black focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TENTANG KAMI */}
      {activeTab === 'about' && (
        <div className="rounded-none border-2 border-brown bg-softwhite p-6 space-y-5 shadow-none">
          <div className="border-b-2 border-brown/20 pb-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-brown">
              Seksi Tentang Doamandeh &amp; Statistik
            </h2>
            <p className="text-[11px] text-brown/70 mt-0.5">
              Atur headline, paragraf narasi bisnis, serta angka statistik di seksi About.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-brown mb-1.5">
                Tagline Atas
              </label>
              <input
                type="text"
                value={formData.about_tagline}
                onChange={(e) => handleChange('about_tagline', e.target.value)}
                className="w-full rounded-none border-2 border-brown bg-softyellow/40 px-3 py-2 text-xs text-black focus:border-black focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-brown mb-1.5">
                Judul Headline Tentang Kami
              </label>
              <textarea
                rows={3}
                value={formData.about_title}
                onChange={(e) => handleChange('about_title', e.target.value)}
                className="w-full rounded-none border-2 border-brown bg-softyellow/40 px-3 py-2 text-xs text-black focus:border-black focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-brown mb-1.5">
                Paragraf Penjelasan Profil Bisnis
              </label>
              <textarea
                rows={4}
                value={formData.about_text}
                onChange={(e) => handleChange('about_text', e.target.value)}
                className="w-full rounded-none border-2 border-brown bg-softyellow/40 px-3 py-2 text-xs text-black focus:border-black focus:bg-white focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-3.5 rounded-none bg-softyellow/40 border border-brown/30 space-y-2">
                <p className="font-bold text-[10px] uppercase text-brown">Statistik 1</p>
                <input
                  type="text"
                  placeholder="Nilai (e.g. 100%)"
                  value={formData.about_stat_1_val}
                  onChange={(e) => handleChange('about_stat_1_val', e.target.value)}
                  className="w-full rounded-none border border-brown bg-white px-2.5 py-1.5 text-xs text-black font-bold focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Label (e.g. Sepenuh Hati)"
                  value={formData.about_stat_1_label}
                  onChange={(e) => handleChange('about_stat_1_label', e.target.value)}
                  className="w-full rounded-none border border-brown bg-white px-2.5 py-1.5 text-xs text-black focus:outline-none"
                />
              </div>

              <div className="p-3.5 rounded-none bg-softyellow/40 border border-brown/30 space-y-2">
                <p className="font-bold text-[10px] uppercase text-brown">Statistik 2</p>
                <input
                  type="text"
                  placeholder="Nilai (e.g. 24/7)"
                  value={formData.about_stat_2_val}
                  onChange={(e) => handleChange('about_stat_2_val', e.target.value)}
                  className="w-full rounded-none border border-brown bg-white px-2.5 py-1.5 text-xs text-black font-bold focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Label (e.g. Teman Perjalanan)"
                  value={formData.about_stat_2_label}
                  onChange={(e) => handleChange('about_stat_2_label', e.target.value)}
                  className="w-full rounded-none border border-brown bg-white px-2.5 py-1.5 text-xs text-black focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: KATALOG & CTA */}
      {activeTab === 'services_cta' && (
        <div className="rounded-none border-2 border-brown bg-softwhite p-6 space-y-6 shadow-none">
          <div className="border-b-2 border-brown/20 pb-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-brown">
              Seksi Katalog Layanan &amp; Penawaran CTA
            </h2>
            <p className="text-[11px] text-brown/70 mt-0.5">
              Atur teks header seksi Services dan penawaran Call to Action di bawah landing page.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-brown">Seksi Services</h3>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-brown mb-1.5">
                Judul Header Seksi Layanan (Enter untuk baris baru)
              </label>
              <textarea
                rows={2}
                value={formData.services_title}
                onChange={(e) => handleChange('services_title', e.target.value)}
                className="w-full rounded-none border-2 border-brown bg-softyellow/40 px-3 py-2 text-xs text-black focus:border-black focus:bg-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-brown mb-1.5">
                Deskripsi Seksi Layanan
              </label>
              <textarea
                rows={3}
                value={formData.services_subtitle}
                onChange={(e) => handleChange('services_subtitle', e.target.value)}
                className="w-full rounded-none border-2 border-brown bg-softyellow/40 px-3 py-2 text-xs text-black focus:border-black focus:bg-white focus:outline-none"
              />
            </div>

            <h3 className="text-xs font-bold uppercase tracking-wider text-brown pt-4 border-t-2 border-brown/20">
              Seksi Call to Action (CTA)
            </h3>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-brown mb-1.5">
                Tagline CTA
              </label>
              <input
                type="text"
                value={formData.cta_tagline}
                onChange={(e) => handleChange('cta_tagline', e.target.value)}
                className="w-full rounded-none border-2 border-brown bg-softyellow/40 px-3 py-2 text-xs text-black focus:border-black focus:bg-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-brown mb-1.5">
                Judul Utama CTA (Enter untuk baris baru)
              </label>
              <textarea
                rows={2}
                value={formData.cta_title}
                onChange={(e) => handleChange('cta_title', e.target.value)}
                className="w-full rounded-none border-2 border-brown bg-softyellow/40 px-3 py-2 text-xs text-black focus:border-black focus:bg-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-brown mb-1.5">
                Deskripsi Penawaran CTA
              </label>
              <textarea
                rows={2}
                value={formData.cta_subtitle}
                onChange={(e) => handleChange('cta_subtitle', e.target.value)}
                className="w-full rounded-none border-2 border-brown bg-softyellow/40 px-3 py-2 text-xs text-black focus:border-black focus:bg-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-brown mb-1.5">
                Teks Tombol CTA
              </label>
              <input
                type="text"
                value={formData.cta_button_text}
                onChange={(e) => handleChange('cta_button_text', e.target.value)}
                className="w-full rounded-none border-2 border-brown bg-softyellow/40 px-3 py-2 text-xs text-black focus:border-black focus:bg-white focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: TESTIMONI */}
      {activeTab === 'testimonials' && (
        <div className="rounded-none border-2 border-brown bg-softwhite p-6 space-y-5 shadow-none">
          <div className="flex items-center justify-between pb-3 border-b-2 border-brown/20">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-brown">
                Kelola Testimoni &amp; Ulasan Pelanggan
              </h2>
              <p className="text-[11px] text-brown/70 mt-0.5">
                Daftar ulasan yang ditampilkan pada carousel ulasan di landing page.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddTestimonial}
              className="inline-flex items-center gap-1.5 rounded-none bg-brown text-softyellow hover:bg-black border border-brown px-3 py-1.5 text-xs font-bold uppercase tracking-wider cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Tambah Ulasan</span>
            </button>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-brown mb-1.5">
              Judul Seksi Testimoni
            </label>
            <input
              type="text"
              value={formData.testimonials_title}
              onChange={(e) => handleChange('testimonials_title', e.target.value)}
              className="w-full rounded-none border-2 border-brown bg-softyellow/40 px-3 py-2 text-xs text-black focus:border-black focus:bg-white focus:outline-none"
            />
          </div>

          <div className="space-y-4 pt-2">
            {parsedTestimonials.map((item, idx) => (
              <div
                key={item.id || idx}
                className="p-4 rounded-none border-2 border-brown/30 bg-softyellow/30 space-y-3"
              >
                <div className="flex items-center justify-between pb-2 border-b border-brown/20">
                  <span className="font-bold uppercase text-[10px] text-brown">
                    Ulasan #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDeleteTestimonial(idx)}
                    className="p-1 rounded-none text-black hover:bg-black hover:text-softyellow transition-colors cursor-pointer"
                    title="Hapus Ulasan Ini"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[9px] font-bold uppercase text-brown/70 mb-1">Nama Customer</label>
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => handleUpdateTestimonial(idx, 'name', e.target.value)}
                      className="w-full rounded-none border border-brown bg-white px-2.5 py-1.5 text-xs text-black focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold uppercase text-brown/70 mb-1">Asal Kota / Negara</label>
                    <input
                      type="text"
                      value={item.location}
                      onChange={(e) => handleUpdateTestimonial(idx, 'location', e.target.value)}
                      className="w-full rounded-none border border-brown bg-white px-2.5 py-1.5 text-xs text-black focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold uppercase text-brown/70 mb-1">Kategori Layanan</label>
                    <input
                      type="text"
                      value={item.serviceCategory}
                      onChange={(e) => handleUpdateTestimonial(idx, 'serviceCategory', e.target.value)}
                      className="w-full rounded-none border border-brown bg-white px-2.5 py-1.5 text-xs text-black focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-bold uppercase text-brown/70 mb-1">Isi Komentar Ulasan</label>
                  <textarea
                    rows={2}
                    value={item.comment}
                    onChange={(e) => handleUpdateTestimonial(idx, 'comment', e.target.value)}
                    className="w-full rounded-none border border-brown bg-white px-2.5 py-1.5 text-xs text-black focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] font-bold uppercase text-brown/70 mb-1">Bulan &amp; Tahun</label>
                    <input
                      type="text"
                      value={item.date}
                      onChange={(e) => handleUpdateTestimonial(idx, 'date', e.target.value)}
                      className="w-full rounded-none border border-brown bg-white px-2.5 py-1.5 text-xs text-black focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold uppercase text-brown/70 mb-1">Rating Bintang (1-5)</label>
                    <input
                      type="number"
                      min={1}
                      max={5}
                      value={item.rating}
                      onChange={(e) => handleUpdateTestimonial(idx, 'rating', Number(e.target.value))}
                      className="w-full rounded-none border border-brown bg-white px-2.5 py-1.5 text-xs text-black focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: FAQ */}
      {activeTab === 'faq' && (
        <div className="rounded-none border-2 border-brown bg-softwhite p-6 space-y-5 shadow-none">
          <div className="flex items-center justify-between pb-3 border-b-2 border-brown/20">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-brown">
                Pertanyaan yang Sering Diajukan (FAQ)
              </h2>
              <p className="text-[11px] text-brown/70 mt-0.5">
                Kelola daftar accordion pertanyaan dan jawaban pada seksi FAQ.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddFaq}
              className="inline-flex items-center gap-1.5 rounded-none bg-brown text-softyellow hover:bg-black border border-brown px-3 py-1.5 text-xs font-bold uppercase tracking-wider cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Tambah Pertanyaan</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-brown mb-1.5">
                Judul Seksi FAQ (Enter untuk baris baru)
              </label>
              <textarea
                rows={2}
                value={formData.faq_title}
                onChange={(e) => handleChange('faq_title', e.target.value)}
                className="w-full rounded-none border-2 border-brown bg-softyellow/40 px-3 py-2 text-xs text-black focus:border-black focus:bg-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-brown mb-1.5">
                Subjudul / Penjelasan Singkat
              </label>
              <textarea
                rows={2}
                value={formData.faq_subtitle}
                onChange={(e) => handleChange('faq_subtitle', e.target.value)}
                className="w-full rounded-none border-2 border-brown bg-softyellow/40 px-3 py-2 text-xs text-black focus:border-black focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-4 pt-2">
            {parsedFaqs.map((faq, idx) => (
              <div
                key={idx}
                className="p-4 rounded-none border-2 border-brown/30 bg-softyellow/30 space-y-3"
              >
                <div className="flex items-center justify-between pb-2 border-b border-brown/20">
                  <span className="font-bold uppercase text-[10px] text-brown">
                    FAQ #{faq.num || idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDeleteFaq(idx)}
                    className="p-1 rounded-none text-black hover:bg-black hover:text-softyellow transition-colors cursor-pointer"
                    title="Hapus FAQ Ini"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[9px] font-bold uppercase text-brown/70 mb-1">Nomor (01, 02)</label>
                    <input
                      type="text"
                      value={faq.num}
                      onChange={(e) => handleUpdateFaq(idx, 'num', e.target.value)}
                      className="w-full rounded-none border border-brown bg-white px-2.5 py-1.5 text-xs text-black focus:outline-none font-mono"
                    />
                  </div>
                  <div className="sm:col-span-10">
                    <label className="block text-[9px] font-bold uppercase text-brown/70 mb-1">Pertanyaan</label>
                    <input
                      type="text"
                      value={faq.question}
                      onChange={(e) => handleUpdateFaq(idx, 'question', e.target.value)}
                      className="w-full rounded-none border border-brown bg-white px-2.5 py-1.5 text-xs text-black focus:outline-none font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-bold uppercase text-brown/70 mb-1">Jawaban Lengkap</label>
                  <textarea
                    rows={3}
                    value={faq.answer}
                    onChange={(e) => handleUpdateFaq(idx, 'answer', e.target.value)}
                    className="w-full rounded-none border border-brown bg-white px-2.5 py-1.5 text-xs text-black focus:outline-none font-light"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: KONTAK & JAM OPERASIONAL */}
      {activeTab === 'contact_hours' && (
        <div className="rounded-none border-2 border-brown bg-softwhite p-6 space-y-6 shadow-none">
          <div className="border-b-2 border-brown/20 pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-brown">
                Kontak Resmi &amp; Jam Operasional
              </h2>
              <p className="text-[11px] text-brown/70 mt-0.5">
                Konfigurasi nomor WhatsApp pemesanan, email, alamat kantor, dan jam buka.
              </p>
            </div>
            {!showSecondCS && !formData.contact_whatsapp_2 && (
              <button
                type="button"
                onClick={() => setShowSecondCS(true)}
                className="inline-flex items-center gap-1.5 rounded-none border-2 border-brown bg-softyellow px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-brown hover:bg-brown hover:text-softyellow transition-colors cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Tambah CS 2</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-brown mb-1.5">
                Nomor WhatsApp CS 1 (Utama) *
              </label>
              <input
                type="text"
                required
                value={formData.contact_whatsapp}
                onChange={(e) => handleChange('contact_whatsapp', e.target.value)}
                placeholder="+62 812-3456-7890"
                className="w-full rounded-none border-2 border-brown bg-softyellow/40 px-3 py-2 text-xs font-mono font-bold text-black focus:border-black focus:bg-white focus:outline-none"
              />
            </div>

            {(showSecondCS || Boolean(formData.contact_whatsapp_2)) && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-brown">
                    Nomor WhatsApp CS 2 (Cadangan)
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      handleChange('contact_whatsapp_2', '');
                      setShowSecondCS(false);
                    }}
                    className="inline-flex items-center gap-1 text-[10px] text-black hover:text-brown font-bold uppercase tracking-wider cursor-pointer"
                  >
                    <Trash2 className="h-3 w-3" />
                    <span>Hapus</span>
                  </button>
                </div>
                <input
                  type="text"
                  value={formData.contact_whatsapp_2 || ''}
                  onChange={(e) => handleChange('contact_whatsapp_2', e.target.value)}
                  placeholder="+62 819-8765-4321"
                  className="w-full rounded-none border-2 border-brown bg-softyellow/40 px-3 py-2 text-xs font-mono font-bold text-black focus:border-black focus:bg-white focus:outline-none"
                />
              </div>
            )}

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-brown mb-1.5">
                Nomor Telepon Kantor
              </label>
              <input
                type="text"
                value={formData.contact_phone}
                onChange={(e) => handleChange('contact_phone', e.target.value)}
                className="w-full rounded-none border-2 border-brown bg-softyellow/40 px-3 py-2 text-xs font-mono text-black focus:border-black focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-brown mb-1.5">
                Alamat Email Resmi
              </label>
              <input
                type="email"
                value={formData.contact_email}
                onChange={(e) => handleChange('contact_email', e.target.value)}
                className="w-full rounded-none border-2 border-brown bg-softyellow/40 px-3 py-2 text-xs text-black focus:border-black focus:bg-white focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-brown mb-1.5">
                Alamat Kantor / Studio Bali
              </label>
              <input
                type="text"
                value={formData.contact_address}
                onChange={(e) => handleChange('contact_address', e.target.value)}
                className="w-full rounded-none border-2 border-brown bg-softyellow/40 px-3 py-2 text-xs text-black focus:border-black focus:bg-white focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2 pt-4 border-t-2 border-brown/20 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-brown">Jam Operasional &amp; Footer Brand</h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[9px] font-bold uppercase text-brown/70 mb-1">Judul Operasional</label>
                  <input
                    type="text"
                    value={formData.operating_hours_title}
                    onChange={(e) => handleChange('operating_hours_title', e.target.value)}
                    className="w-full rounded-none border border-brown bg-white px-2.5 py-1.5 text-xs text-black focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase text-brown/70 mb-1">Jam Layanan</label>
                  <input
                    type="text"
                    value={formData.operating_hours_time}
                    onChange={(e) => handleChange('operating_hours_time', e.target.value)}
                    className="w-full rounded-none border border-brown bg-white px-2.5 py-1.5 text-xs text-black focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase text-brown/70 mb-1">Catatan Server</label>
                  <input
                    type="text"
                    value={formData.operating_hours_note}
                    onChange={(e) => handleChange('operating_hours_note', e.target.value)}
                    className="w-full rounded-none border border-brown bg-white px-2.5 py-1.5 text-xs text-black focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-brown mb-1.5">
                  Deskripsi Brand di Footer Publik
                </label>
                <textarea
                  rows={3}
                  value={formData.footer_brand_desc}
                  onChange={(e) => handleChange('footer_brand_desc', e.target.value)}
                  className="w-full rounded-none border-2 border-brown bg-softyellow/40 px-3 py-2 text-xs text-black focus:border-black focus:bg-white focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: MEDIA SOSIAL */}
      {activeTab === 'social' && (
        <div className="rounded-none border-2 border-brown bg-softwhite p-6 space-y-5 shadow-none">
          <div className="border-b-2 border-brown/20 pb-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-brown">
              Tautan Media Sosial Resmi
            </h2>
            <p className="text-[11px] text-brown/70 mt-0.5">
              Tautan profil sosial media yang muncul di header dan footer publik.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-brown mb-1.5">
                Instagram URL
              </label>
              <input
                type="text"
                value={formData.sosmed_instagram}
                onChange={(e) => handleChange('sosmed_instagram', e.target.value)}
                className="w-full rounded-none border-2 border-brown bg-softyellow/40 px-3 py-2 text-xs text-black focus:border-black focus:bg-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-brown mb-1.5">
                Facebook URL
              </label>
              <input
                type="text"
                value={formData.sosmed_facebook}
                onChange={(e) => handleChange('sosmed_facebook', e.target.value)}
                className="w-full rounded-none border-2 border-brown bg-softyellow/40 px-3 py-2 text-xs text-black focus:border-black focus:bg-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-brown mb-1.5">
                TikTok URL
              </label>
              <input
                type="text"
                value={formData.sosmed_tiktok}
                onChange={(e) => handleChange('sosmed_tiktok', e.target.value)}
                className="w-full rounded-none border-2 border-brown bg-softyellow/40 px-3 py-2 text-xs text-black focus:border-black focus:bg-white focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Action Controls */}
      <div className="flex items-center justify-between pt-4 border-t-2 border-brown">
        <button
          type="button"
          onClick={handleReset}
          disabled={isPending}
          className="inline-flex items-center gap-2 rounded-none border-2 border-brown bg-softwhite px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-brown hover:bg-softyellow disabled:opacity-50 cursor-pointer"
        >
          <RotateCcw className="h-4 w-4 stroke-[2]" />
          <span>Reset Default</span>
        </button>

        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 rounded-none bg-brown text-softyellow hover:bg-black border-2 border-brown hover:border-black px-6 py-2.5 text-xs font-bold uppercase tracking-widest transition-colors disabled:opacity-50 cursor-pointer shadow-none"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Menyimpan...</span>
            </>
          ) : (
            <>
              <Save className="h-4 w-4 stroke-[2]" />
              <span>Simpan Seluruh Pengaturan</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
