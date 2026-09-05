'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Phone, Mail, MapPin, Heart, ArrowUpRight } from 'lucide-react';
import { SiteSettingsInput, DEFAULT_SITE_SETTINGS } from '@/lib/validations/admin';
import { BackToTop } from './back-to-top';

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

function TikTokIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.85.12V9.41a6.33 6.33 0 0 0-.85-.06 6.33 6.33 0 0 0-6.34 6.34 6.33 6.33 0 0 0 6.34 6.34 6.33 6.33 0 0 0 6.33-6.34V8.75a8.28 8.28 0 0 0 4.84 1.55V6.85a4.85 4.85 0 0 1-1.06-.16z" />
    </svg>
  );
}

function YoutubeIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

export function PublicFooter({ settings }: PublicFooterProps) {
  const pathname = usePathname();
  const currentSettings = { ...DEFAULT_SITE_SETTINGS, ...settings };
  const cleanWaNumber = (currentSettings.contact_whatsapp || '+62 812-3456-7890').replace(/[^0-9]/g, '');
  const waUrl = `https://wa.me/${cleanWaNumber}?text=${encodeURIComponent(
    "Halo Do'amandeh, saya ingin konsultasi layanan wisata."
  )}`;

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    document.body.style.overflow = '';
    if (href.startsWith('/#') || href.startsWith('#')) {
      const targetId = href.replace(/^\/?#/, '');
      if (pathname === '/') {
        e.preventDefault();
        const element = document.getElementById(targetId);
        if (element) {
          const y = element.getBoundingClientRect().top + window.scrollY - 30;
          window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
        }
      } else {
        sessionStorage.setItem('scroll_target', targetId);
      }
    }
  };

  return (
    <footer className="bg-ink text-paper font-sans border-t border-line">
      <div className="max-w-[1400px] mx-auto">

        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 p-8 sm:p-12 lg:p-16 border-b border-line/20">

          {/* 1. Brand & Description */}
          <div className="flex flex-col justify-between h-full">
            <div>
              <div className="mb-6">
                <span className="text-2xl uppercase tracking-widest font-bold block leading-none text-paper">
                  {currentSettings.brand_name || "Do'amandeh"}
                </span>
                <span className="text-[10px] uppercase tracking-[0.25em] text-paper/60 block mt-2">
                  {currentSettings.brand_tagline || 'Tours & Travel Bali'}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-paper/80 font-light pr-4">
                {currentSettings.footer_brand_desc || 'Partner liburan dan lifestyle eksklusif di Bali. Menyediakan sewa motor, mobil, studio tato higienis, villa estetik, paket tour seru, dan kelas selancar.'}
              </p>
            </div>

            {/* Social Media Links (Square) */}
            <div className="flex items-center gap-3 mt-8">
              {currentSettings.sosmed_instagram && (
                <a
                  href={currentSettings.sosmed_instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="size-10 border border-line/40 text-paper flex items-center justify-center hover:bg-sun hover:text-ink transition-colors rounded-none"
                  aria-label="Instagram Do'amandeh"
                >
                  <InstagramIcon className="size-4" />
                </a>
              )}
              {currentSettings.sosmed_facebook && (
                <a
                  href={currentSettings.sosmed_facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="size-10 border border-line/40 text-paper flex items-center justify-center hover:bg-sun hover:text-ink transition-colors rounded-none"
                  aria-label="Facebook Do'amandeh"
                >
                  <FacebookIcon className="size-4" />
                </a>
              )}
              {currentSettings.sosmed_tiktok && (
                <a
                  href={currentSettings.sosmed_tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="size-10 border border-line/40 text-paper flex items-center justify-center hover:bg-sun hover:text-ink transition-colors rounded-none"
                  aria-label="TikTok Do'amandeh"
                >
                  <TikTokIcon className="size-4" />
                </a>
              )}
              {currentSettings.sosmed_youtube && (
                <a
                  href={currentSettings.sosmed_youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="size-10 border border-line/40 text-paper flex items-center justify-center hover:bg-sun hover:text-ink transition-colors rounded-none"
                  aria-label="YouTube Do'amandeh"
                >
                  <YoutubeIcon className="size-4" />
                </a>
              )}
            </div>
          </div>

          {/* 2. Navigation & Services */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest border-b border-line/20 pb-4 mb-6 text-paper">
              Layanan &amp; Halaman
            </h4>
            <ul className="space-y-4 text-sm font-light">
              {[
                { href: '/', label: 'Beranda' },
                { href: '/#about', label: 'Tentang Kami' },
                { href: '/services', label: 'Katalog Layanan' },
                { href: '/#testimonials', label: 'Ulasan & Testimoni' },
                { href: '/#faq', label: 'Tanya Jawab (FAQ)' },
                { href: '/contact', label: 'Hubungi Kami' },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className="flex items-center justify-between text-paper/80 hover:text-sun hover:underline underline-offset-4 decoration-1"
                  >
                    <span>{item.label}</span>
                    <ArrowUpRight className="size-3 opacity-50" strokeWidth={1.5} />
                  </Link>
                </li>
              ))}

              <li className="pt-4 pb-1">
                <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-paper/50">
                  Kategori
                </span>
              </li>

              {CATEGORIES.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/services?category=${cat.slug}`}
                    className="flex items-center justify-between text-paper/80 hover:text-sun hover:underline underline-offset-4 decoration-1"
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
            <h4 className="text-xs font-bold uppercase tracking-widest border-b border-line/20 pb-4 mb-6 text-paper">
              Kontak &amp; Reservasi
            </h4>
            <ul className="space-y-5 text-sm font-light">
              <li className="flex items-start gap-4">
                <MapPin className="size-4 shrink-0 mt-0.5 opacity-70" strokeWidth={1.5} />
                <span className="leading-relaxed text-paper/80">{currentSettings.contact_address}</span>
              </li>
              <li className="flex items-center gap-4">
                <Phone className="size-4 shrink-0 opacity-70" strokeWidth={1.5} />
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-paper hover:text-sun hover:underline underline-offset-4 decoration-1"
                >
                  {currentSettings.contact_whatsapp}
                </a>
              </li>
              {currentSettings.contact_email && (
                <li className="flex items-center gap-4">
                  <Mail className="size-4 shrink-0 opacity-70" strokeWidth={1.5} />
                  <a
                    href={`mailto:${currentSettings.contact_email}`}
                    className="hover:underline underline-offset-4 decoration-1 text-paper/80 hover:text-sun"
                  >
                    {currentSettings.contact_email}
                  </a>
                </li>
              )}
            </ul>
          </div>

          {/* 4. Business Hours */}
          <div className="flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest border-b border-line/20 pb-4 mb-6 text-paper">
                Jam Operasional
              </h4>

              {/* Box Flat Krem Kontras Terang */}
              <div className="bg-foam text-ink p-6 space-y-2 shadow-none rounded-none border border-line">
                <p className="text-lg font-medium tracking-tight uppercase text-ink">
                  {currentSettings.operating_hours_title || 'Buka Setiap Hari'}
                </p>
                <p className="text-sm text-ink/80 font-light">{currentSettings.operating_hours_time || '08:00 - 22:00 WITA'}</p>
                <div className="w-full h-px bg-line my-3"></div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-ocean flex items-center gap-2">
                  <span className="size-1.5 bg-ocean block"></span>
                  {currentSettings.operating_hours_note || 'Reservasi Server 24/7'}
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Copyright Bar */}
        <div className="p-6 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] uppercase tracking-widest font-medium text-paper/50">
          <p>© {new Date().getFullYear()} DO&apos;AMANDEH TOURS AND TRAVEL.</p>
          <p className="flex items-center gap-2">
            DESIGNED WITH <Heart className="size-3 text-sun fill-sun" strokeWidth={1.5} /> FOR BALI
          </p>
        </div>

      </div>
      <BackToTop />
    </footer>
  );
}