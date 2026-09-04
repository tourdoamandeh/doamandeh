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
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter">
      <rect x="2" y="2" width="20" height="20"></rect>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
  );
}

function FacebookIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter">
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
    <div className="min-h-screen flex flex-col bg-softyellow text-black font-sans selection:bg-brown selection:text-softyellow">
      <PublicHeader whatsappNumber={siteSettings.contact_whatsapp} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-[11px] uppercase tracking-[0.25em] font-bold text-brown border-2 border-brown bg-softwhite px-5 py-2 inline-block mb-4 rounded-none shadow-none">
            Layanan Pelanggan &amp; Reservasi
          </span>

          <h1 className="text-4xl sm:text-6xl font-light uppercase tracking-tight text-black leading-tight mb-4">
            Hubungi Doamandeh Tours &amp; Travel
          </h1>

          <p className="text-sm sm:text-base text-black/80 leading-relaxed font-light">
            Tim kami siap melayani pertanyaan, bantuan pemesanan, maupun konsultasi rencana perjalanan Anda selama di Bali.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Contact Boxes */}
          <div className="lg:col-span-5 space-y-6">
            {/* Address Card */}
            <div className="rounded-none border-2 border-brown bg-softwhite p-7 space-y-3 shadow-none">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-none bg-brown text-softyellow flex items-center justify-center shadow-none">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-[10px] uppercase tracking-widest font-bold text-brown/70">
                    Alamat Utama
                  </h3>
                  <p className="text-xl font-bold uppercase tracking-wide text-brown">
                    Canggu - Badung, Bali
                  </p>
                </div>
              </div>
              <p className="text-xs text-black/90 leading-relaxed pl-14 font-light">
                {siteSettings.contact_address}
              </p>
            </div>

            {/* WhatsApp Card */}
            <div className="rounded-none border-2 border-brown bg-softwhite p-7 space-y-4 shadow-none">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-none bg-brown text-softyellow flex items-center justify-center shadow-none">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-[10px] uppercase tracking-widest font-bold text-brown/70">
                    Telepon &amp; WhatsApp
                  </h3>
                  <p className="text-xl font-bold uppercase tracking-wide text-brown">
                    Respon Cepat 24/7
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-xs pl-14 font-bold tracking-widest uppercase">
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3.5 rounded-none bg-brown text-softyellow hover:bg-black transition-colors shadow-none"
                >
                  <span>WhatsApp: {siteSettings.contact_whatsapp}</span>
                  <Send className="h-4 w-4" />
                </a>

                {siteSettings.contact_whatsapp_2 && (
                  <a
                    href={`https://wa.me/${siteSettings.contact_whatsapp_2.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3.5 rounded-none bg-softyellow text-brown border-2 border-brown hover:bg-white transition-colors shadow-none"
                  >
                    <span>WhatsApp 2: {siteSettings.contact_whatsapp_2}</span>
                    <Send className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>

            {/* Email Card */}
            {siteSettings.contact_email && (
              <div className="rounded-none border-2 border-brown bg-softwhite p-7 space-y-3 shadow-none">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-none bg-brown text-softyellow flex items-center justify-center shadow-none">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-[10px] uppercase tracking-widest font-bold text-brown/70">
                      Email Resmi
                    </h3>
                    <a
                      href={`mailto:${siteSettings.contact_email}`}
                      className="text-lg font-bold text-brown underline hover:opacity-75"
                    >
                      {siteSettings.contact_email}
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Hours & Socials Card */}
            <div className="rounded-none border-2 border-brown bg-softwhite p-7 space-y-4 shadow-none">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-none bg-brown text-softyellow flex items-center justify-center shadow-none">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-[10px] uppercase tracking-widest font-bold text-brown/70">
                    {siteSettings.operating_hours_title || 'Jam Operasional Kantor'}
                  </h3>
                  <p className="text-base font-bold uppercase text-brown">
                    {siteSettings.operating_hours_time || 'Senin - Minggu: 08:00 - 22:00 WITA'}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-brown/20 flex items-center gap-3">
                <span className="text-xs uppercase tracking-widest font-bold text-brown">Sosmed:</span>
                {siteSettings.sosmed_instagram && (
                  <a
                    href={siteSettings.sosmed_instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-none bg-brown text-softyellow hover:bg-black transition-colors shadow-none"
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
                    className="p-2.5 rounded-none bg-brown text-softyellow hover:bg-black transition-colors shadow-none"
                    aria-label="Facebook"
                  >
                    <FacebookIcon className="h-4 w-4" />
                  </a>
                )}
                {siteSettings.sosmed_tiktok && (
                  <a
                    href={siteSettings.sosmed_tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-none bg-brown text-softyellow hover:bg-black transition-colors shadow-none text-xs font-bold"
                    aria-label="TikTok"
                  >
                    TT
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Google Maps & Direct WhatsApp Message Card */}
          <div className="lg:col-span-7 space-y-6">
            {/* Interactive Map Embed */}
            <div className="rounded-none border-2 border-brown bg-softwhite p-5 space-y-3 overflow-hidden shadow-none">
              <div className="flex items-center justify-between px-2 pt-1">
                <h3 className="text-xl font-bold uppercase tracking-wide text-brown flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-brown" />
                  <span>Peta Lokasi Canggu - Bali</span>
                </h3>
                <span className="text-xs uppercase tracking-widest font-bold bg-softyellow border border-brown px-3 py-1 rounded-none shadow-none text-brown">
                  Bali, ID
                </span>
              </div>

              <div className="relative w-full h-[360px] rounded-none overflow-hidden border-2 border-brown shadow-none">
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
            <div className="rounded-none border-2 border-brown bg-brown text-softyellow p-8 sm:p-10 space-y-4 shadow-none">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-none bg-softyellow text-brown flex items-center justify-center shadow-none">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-light uppercase tracking-tight text-softyellow">
                  Konsultasi Langsung via WhatsApp
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-softyellow/80 font-light leading-relaxed">
                Punya pertanyaan mengenai sewa kendaraan, pembuatan tato, reservasi villa, paket perjalanan tour, atau kelas selancar? Klik tombol di bawah untuk tersambung otomatis dengan tim kami.
              </p>

              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-3 rounded-none bg-softyellow text-brown py-4 px-6 text-xs uppercase tracking-widest font-bold hover:bg-white transition-all shadow-none"
              >
                <Phone className="h-4 w-4" />
                <span>Kirim Pesan WhatsApp Sekarang</span>
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </main>

      <PublicFooter settings={siteSettings} />
    </div>
  );
}
