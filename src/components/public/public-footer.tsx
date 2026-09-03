import Link from 'next/link';
import { Phone, Mail, MapPin, Heart, ArrowUpRight } from 'lucide-react';
import { SiteSettingsInput, DEFAULT_SITE_SETTINGS } from '@/lib/validations/admin';

const CATEGORIES = [
  { slug: 'vehicle-rental', label: 'Sewa Kendaraan', num: '01' },
  { slug: 'tattoo', label: 'Tato Studio', num: '02' },
  { slug: 'villa', label: 'Villa & Stay', num: '03' },
  { slug: 'travel', label: 'Paket Wisata', num: '04' },
  { slug: 'surfing-lesson', label: 'Surfing Lesson', num: '05' },
];

interface PublicFooterProps {
  settings?: Partial<SiteSettingsInput>;
}

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

export function PublicFooter({ settings }: PublicFooterProps) {
  const currentSettings = { ...DEFAULT_SITE_SETTINGS, ...settings };
  const cleanWaNumber = (currentSettings.contact_whatsapp || '+62 812-3456-7890').replace(/[^0-9]/g, '');
  const waUrl = `https://wa.me/${cleanWaNumber}?text=${encodeURIComponent(
    'Halo Doamandeh, saya ingin konsultasi layanan wisata.'
  )}`;

  return (
    <footer className="bg-white text-[#131718] font-sans border-t border-[#131718]">
      <div className="max-w-[1400px] mx-auto">

        {/* Main Footer Grid without Grid Line Dividers */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 p-8 lg:p-12 border-b border-[#131718]/15">

          {/* 1. Brand & Description */}
          <div className="flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-14 w-14 bg-[#131718] text-white flex items-center justify-center text-3xl font-light tracking-tighter">
                  D.
                </div>
                <div>
                  <span className="text-xl uppercase tracking-widest font-bold block leading-none">
                    Doamandeh
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#131718]/60 block mt-1.5">
                    Tours &amp; Travel Bali
                  </span>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-[#131718]/80 font-light pr-4">
                Partner liburan dan lifestyle eksklusif di Bali. Menyediakan sewa motor, mobil, studio tato higienis, villa estetik, paket tour seru, dan kelas selancar.
              </p>
            </div>

            {/* Social Media Links (Square) */}
            <div className="flex items-center gap-3 mt-8">
              {currentSettings.sosmed_instagram && (
                <a
                  href={currentSettings.sosmed_instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-11 w-11 border border-[#131718] flex items-center justify-center hover:bg-[#131718] hover:text-white transition-colors"
                  aria-label="Instagram Doamandeh"
                >
                  <InstagramIcon className="h-5 w-5" />
                </a>
              )}
              {currentSettings.sosmed_facebook && (
                <a
                  href={currentSettings.sosmed_facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-11 w-11 border border-[#131718] flex items-center justify-center hover:bg-[#131718] hover:text-white transition-colors"
                  aria-label="Facebook Doamandeh"
                >
                  <FacebookIcon className="h-5 w-5" />
                </a>
              )}
            </div>
          </div>

          {/* 2. Navigation & Services */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest border-b border-[#131718]/15 pb-4 mb-6">
              Layanan &amp; Halaman
            </h4>
            <ul className="space-y-4 text-sm font-light">
              <li>
                <Link href="/" className="flex items-center justify-between text-[#131718]/80 hover:text-[#131718] hover:underline underline-offset-4 decoration-[1.5px]">
                  <span>Beranda</span>
                  <ArrowUpRight className="h-3 w-3 opacity-50" />
                </Link>
              </li>
              <li>
                <Link href="/about" className="flex items-center justify-between text-[#131718]/80 hover:text-[#131718] hover:underline underline-offset-4 decoration-[1.5px]">
                  <span>Tentang Kami</span>
                  <ArrowUpRight className="h-3 w-3 opacity-50" />
                </Link>
              </li>
              <li>
                <Link href="/contact" className="flex items-center justify-between text-[#131718]/80 hover:text-[#131718] hover:underline underline-offset-4 decoration-[1.5px]">
                  <span>Hubungi Kami</span>
                  <ArrowUpRight className="h-3 w-3 opacity-50" />
                </Link>
              </li>

              <li className="pt-4 pb-1">
                <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-[#131718]/50">
                  Kategori
                </span>
              </li>

              {CATEGORIES.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/category/${cat.slug}`}
                    className="flex items-center justify-between text-[#131718]/80 hover:text-[#131718] hover:underline underline-offset-4 decoration-[1.5px]"
                  >
                    <span>{cat.label}</span>
                    <span className="text-[10px] uppercase tracking-widest opacity-50">{cat.num}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Contact Information */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest border-b border-[#131718]/15 pb-4 mb-6">
              Kontak &amp; Reservasi
            </h4>
            <ul className="space-y-5 text-sm font-light">
              <li className="flex items-start gap-4">
                <MapPin className="h-4 w-4 shrink-0 mt-0.5 opacity-70 stroke-[1.5]" />
                <span className="leading-relaxed text-[#131718]/80">{currentSettings.contact_address}</span>
              </li>
              <li className="flex items-center gap-4">
                <Phone className="h-4 w-4 shrink-0 opacity-70 stroke-[1.5]" />
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-[#131718] hover:underline underline-offset-4 decoration-[1.5px]"
                >
                  {currentSettings.contact_whatsapp}
                </a>
              </li>
              {currentSettings.contact_email && (
                <li className="flex items-center gap-4">
                  <Mail className="h-4 w-4 shrink-0 opacity-70 stroke-[1.5]" />
                  <a
                    href={`mailto:${currentSettings.contact_email}`}
                    className="hover:underline underline-offset-4 decoration-[1.5px] text-[#131718]/80"
                  >
                    {currentSettings.contact_email}
                  </a>
                </li>
              )}
            </ul>
          </div>

          {/* 4. Business Hours & Admin */}
          <div className="flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest border-b border-[#131718]/15 pb-4 mb-6">
                Jam Operasional
              </h4>

              {/* Box Flat warna Cokelat Dark #504139 ala Bento Box/Editorial */}
              <div className="bg-[#504139] text-[#FFF6C6] p-6 space-y-2 shadow-sm">
                <p className="text-lg font-bold tracking-tight uppercase text-[#FFF6C6]">
                  Buka Setiap Hari
                </p>
                <p className="text-sm text-white/80 font-light">08:00 - 22:00 WITA</p>
                <div className="w-full h-[1px] bg-white/15 my-3"></div>
                <p className="text-[10px] uppercase tracking-widest font-medium text-[#FEC29F] flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#FEC29F] block"></span>
                  Reservasi Server 24/7
                </p>
              </div>
            </div>

            <div className="mt-8 lg:mt-0">
              <Link
                href="/admin/login"
                className="inline-flex items-center justify-between w-full border border-[#131718]/30 bg-transparent text-[#131718] px-6 py-4 hover:bg-[#131718] hover:text-[#FFFFFF] transition-colors uppercase text-[10px] tracking-widest font-bold group"
              >
                <span>Portal Administrator</span>
                <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          </div>

        </div>

        {/* Bottom Copyright Bar */}
        <div className="p-6 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] uppercase tracking-widest font-medium text-[#131718]/50">
          <p>© {new Date().getFullYear()} DOAMANDEH TOURS AND TRAVEL.</p>
          <p className="flex items-center gap-2">
            DESIGNED WITH <Heart className="h-3 w-3 text-[#131718] fill-[#131718]" /> FOR BALI
          </p>
        </div>

      </div>
    </footer>
  );
}