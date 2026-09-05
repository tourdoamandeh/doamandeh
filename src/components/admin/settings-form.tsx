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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ImageSettingField } from './image-setting-field';

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
      image: '/assets/hero-bali.svg',
    };
    handleTestimonialsChange([...parsedTestimonials, newItem]);
    toast.success('Item testimoni baru berhasil ditambahkan');
  }

  function handleDeleteTestimonial(index: number) {
    const updated = parsedTestimonials.filter((_, idx) => idx !== index);
    handleTestimonialsChange(updated);
    toast.info('Item testimoni telah dihapus');
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
      question: 'Pertanyaan baru mengenai layanan?',
      answer: 'Penjelasan dan detail jawaban untuk memudahkan pelanggan.',
    };
    handleFaqsChange([...parsedFaqs, newItem]);
    toast.success('Item FAQ baru berhasil ditambahkan');
  }

  function handleDeleteFaq(index: number) {
    const updated = parsedFaqs.filter((_, idx) => idx !== index);
    handleFaqsChange(updated);
    toast.info('Item FAQ telah dihapus');
  }

  function handleReset() {
    if (confirm('Kembalikan seluruh teks pengaturan ke konfigurasi bawaan Doamandeh?')) {
      setFormData(DEFAULT_SITE_SETTINGS);
      setStatus({
        type: 'success',
        message: 'Pengaturan berhasil direset ke nilai default.',
      });
      toast.info('Pengaturan direset ke default.');
    }
  }

  async function handleSubmit(e: React.FormEvent) {
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
          className={`flex items-start gap-3 p-4 rounded-lg border ${
            status.type === 'success'
              ? 'border-success/30 bg-success-bg text-success'
              : 'border-destructive/30 bg-destructive/10 text-destructive'
          }`}
        >
          {status.type === 'success' ? (
            <CheckCircle2 className="size-5 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="size-5 shrink-0 mt-0.5" />
          )}
          <div className="flex-1">
            <p className="font-semibold text-xs">
              {status.type === 'success' ? 'Berhasil Disimpan' : 'Kendala Sistem'}
            </p>
            <p className="mt-0.5 text-xs opacity-90">{status.message}</p>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-3.5 py-2 text-xs font-medium rounded transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-card border border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: HERO & SLOGAN */}
      {activeTab === 'hero' && (
        <Card className="bg-card border-border shadow-none rounded-lg p-6 space-y-5">
          <div className="border-b border-border pb-3">
            <h2 className="text-sm font-semibold text-foreground">
              Hero Section &amp; Kutipan Layanan
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Judul utama hero dan narasi kutipan per kategori yang berganti otomatis di banner landing page.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">
                Judul Hero Utama (Gunakan Enter untuk baris baru) *
              </Label>
              <textarea
                rows={4}
                required
                value={formData.hero_title}
                onChange={(e) => handleChange('hero_title', e.target.value)}
                placeholder="Doamandeh, \n— Rencanakan \nPerjalanan"
                className="w-full rounded border border-border bg-background px-3 py-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring leading-relaxed resize-y min-h-[96px]"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium">
                Subjudul / Tagline Hero *
              </Label>
              <textarea
                rows={3}
                required
                value={formData.hero_subtitle}
                onChange={(e) => handleChange('hero_subtitle', e.target.value)}
                placeholder="Solusi lengkap kebutuhan aktivitas liburan Anda di Bali..."
                className="w-full rounded border border-border bg-background px-3 py-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring leading-relaxed resize-y min-h-[75px]"
              />
            </div>

            {/* Hero Main / Background Image */}
            <div className="pt-2 border-t border-border">
              <ImageSettingField
                id="hero_bg_image"
                label="Foto Utama / Latar Belakang Hero Section"
                description="Foto utama yang tampil di kolom kiri banner Hero website."
                value={formData.hero_bg_image || ''}
                fallbackUrl="/assets/hero-bali.svg"
                aspectRatio="wide"
                onChange={(val) => handleChange('hero_bg_image', val)}
              />
            </div>

            {/* Service Slide Quotes & Images */}
            <div className="pt-3 border-t border-border space-y-4">
              <h3 className="text-xs font-semibold text-foreground">
                Kutipan &amp; Foto Banner per Kategori Layanan
              </h3>

              {/* Travel */}
              <div className="p-4 rounded border border-border bg-muted/20 space-y-3">
                <p className="font-semibold text-foreground text-xs">01. Paket Travel</p>
                <ImageSettingField
                  id="hero_slide_travel_img"
                  label="Foto Slide Kategori Travel"
                  description="Foto carousel yang tampil saat kategori Travel aktif."
                  value={formData.hero_slide_travel_img || ''}
                  fallbackUrl="/assets/service-travel.svg"
                  aspectRatio="video"
                  onChange={(val) => handleChange('hero_slide_travel_img', val)}
                />
                <div className="space-y-1.5">
                  <Label className="text-[11px] text-muted-foreground">Kutipan Foto</Label>
                  <textarea
                    rows={4}
                    value={formData.hero_slide_travel_quote}
                    onChange={(e) => handleChange('hero_slide_travel_quote', e.target.value)}
                    className="w-full rounded border border-border bg-background px-3 py-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring leading-relaxed resize-y min-h-[92px]"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[11px] text-muted-foreground">Deskripsi Singkat</Label>
                  <textarea
                    rows={4}
                    value={formData.hero_slide_travel_desc}
                    onChange={(e) => handleChange('hero_slide_travel_desc', e.target.value)}
                    className="w-full rounded border border-border bg-background px-3 py-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring leading-relaxed resize-y min-h-[92px]"
                  />
                </div>
              </div>

              {/* Villa */}
              <div className="p-4 rounded border border-border bg-muted/20 space-y-3">
                <p className="font-semibold text-foreground text-xs">02. Villa Stay</p>
                <ImageSettingField
                  id="hero_slide_villa_img"
                  label="Foto Slide Kategori Villa"
                  description="Foto carousel yang tampil saat kategori Villa aktif."
                  value={formData.hero_slide_villa_img || ''}
                  fallbackUrl="/assets/service-villa.svg"
                  aspectRatio="video"
                  onChange={(val) => handleChange('hero_slide_villa_img', val)}
                />
                <div className="space-y-1.5">
                  <Label className="text-[11px] text-muted-foreground">Kutipan Foto</Label>
                  <textarea
                    rows={4}
                    value={formData.hero_slide_villa_quote}
                    onChange={(e) => handleChange('hero_slide_villa_quote', e.target.value)}
                    className="w-full rounded border border-border bg-background px-3 py-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring leading-relaxed resize-y min-h-[92px]"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[11px] text-muted-foreground">Deskripsi Singkat</Label>
                  <textarea
                    rows={4}
                    value={formData.hero_slide_villa_desc}
                    onChange={(e) => handleChange('hero_slide_villa_desc', e.target.value)}
                    className="w-full rounded border border-border bg-background px-3 py-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring leading-relaxed resize-y min-h-[92px]"
                  />
                </div>
              </div>

              {/* Surfing */}
              <div className="p-4 rounded border border-border bg-muted/20 space-y-3">
                <p className="font-semibold text-foreground text-xs">03. Surfing Lesson</p>
                <ImageSettingField
                  id="hero_slide_surfing_img"
                  label="Foto Slide Kategori Surfing"
                  description="Foto carousel yang tampil saat kategori Surfing aktif."
                  value={formData.hero_slide_surfing_img || ''}
                  fallbackUrl="/assets/service-surfing.svg"
                  aspectRatio="video"
                  onChange={(val) => handleChange('hero_slide_surfing_img', val)}
                />
                <div className="space-y-1.5">
                  <Label className="text-[11px] text-muted-foreground">Kutipan Foto</Label>
                  <textarea
                    rows={4}
                    value={formData.hero_slide_surfing_quote}
                    onChange={(e) => handleChange('hero_slide_surfing_quote', e.target.value)}
                    className="w-full rounded border border-border bg-background px-3 py-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring leading-relaxed resize-y min-h-[92px]"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[11px] text-muted-foreground">Deskripsi Singkat</Label>
                  <textarea
                    rows={4}
                    value={formData.hero_slide_surfing_desc}
                    onChange={(e) => handleChange('hero_slide_surfing_desc', e.target.value)}
                    className="w-full rounded border border-border bg-background px-3 py-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring leading-relaxed resize-y min-h-[92px]"
                  />
                </div>
              </div>

              {/* Vehicle */}
              <div className="p-4 rounded border border-border bg-muted/20 space-y-3">
                <p className="font-semibold text-foreground text-xs">04. Sewa Kendaraan</p>
                <ImageSettingField
                  id="hero_slide_vehicle_img"
                  label="Foto Slide Kategori Sewa Kendaraan"
                  description="Foto carousel yang tampil saat kategori Sewa Kendaraan aktif."
                  value={formData.hero_slide_vehicle_img || ''}
                  fallbackUrl="/assets/service-vehicle.svg"
                  aspectRatio="video"
                  onChange={(val) => handleChange('hero_slide_vehicle_img', val)}
                />
                <div className="space-y-1.5">
                  <Label className="text-[11px] text-muted-foreground">Kutipan Foto</Label>
                  <textarea
                    rows={4}
                    value={formData.hero_slide_vehicle_quote}
                    onChange={(e) => handleChange('hero_slide_vehicle_quote', e.target.value)}
                    className="w-full rounded border border-border bg-background px-3 py-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring leading-relaxed resize-y min-h-[92px]"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[11px] text-muted-foreground">Deskripsi Singkat</Label>
                  <textarea
                    rows={4}
                    value={formData.hero_slide_vehicle_desc}
                    onChange={(e) => handleChange('hero_slide_vehicle_desc', e.target.value)}
                    className="w-full rounded border border-border bg-background px-3 py-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring leading-relaxed resize-y min-h-[92px]"
                  />
                </div>
              </div>

              {/* Tattoo */}
              <div className="p-4 rounded border border-border bg-muted/20 space-y-3">
                <p className="font-semibold text-foreground text-xs">05. Tato Studio</p>
                <ImageSettingField
                  id="hero_slide_tattoo_img"
                  label="Foto Slide Kategori Tato Studio"
                  description="Foto carousel yang tampil saat kategori Tato aktif."
                  value={formData.hero_slide_tattoo_img || ''}
                  fallbackUrl="/assets/service-tattoo.svg"
                  aspectRatio="video"
                  onChange={(val) => handleChange('hero_slide_tattoo_img', val)}
                />
                <div className="space-y-1.5">
                  <Label className="text-[11px] text-muted-foreground">Kutipan Foto</Label>
                  <textarea
                    rows={4}
                    value={formData.hero_slide_tattoo_quote}
                    onChange={(e) => handleChange('hero_slide_tattoo_quote', e.target.value)}
                    className="w-full rounded border border-border bg-background px-3 py-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring leading-relaxed resize-y min-h-[92px]"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[11px] text-muted-foreground">Deskripsi Singkat</Label>
                  <textarea
                    rows={4}
                    value={formData.hero_slide_tattoo_desc}
                    onChange={(e) => handleChange('hero_slide_tattoo_desc', e.target.value)}
                    className="w-full rounded border border-border bg-background px-3 py-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring leading-relaxed resize-y min-h-[92px]"
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* TAB 2: TENTANG KAMI */}
      {activeTab === 'about' && (
        <Card className="bg-card border-border shadow-none rounded-lg p-6 space-y-5">
          <div className="border-b border-border pb-3">
            <h2 className="text-sm font-semibold text-foreground">
              Seksi Tentang Doamandeh &amp; Statistik
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Atur headline, paragraf narasi bisnis, serta angka statistik di seksi About.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Tagline Atas</Label>
              <Input
                type="text"
                value={formData.about_tagline}
                onChange={(e) => handleChange('about_tagline', e.target.value)}
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Judul Headline Tentang Kami</Label>
              <textarea
                rows={4}
                value={formData.about_title}
                onChange={(e) => handleChange('about_title', e.target.value)}
                className="w-full rounded border border-border bg-background px-3 py-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring leading-relaxed resize-y min-h-[96px]"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Paragraf Penjelasan Profil Bisnis</Label>
              <textarea
                rows={6}
                value={formData.about_text}
                onChange={(e) => handleChange('about_text', e.target.value)}
                className="w-full rounded border border-border bg-background px-3 py-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring leading-relaxed resize-y min-h-[140px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-3.5 rounded border border-border bg-muted/20 space-y-2">
                <p className="font-semibold text-xs text-foreground">Statistik 1</p>
                <Input
                  type="text"
                  placeholder="Nilai (e.g. 100%)"
                  value={formData.about_stat_1_val}
                  onChange={(e) => handleChange('about_stat_1_val', e.target.value)}
                  className="h-8 text-xs font-mono tabular-nums"
                />
                <Input
                  type="text"
                  placeholder="Label (e.g. Sepenuh Hati)"
                  value={formData.about_stat_1_label}
                  onChange={(e) => handleChange('about_stat_1_label', e.target.value)}
                  className="h-8 text-xs"
                />
              </div>

              <div className="p-3.5 rounded border border-border bg-muted/20 space-y-2">
                <p className="font-semibold text-xs text-foreground">Statistik 2</p>
                <Input
                  type="text"
                  placeholder="Nilai (e.g. 24/7)"
                  value={formData.about_stat_2_val}
                  onChange={(e) => handleChange('about_stat_2_val', e.target.value)}
                  className="h-8 text-xs font-mono tabular-nums"
                />
                <Input
                  type="text"
                  placeholder="Label (e.g. Teman Perjalanan)"
                  value={formData.about_stat_2_label}
                  onChange={(e) => handleChange('about_stat_2_label', e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
            </div>

            {/* Foto 1 & Foto 2 Seksi About */}
            <div className="pt-4 border-t border-border space-y-4">
              <h3 className="text-xs font-semibold text-foreground">
                Foto Seksi Tentang Doamandeh
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ImageSettingField
                  id="about_image_1"
                  label="[01] Foto Rumah Pohon & Alam Bali"
                  description="Ditampilkan pada kolom kiri bawah angka statistik."
                  value={formData.about_image_1 || ''}
                  fallbackUrl="/assets/about-photo-1.svg"
                  aspectRatio="portrait"
                  onChange={(val) => handleChange('about_image_1', val)}
                />
                <ImageSettingField
                  id="about_image_2"
                  label="[02] Foto Tebing & Tepi Laut Bali"
                  description="Ditampilkan pada kolom kanan bawah teks paragraf."
                  value={formData.about_image_2 || ''}
                  fallbackUrl="/assets/about-photo-2.svg"
                  aspectRatio="portrait"
                  onChange={(val) => handleChange('about_image_2', val)}
                />
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* TAB 3: KATALOG & CTA */}
      {activeTab === 'services_cta' && (
        <Card className="bg-card border-border shadow-none rounded-lg p-6 space-y-6">
          <div className="border-b border-border pb-3">
            <h2 className="text-sm font-semibold text-foreground">
              Seksi Katalog Layanan &amp; Penawaran CTA
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Atur teks header seksi Services dan penawaran Call to Action di bawah landing page.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-foreground">Seksi Services</h3>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">
                Judul Header Seksi Layanan (Enter untuk baris baru)
              </Label>
              <textarea
                rows={3}
                value={formData.services_title}
                onChange={(e) => handleChange('services_title', e.target.value)}
                className="w-full rounded border border-border bg-background px-3 py-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring leading-relaxed resize-y min-h-[80px]"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Deskripsi Seksi Layanan</Label>
              <textarea
                rows={4}
                value={formData.services_subtitle}
                onChange={(e) => handleChange('services_subtitle', e.target.value)}
                className="w-full rounded border border-border bg-background px-3 py-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring leading-relaxed resize-y min-h-[96px]"
              />
            </div>

            <h3 className="text-xs font-semibold text-foreground pt-4 border-t border-border">
              Seksi Call to Action (CTA)
            </h3>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Tagline CTA</Label>
              <Input
                type="text"
                value={formData.cta_tagline}
                onChange={(e) => handleChange('cta_tagline', e.target.value)}
                className="h-9 text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">
                Judul Utama CTA (Enter untuk baris baru)
              </Label>
              <textarea
                rows={3}
                value={formData.cta_title}
                onChange={(e) => handleChange('cta_title', e.target.value)}
                className="w-full rounded border border-border bg-background px-3 py-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring leading-relaxed resize-y min-h-[80px]"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Deskripsi Penawaran CTA</Label>
              <textarea
                rows={3}
                value={formData.cta_subtitle}
                onChange={(e) => handleChange('cta_subtitle', e.target.value)}
                className="w-full rounded border border-border bg-background px-3 py-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring leading-relaxed resize-y min-h-[80px]"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Teks Tombol CTA</Label>
              <Input
                type="text"
                value={formData.cta_button_text}
                onChange={(e) => handleChange('cta_button_text', e.target.value)}
                className="h-9 text-xs"
              />
            </div>

            {/* CTA Cards Images */}
            <div className="pt-4 border-t border-border space-y-4">
              <h3 className="text-xs font-semibold text-foreground">
                Foto Kartu Interaktif CTA per Layanan
              </h3>
              <p className="text-[11px] text-muted-foreground">
                Foto latar belakang untuk kartu yang bisa digeser pada seksi Call to Action di bawah landing page.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ImageSettingField
                  id="cta_card_travel_img"
                  label="Kartu Paket Tour & Travel"
                  value={formData.cta_card_travel_img || ''}
                  fallbackUrl="/assets/service-travel.jpg"
                  aspectRatio="portrait"
                  onChange={(val) => handleChange('cta_card_travel_img', val)}
                />
                <ImageSettingField
                  id="cta_card_vehicle_img"
                  label="Kartu Sewa Kendaraan"
                  value={formData.cta_card_vehicle_img || ''}
                  fallbackUrl="/assets/service-vehicle.jpg"
                  aspectRatio="portrait"
                  onChange={(val) => handleChange('cta_card_vehicle_img', val)}
                />
                <ImageSettingField
                  id="cta_card_villa_img"
                  label="Kartu Villa Private Pool"
                  value={formData.cta_card_villa_img || ''}
                  fallbackUrl="/assets/service-villa.jpg"
                  aspectRatio="portrait"
                  onChange={(val) => handleChange('cta_card_villa_img', val)}
                />
                <ImageSettingField
                  id="cta_card_tattoo_img"
                  label="Kartu Professional Tattoo Studio"
                  value={formData.cta_card_tattoo_img || ''}
                  fallbackUrl="/assets/service-tattoo.jpg"
                  aspectRatio="portrait"
                  onChange={(val) => handleChange('cta_card_tattoo_img', val)}
                />
                <ImageSettingField
                  id="cta_card_surfing_img"
                  label="Kartu Surfing Lesson Pemula"
                  value={formData.cta_card_surfing_img || ''}
                  fallbackUrl="/assets/service-surfing.png"
                  aspectRatio="portrait"
                  onChange={(val) => handleChange('cta_card_surfing_img', val)}
                />
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* TAB 4: TESTIMONI */}
      {activeTab === 'testimonials' && (
        <Card className="bg-card border-border shadow-none rounded-lg p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div>
              <h2 className="text-sm font-semibold text-foreground">
                Kelola Testimoni &amp; Ulasan Pelanggan
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Daftar ulasan yang ditampilkan pada carousel ulasan di landing page.
              </p>
            </div>
            <Button
              type="button"
              size="sm"
              onClick={handleAddTestimonial}
              className="bg-primary hover:bg-primary/90 text-primary-foreground h-8"
            >
              <Plus className="size-3.5 mr-1" />
              <span>Tambah Ulasan</span>
            </Button>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Judul Seksi Testimoni</Label>
            <Input
              type="text"
              value={formData.testimonials_title}
              onChange={(e) => handleChange('testimonials_title', e.target.value)}
              className="h-9 text-xs"
            />
          </div>

          <div className="space-y-4 pt-2">
            {parsedTestimonials.map((item, idx) => (
              <div
                key={item.id || idx}
                className="p-4 rounded border border-border bg-muted/20 space-y-3"
              >
                <div className="flex items-center justify-between pb-2 border-b border-border">
                  <span className="font-semibold text-xs text-foreground">
                    Ulasan #{idx + 1}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteTestimonial(idx)}
                    className="size-7 p-0 text-muted-foreground hover:text-destructive"
                    title="Hapus Ulasan Ini"
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <Label className="text-[11px] text-muted-foreground">Nama Customer</Label>
                    <Input
                      type="text"
                      value={item.name}
                      onChange={(e) => handleUpdateTestimonial(idx, 'name', e.target.value)}
                      className="h-8 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px] text-muted-foreground">Asal Kota / Negara</Label>
                    <Input
                      type="text"
                      value={item.location}
                      onChange={(e) => handleUpdateTestimonial(idx, 'location', e.target.value)}
                      className="h-8 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px] text-muted-foreground">Kategori Layanan</Label>
                    <Input
                      type="text"
                      value={item.serviceCategory}
                      onChange={(e) => handleUpdateTestimonial(idx, 'serviceCategory', e.target.value)}
                      className="h-8 text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-[11px] text-muted-foreground">Isi Komentar Ulasan</Label>
                  <textarea
                    rows={3}
                    value={item.comment}
                    onChange={(e) => handleUpdateTestimonial(idx, 'comment', e.target.value)}
                    className="w-full rounded border border-border bg-background px-3 py-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring leading-relaxed resize-y min-h-[75px]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-[11px] text-muted-foreground">Bulan &amp; Tahun</Label>
                    <Input
                      type="text"
                      value={item.date}
                      onChange={(e) => handleUpdateTestimonial(idx, 'date', e.target.value)}
                      className="h-8 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px] text-muted-foreground">Rating Bintang (1-5)</Label>
                    <Input
                      type="number"
                      min={1}
                      max={5}
                      value={item.rating}
                      onChange={(e) => handleUpdateTestimonial(idx, 'rating', Number(e.target.value))}
                      className="h-8 text-xs font-mono tabular-nums"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* TAB 5: FAQ */}
      {activeTab === 'faq' && (
        <Card className="bg-card border-border shadow-none rounded-lg p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div>
              <h2 className="text-sm font-semibold text-foreground">
                Pertanyaan yang Sering Diajukan (FAQ)
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Kelola daftar accordion pertanyaan dan jawaban pada seksi FAQ.
              </p>
            </div>
            <Button
              type="button"
              size="sm"
              onClick={handleAddFaq}
              className="bg-primary hover:bg-primary/90 text-primary-foreground h-8"
            >
              <Plus className="size-3.5 mr-1" />
              <span>Tambah Pertanyaan</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">
                Judul Seksi FAQ (Enter untuk baris baru)
              </Label>
              <textarea
                rows={3}
                value={formData.faq_title}
                onChange={(e) => handleChange('faq_title', e.target.value)}
                className="w-full rounded border border-border bg-background px-3 py-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring leading-relaxed resize-y min-h-[75px]"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">
                Subjudul / Penjelasan Singkat
              </Label>
              <textarea
                rows={3}
                value={formData.faq_subtitle}
                onChange={(e) => handleChange('faq_subtitle', e.target.value)}
                className="w-full rounded border border-border bg-background px-3 py-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring leading-relaxed resize-y min-h-[75px]"
              />
            </div>
          </div>

          {/* FAQ Side Image */}
          <div className="pt-2">
            <ImageSettingField
              id="faq_image"
              label="Foto Banner Samping FAQ (Desktop &amp; Mobile)"
              description="Foto vertikal di sebelah kanan accordion FAQ pada layar desktop dan thumbnail atas pada mobile."
              value={formData.faq_image || ''}
              fallbackUrl="https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80"
              aspectRatio="portrait"
              onChange={(val) => handleChange('faq_image', val)}
            />
          </div>

          <div className="space-y-4 pt-2">
            {parsedFaqs.map((faq, idx) => (
              <div
                key={idx}
                className="p-4 rounded border border-border bg-muted/20 space-y-3"
              >
                <div className="flex items-center justify-between pb-2 border-b border-border">
                  <span className="font-semibold text-xs text-foreground">
                    FAQ #{faq.num || idx + 1}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteFaq(idx)}
                    className="size-7 p-0 text-muted-foreground hover:text-destructive"
                    title="Hapus FAQ Ini"
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                  <div className="sm:col-span-2 space-y-1">
                    <Label className="text-[11px] text-muted-foreground">Nomor</Label>
                    <Input
                      type="text"
                      value={faq.num}
                      onChange={(e) => handleUpdateFaq(idx, 'num', e.target.value)}
                      className="h-8 text-xs font-mono"
                    />
                  </div>
                  <div className="sm:col-span-10 space-y-1">
                    <Label className="text-[11px] text-muted-foreground">Pertanyaan</Label>
                    <Input
                      type="text"
                      value={faq.question}
                      onChange={(e) => handleUpdateFaq(idx, 'question', e.target.value)}
                      className="h-8 text-xs font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-[11px] text-muted-foreground">Jawaban Lengkap</Label>
                  <textarea
                    rows={4}
                    value={faq.answer}
                    onChange={(e) => handleUpdateFaq(idx, 'answer', e.target.value)}
                    className="w-full rounded border border-border bg-background px-3 py-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring leading-relaxed resize-y min-h-[96px]"
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* TAB 6: KONTAK & JAM OPERASIONAL */}
      {activeTab === 'contact_hours' && (
        <Card className="bg-card border-border shadow-none rounded-lg p-6 space-y-6">
          <div className="border-b border-border pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-foreground">
                Kontak Resmi &amp; Jam Operasional
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Konfigurasi nomor WhatsApp pemesanan, email, alamat kantor, dan jam buka.
              </p>
            </div>
            {!showSecondCS && !formData.contact_whatsapp_2 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowSecondCS(true)}
                className="h-8 text-xs"
              >
                <Plus className="size-3.5 mr-1" />
                <span>Tambah CS 2</span>
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">
                Nomor WhatsApp CS 1 (Utama) *
              </Label>
              <Input
                type="text"
                required
                value={formData.contact_whatsapp}
                onChange={(e) => handleChange('contact_whatsapp', e.target.value)}
                placeholder="+62 812-3456-7890"
                className="h-9 text-xs font-mono"
              />
            </div>

            {(showSecondCS || Boolean(formData.contact_whatsapp_2)) && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-medium">
                    Nomor WhatsApp CS 2 (Cadangan)
                  </Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      handleChange('contact_whatsapp_2', '');
                      setShowSecondCS(false);
                    }}
                    className="h-6 px-2 text-[11px] text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="size-3 mr-1" />
                    <span>Hapus</span>
                  </Button>
                </div>
                <Input
                  type="text"
                  value={formData.contact_whatsapp_2 || ''}
                  onChange={(e) => handleChange('contact_whatsapp_2', e.target.value)}
                  placeholder="+62 819-8765-4321"
                  className="h-9 text-xs font-mono"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <Label className="text-xs font-medium">
                Nomor Telepon Kantor
              </Label>
              <Input
                type="text"
                value={formData.contact_phone}
                onChange={(e) => handleChange('contact_phone', e.target.value)}
                className="h-9 text-xs font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium">
                Alamat Email Resmi
              </Label>
              <Input
                type="email"
                value={formData.contact_email}
                onChange={(e) => handleChange('contact_email', e.target.value)}
                className="h-9 text-xs font-mono"
              />
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <Label className="text-xs font-medium">
                Alamat Kantor / Studio Bali
              </Label>
              <textarea
                rows={2}
                value={formData.contact_address}
                onChange={(e) => handleChange('contact_address', e.target.value)}
                placeholder="Jl. Pantai Kuta No. 88, Badung, Bali..."
                className="w-full rounded border border-border bg-background px-3 py-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring leading-relaxed resize-y min-h-[64px]"
              />
            </div>

            <div className="sm:col-span-2 pt-4 border-t border-border space-y-4">
              <h3 className="text-xs font-semibold text-foreground">Jam Operasional &amp; Footer Brand</h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-[11px] text-muted-foreground">Judul Operasional</Label>
                  <Input
                    type="text"
                    value={formData.operating_hours_title}
                    onChange={(e) => handleChange('operating_hours_title', e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[11px] text-muted-foreground">Jam Layanan</Label>
                  <Input
                    type="text"
                    value={formData.operating_hours_time}
                    onChange={(e) => handleChange('operating_hours_time', e.target.value)}
                    className="h-8 text-xs font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[11px] text-muted-foreground">Catatan Tambahan</Label>
                  <Input
                    type="text"
                    value={formData.operating_hours_note}
                    onChange={(e) => handleChange('operating_hours_note', e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium">
                  Deskripsi Brand di Footer Publik
                </Label>
                <textarea
                  rows={4}
                  value={formData.footer_brand_desc}
                  onChange={(e) => handleChange('footer_brand_desc', e.target.value)}
                  className="w-full rounded border border-border bg-background px-3 py-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring leading-relaxed resize-y min-h-[96px]"
                />
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* TAB 7: MEDIA SOSIAL */}
      {activeTab === 'social' && (
        <Card className="bg-card border-border shadow-none rounded-lg p-6 space-y-5">
          <div className="border-b border-border pb-3">
            <h2 className="text-sm font-semibold text-foreground">
              Tautan Media Sosial Resmi
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Tautan profil sosial media yang muncul di header dan footer publik.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Instagram URL</Label>
              <Input
                type="text"
                value={formData.sosmed_instagram}
                onChange={(e) => handleChange('sosmed_instagram', e.target.value)}
                className="h-9 text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Facebook URL</Label>
              <Input
                type="text"
                value={formData.sosmed_facebook}
                onChange={(e) => handleChange('sosmed_facebook', e.target.value)}
                className="h-9 text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">TikTok URL</Label>
              <Input
                type="text"
                value={formData.sosmed_tiktok}
                onChange={(e) => handleChange('sosmed_tiktok', e.target.value)}
                className="h-9 text-xs"
              />
            </div>
          </div>
        </Card>
      )}

      {/* Action Controls */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <Button
          type="button"
          variant="outline"
          onClick={handleReset}
          disabled={isPending}
          size="sm"
        >
          <RotateCcw className="size-3.5 mr-1.5" />
          <span>Reset Default</span>
        </Button>

        <Button
          type="submit"
          disabled={isPending}
          size="sm"
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          {isPending ? (
            <>
              <Loader2 className="size-3.5 animate-spin mr-1.5" />
              <span>Menyimpan...</span>
            </>
          ) : (
            <>
              <Save className="size-3.5 mr-1.5" />
              <span>Simpan Pengaturan</span>
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
