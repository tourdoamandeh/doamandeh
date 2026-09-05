import type { Metadata } from 'next';
import { getSiteSettingsAction } from '@/lib/actions/admin/settings';
import { DEFAULT_SITE_SETTINGS } from '@/lib/validations/admin';
import { PublicHeader } from '@/components/public/public-header';
import { PublicFooter } from '@/components/public/public-footer';
import { ContactForm } from '@/components/public/contact-form';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { ArrowUpRight, MapPin } from 'lucide-react';

export const metadata: Metadata = {
  title: "Kontak & Lokasi | Do'amandeh Tours & Travel Bali",
  description:
    "Hubungi tim Do'amandeh Tours and Travel di Bali. Reservasi sewa kendaraan, villa, studio tato, tour, dan selancar via WhatsApp, email, atau kantor kami di Canggu.",
  openGraph: {
    title: "Kontak & Lokasi | Do'amandeh Tours & Travel",
    description:
      'Layanan reservasi dan konsultasi wisata Bali via WhatsApp, Telepon, dan Email.',
    type: 'website',
  },
};

export default async function ContactPage() {
  const settingsResult = await getSiteSettingsAction();
  const siteSettings = settingsResult.success && settingsResult.data
    ? settingsResult.data
    : DEFAULT_SITE_SETTINGS;

  const cleanWa = (siteSettings.contact_whatsapp || '+62 812-3456-7890').replace(/[^0-9]/g, '');
  const waUrl = `https://wa.me/${cleanWa}?text=${encodeURIComponent(
    "Halo Do'amandeh Tours and Travel, saya ingin konsultasi via pesan online."
  )}`;

  const CHANNELS = [
    {
      label: 'WHATSAPP (RESPON CEPAT 24/7)',
      value: siteSettings.contact_whatsapp || '+62 812-3456-7890',
      href: waUrl,
      isExternal: true,
    },
    {
      label: 'EMAIL OFFICIAL',
      value: siteSettings.contact_email || 'info@doamandeh.com',
      href: `mailto:${siteSettings.contact_email || 'info@doamandeh.com'}`,
      isExternal: true,
    },
    {
      label: 'INSTAGRAM RESMI',
      value: '@doamandeh',
      href: siteSettings.sosmed_instagram || 'https://instagram.com/doamandeh',
      isExternal: true,
    },
    {
      label: 'OFFICE & MEETING POINT',
      value: siteSettings.contact_address || 'Canggu - Badung, Bali',
      href: '#map-section',
      isExternal: false,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-paper text-ink font-sans selection:bg-sun selection:text-ink">
      <PublicHeader
        whatsappNumber={siteSettings.contact_whatsapp}
        brandName={siteSettings.brand_name}
        brandTagline={siteSettings.brand_tagline}
      />

      <main className="flex-1 max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 py-8 sm:py-12 w-full">
        {/* Breadcrumb (shadcn) */}
        <div className="pb-8">
          <Breadcrumb>
            <BreadcrumbList className="text-xs uppercase tracking-widest font-mono text-ink/60">
              <BreadcrumbItem>
                <BreadcrumbLink href="/" className="hover:text-ink transition-colors">
                  Beranda
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-ink/40">/</BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage className="text-ink font-medium">
                  Kontak
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* 1. SPLIT 12 SECTION (DESIGN.md v2) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start pb-16">
          {/* col-5: judul "Let's Talk" + index list channel */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <p className="text-xs uppercase tracking-widest font-mono text-ocean mb-3">
                // KONTAK &amp; BANTUAN
              </p>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-medium tracking-tight text-ink leading-[0.95] mb-4">
                {siteSettings.contact_title || "Let's Talk"}
              </h1>
              <p className="text-sm sm:text-base text-ink/75 font-light leading-relaxed">
                {siteSettings.contact_subtitle ||
                  'Punya pertanyaan ketersediaan armada, konsultasi desain tato, ketersediaan villa privat, atau rencana tour kustom di Bali? Hubungi saluran resmi kami kapan saja.'}
              </p>
            </div>

            {/* Index list channel (tiap row border-t, hover bg-sun) */}
            <div className="border-t border-b border-line divide-y divide-line">
              {CHANNELS.map((ch) => (
                <a
                  key={ch.label}
                  href={ch.href}
                  target={ch.isExternal ? '_blank' : undefined}
                  rel={ch.isExternal ? 'noopener noreferrer' : undefined}
                  className="group py-5 px-3 hover:bg-sun transition-colors flex items-center justify-between gap-4 block cursor-pointer"
                >
                  <div className="min-w-0">
                    <span className="text-[10px] uppercase tracking-widest font-mono text-ink/50 block mb-1">
                      {ch.label}
                    </span>
                    <span className="text-base sm:text-lg font-medium text-ink tracking-tight truncate block group-hover:text-ink">
                      {ch.value}
                    </span>
                  </div>
                  <div className="size-8 border border-line flex items-center justify-center bg-paper group-hover:bg-ink group-hover:text-paper group-hover:border-ink transition-colors shrink-0">
                    <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={1.5} />
                  </div>
                </a>
              ))}
            </div>

            {/* Jam Operasional */}
            <div className="border border-line p-5 bg-foam text-xs space-y-1">
              <span className="text-[10px] uppercase tracking-widest font-mono text-ink/50 block">
                // JAM KERJA
              </span>
              <p className="font-medium text-ink">
                {siteSettings.operating_hours_title || 'Buka Setiap Hari'}: {siteSettings.operating_hours_time || '08:00 - 22:00 WITA'}
              </p>
              <p className="text-ink/70 font-light">
                {siteSettings.operating_hours_note || 'Pemesanan & konsultasi via WhatsApp dilayani 24/7.'}
              </p>
            </div>
          </div>

          {/* col-7: form di atas bg-foam p-8 (Label, Input, Textarea, Button) */}
          <div className="lg:col-span-7">
            <ContactForm whatsappNumber={siteSettings.contact_whatsapp} />
          </div>
        </div>

        {/* 2. MAP SECTION (DESIGN.md v2)
            AspectRatio 16/9, iframe, border border-line */}
        <div className="pt-12 border-t border-line" id="map-section">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs uppercase tracking-widest font-mono text-ocean mb-1">
                // PETA LOKASI
              </p>
              <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-ink flex items-center gap-2">
                <MapPin className="size-5 text-ocean" strokeWidth={1.5} />
                <span>Titik Operasional Canggu, Bali</span>
              </h2>
            </div>
            <span className="text-[10px] uppercase tracking-widest font-mono border border-line px-3 py-1 bg-foam text-ink">
              Canggu, Badung
            </span>
          </div>

          <AspectRatio ratio={16 / 9} className="border border-line rounded-none overflow-hidden bg-foam">
            <iframe
              title="Peta Lokasi Do'amandeh Tours and Travel"
              src={
                siteSettings.contact_map_url ||
                'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3944.4764835697664!2d115.1328!3d-8.6481!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd23882772e0b51%3A0x6b4f74d08df55222!2sCanggu%2C%20Kuta%20Utara%2C%20Badung%20Regency%2C%20Bali!5e0!3m2!1sen!2sid!4v1700000000000!5m2!1sen!2sid'
              }
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </AspectRatio>
        </div>
      </main>

      <PublicFooter settings={siteSettings} />
    </div>
  );
}
