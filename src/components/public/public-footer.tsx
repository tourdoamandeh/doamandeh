import Link from 'next/link';
import { Phone, Mail, MapPin, Sparkles, Heart } from 'lucide-react';

const CATEGORIES = [
  { slug: 'vehicle-rental', label: 'Sewa Kendaraan (Motor & Mobil)' },
  { slug: 'tattoo', label: 'Tato Studio & Artist' },
  { slug: 'villa', label: 'Villa & Vacation Stay' },
  { slug: 'travel', label: 'Paket Wisata & Tour Bali' },
  { slug: 'surfing-lesson', label: 'Surfing Lesson Pemula & Lanjutan' },
];

export function PublicFooter() {
  return (
    <footer className="border-t border-zinc-900 bg-zinc-950 text-zinc-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand & Tagline */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-black font-black text-xl shadow-lg shadow-amber-500/20">
                D
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight text-white">Doamandeh</span>
                <p className="text-[10px] text-zinc-400 font-medium">Tours & Travel</p>
              </div>
            </div>
            <p className="text-xs leading-relaxed text-zinc-400">
              Partner liburan dan perjalanan terpercaya di Bali. Menyediakan sewa motor, mobil, tato profesional, villa eksklusif, paket tour seru, dan kelas selancar.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-medium bg-amber-500/10 text-amber-300 border border-amber-500/20">
              <Sparkles className="h-3 w-3 text-amber-400" />
              <span>Layanan Ramah & Berpengalaman</span>
            </div>
          </div>

          {/* Quick Category Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Layanan Kami
            </h4>
            <ul className="space-y-2 text-xs">
              {CATEGORIES.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/category/${cat.slug}`}
                    className="hover:text-amber-400 transition-colors"
                  >
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Kontak & Reservasi
            </h4>
            <ul className="space-y-3 text-xs">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Bali, Indonesia (Melayani seluruh area wisata utama)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-emerald-400 shrink-0" />
                <a
                  href="https://wa.me/6281234567890"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline text-emerald-400"
                >
                  +62 812-3456-7890 (WhatsApp)
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-amber-400 shrink-0" />
                <a
                  href="mailto:info@doamandeh.com"
                  className="hover:underline hover:text-white"
                >
                  info@doamandeh.com
                </a>
              </li>
            </ul>
          </div>

          {/* Business Hours & Admin Access */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Jam Operasional
            </h4>
            <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-4 space-y-2 text-xs">
              <p className="text-zinc-300 font-semibold">Buka Setiap Hari</p>
              <p className="text-[11px] text-zinc-400">08:00 - 22:00 WITA</p>
              <p className="text-[10px] text-amber-400/90 pt-1">
                Layanan booking online 24/7
              </p>
            </div>
            <div className="mt-4">
              <Link
                href="/admin/login"
                className="inline-block text-[11px] text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                → Login Portal Staf / Admin
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} Doamandeh Tours and Travel. Hak Cipta Dilindungi.</p>
          <p className="flex items-center gap-1">
            Dibuat dengan <Heart className="h-3 w-3 text-red-500 fill-red-500" /> untuk kenyamanan liburan Anda
          </p>
        </div>
      </div>
    </footer>
  );
}
