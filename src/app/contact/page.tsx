import type { Metadata } from 'next';
import { getSiteSettingsAction } from '@/lib/actions/admin/settings';
import { DEFAULT_SITE_SETTINGS } from '@/lib/validations/admin';
import { PublicHeader } from '@/components/public/public-header';
import { PublicFooter } from '@/components/public/public-footer';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageSquare,
  Send,
  ArrowUpRight,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Kontak & Lokasi | Doamandeh Tours & Travel Bali',
  description:
    'Hubungi tim Doamandeh Tours and Travel di Bali. Alamat kantor, nomor WhatsApp, email, jam operasional, dan peta lokasi Canggu Badung Bali.',
  openGraph: {
    title: 'Kontak & Lokasi | Doamandeh Tours & Travel',
    description:
      'Layanan reservasi dan konsultasi wisata Bali via WhatsApp, Telepon, dan Email.',
    type: 'website',
  },
};

function InstagramIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
  );
}

function FacebookIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
    </svg>
  );
}

export default async function ContactPage() {
  const settingsResult = await getSiteSettingsAction();
  const siteSettings = settingsResult.success && settingsResult.data
    ? settingsResult.data
    : DEFAULT_SITE_SETTINGS;

  const cleanWa = (siteSettings.contact_whatsapp || '+62 812-3456-7890').replace(/[^0-9]/g, '');
  const waUrl = `https://wa.me/${cleanWa}?text=${encodeURIComponent(
    'Halo Doamandeh Tours and Travel, saya ingin konsultasi via pesan online.'
  )}`;

  return (
    <div className="min-h-screen flex flex-col bg-tissue text-black selection:bg-peach selection:text-black">
      <PublicHeader whatsappNumber={siteSettings.contact_whatsapp} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="font-sans italic text-sm text-black/60 bg-peach px-5 py-2 rounded-full inline-block mb-4 shadow-sm">
            Layanan Pelanggan & Reservasi
          </span>

          <h1 className="font-sans text-4xl sm:text-6xl text-black leading-tight mb-4">
            Hubungi <span className="italic font-normal underline decoration-lightblue">Doamandeh</span> Tours & Travel
          </h1>

          <p className="text-sm sm:text-base text-black/80 leading-relaxed font-sans font-normal">
            Tim kami siap melayani pertanyaan, bantuan pemesanan, maupun konsultasi rencana perjalanan Anda selama di Bali.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Contact Bento Cards */}
          <div className="lg:col-span-5 space-y-6">
            {/* Address Card */}
            <div className="rounded-[28px] border-none bg-lightblue p-7 space-y-3 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-2xl bg-black text-tissue flex items-center justify-center shadow-sm">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-sans italic text-xs text-black/60">
                    Alamat Utama
                  </h3>
                  <p className="font-sans text-2xl text-black">
                    Canggu - Badung, Bali
                  </p>
                </div>
              </div>
              <p className="text-xs text-black/90 font-sans leading-relaxed pl-14">
                {siteSettings.contact_address}
              </p>
            </div>

            {/* WhatsApp Card */}
            <div className="rounded-[28px] border-none bg-peach p-7 space-y-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-2xl bg-black text-tissue flex items-center justify-center shadow-sm">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-sans italic text-xs text-black/60">
                    Telepon & WhatsApp
                  </h3>
                  <p className="font-sans text-2xl text-black">
                    Respon Cepat 24/7
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-xs pl-14 font-sans">
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3.5 rounded-full bg-black text-tissue text-base hover:bg-black/90 transition-colors shadow-sm"
                >
                  <span>WhatsApp: {siteSettings.contact_whatsapp}</span>
                  <Send className="h-4 w-4" />
                </a>

                {siteSettings.contact_whatsapp_2 && (
                  <a
                    href={`https://wa.me/${siteSettings.contact_whatsapp_2.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3.5 rounded-full bg-tissue text-black text-base hover:bg-slate-50 transition-colors shadow-sm"
                  >
                    <span>WhatsApp 2: {siteSettings.contact_whatsapp_2}</span>
                    <Send className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>

            {/* Email Card */}
            {siteSettings.contact_email && (
              <div className="rounded-[28px] border-none bg-yellow p-7 space-y-3 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-2xl bg-black text-tissue flex items-center justify-center shadow-sm">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-sans italic text-xs text-black/60">
                      Email Resmi
                    </h3>
                    <a
                      href={`mailto:${siteSettings.contact_email}`}
                      className="font-sans text-2xl text-black underline hover:opacity-75"
                    >
                      {siteSettings.contact_email}
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Hours & Socials Card */}
            <div className="rounded-[28px] border-none bg-softpink p-7 space-y-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-2xl bg-black text-tissue flex items-center justify-center shadow-sm">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-sans italic text-xs text-black/60">
                    Jam Operasional Kantor
                  </h3>
                  <p className="font-sans text-xl text-black">
                    Senin - Minggu: 08:00 - 22:00 WITA
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-black/15 flex items-center gap-3 font-sans">
                <span className="text-sm text-black">Sosmed:</span>
                {siteSettings.sosmed_instagram && (
                  <a
                    href={siteSettings.sosmed_instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-full bg-black text-tissue hover:bg-tissue hover:text-black transition-colors shadow-sm"
                    aria-label="Instagram"
                  >
                    <InstagramIcon className="h-4 w-4" />
                  </a>
                )}
                {siteSettings.sosmed_facebook && (
                  <a
                    href={siteSettings.sosmed_facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-full bg-black text-tissue hover:bg-tissue hover:text-black transition-colors shadow-sm"
                    aria-label="Facebook"
                  >
                    <FacebookIcon className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Google Maps & Direct WhatsApp Message Card */}
          <div className="lg:col-span-7 space-y-6">
            {/* Interactive Map Embed */}
            <div className="rounded-[32px] border-none bg-tissue p-5 space-y-3 overflow-hidden shadow-md">
              <div className="flex items-center justify-between px-2 pt-1">
                <h3 className="font-sans text-2xl text-black flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-black" />
                  <span>Peta Lokasi Canggu - Bali</span>
                </h3>
                <span className="font-sans text-sm bg-lightblue px-4 py-1 rounded-full shadow-sm">
                  Bali, ID
                </span>
              </div>

              <div className="relative w-full h-[360px] rounded-[24px] overflow-hidden border-none shadow-inner">
                <iframe
                  title="Peta Lokasi Doamandeh Tours and Travel"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3944.4764835697664!2d115.1328!3d-8.6481!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd23882772e0b51%3A0x6b4f74d08df55222!2sCanggu%2C%20Kuta%20Utara%2C%20Badung%20Regency%2C%20Bali!5e0!3m2!1sen!2sid!4v1700000000000!5m2!1sen!2sid"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

            {/* Quick Inquiry Editorial Card */}
            <div className="rounded-[32px] border-none bg-peach p-8 sm:p-10 space-y-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-black text-tissue flex items-center justify-center shadow-sm">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <h3 className="font-sans text-3xl text-black">
                  Konsultasi Langsung via WhatsApp
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-black/90 font-sans leading-relaxed">
                Punya pertanyaan mengenai sewa kendaraan, pembuatan tato, reservasi villa, paket perjalanan tour, atau kelas selancar? Klik tombol di bawah untuk tersambung otomatis dengan tim kami.
              </p>

              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-3 rounded-full bg-black text-tissue py-4 px-6 font-sans text-xl hover:bg-black/90 transition-all shadow-sm"
              >
                <Phone className="h-5 w-5" />
                <span>Kirim Pesan WhatsApp Sekarang</span>
                <ArrowUpRight className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </main>

      <PublicFooter settings={siteSettings} />
    </div>
  );
}
