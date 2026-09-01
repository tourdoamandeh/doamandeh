'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  Car,
  Palette,
  Home,
  Compass,
  Waves,
  Menu,
  X,
  Phone,
  Shield,
  ChevronDown,
} from 'lucide-react';

const CATEGORIES = [
  { slug: 'vehicle-rental', label: 'Sewa Kendaraan', icon: Car },
  { slug: 'tattoo', label: 'Tato Studio', icon: Palette },
  { slug: 'villa', label: 'Villa & Stay', icon: Home },
  { slug: 'travel', label: 'Paket Travel', icon: Compass },
  { slug: 'surfing-lesson', label: 'Surfing Lesson', icon: Waves },
];

export function PublicHeader() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-black font-black text-xl shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              D
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-white group-hover:text-amber-400 transition-colors">
                Doamandeh
              </span>
              <p className="text-[10px] text-zinc-400 -mt-1 font-medium">Tours & Travel</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/"
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                pathname === '/'
                  ? 'bg-zinc-900 text-amber-400 border border-zinc-800'
                  : 'text-zinc-300 hover:text-white hover:bg-zinc-900/60'
              }`}
            >
              Beranda
            </Link>

            {/* Categories Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <button
                type="button"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  pathname.startsWith('/category')
                    ? 'bg-zinc-900 text-amber-400 border border-zinc-800'
                    : 'text-zinc-300 hover:text-white hover:bg-zinc-900/60'
                }`}
              >
                <span>Layanan Wisata</span>
                <ChevronDown className="h-3.5 w-3.5 text-zinc-400" />
              </button>

              {dropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-56 rounded-2xl border border-zinc-800 bg-zinc-950/95 p-2 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-150">
                  {CATEGORIES.map((cat) => {
                    const Icon = cat.icon;
                    return (
                      <Link
                        key={cat.slug}
                        href={`/category/${cat.slug}`}
                        onClick={() => setDropdownOpen(false)}
                        className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium transition-colors ${
                          pathname === `/category/${cat.slug}`
                            ? 'bg-amber-500/10 text-amber-400'
                            : 'text-zinc-300 hover:bg-zinc-900 hover:text-white'
                        }`}
                      >
                        <Icon className="h-3.5 w-3.5 text-amber-400" />
                        <span>{cat.label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Direct Category Quick Links for desktop */}
            {CATEGORIES.slice(0, 3).map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className={`hidden lg:inline-flex px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                  pathname === `/category/${cat.slug}`
                    ? 'text-amber-400 font-semibold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {cat.label}
              </Link>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href="https://wa.me/6281234567890?text=Halo%20Doamandeh%20Tours%20and%20Travel,%20saya%20tertarik%20dengan%20layanan%20wisata%20Anda."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-2 text-xs font-semibold text-emerald-400 hover:bg-emerald-500/20 transition-colors shadow-sm"
            >
              <Phone className="h-3.5 w-3.5" />
              <span>WhatsApp Kami</span>
            </a>

            <Link
              href="/admin/login"
              className="flex items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              title="Login Admin"
            >
              <Shield className="h-3.5 w-3.5" />
              <span className="hidden xl:inline">Portal Admin</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-zinc-800 bg-zinc-950 px-4 pt-2 pb-6 space-y-3 animate-in slide-in-from-top-2 duration-150">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`block rounded-xl px-3 py-2 text-sm font-semibold ${
              pathname === '/' ? 'bg-amber-500/10 text-amber-400' : 'text-zinc-300'
            }`}
          >
            Beranda
          </Link>

          <div className="pt-2 border-t border-zinc-800">
            <p className="px-3 text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-2">
              Kategori Layanan
            </p>
            <div className="space-y-1">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                return (
                  <Link
                    key={cat.slug}
                    href={`/category/${cat.slug}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium ${
                      pathname === `/category/${cat.slug}`
                        ? 'bg-amber-500/10 text-amber-400'
                        : 'text-zinc-300 hover:bg-zinc-900'
                    }`}
                  >
                    <Icon className="h-4 w-4 text-amber-400" />
                    <span>{cat.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-zinc-800 space-y-2">
            <a
              href="https://wa.me/6281234567890?text=Halo%20Doamandeh%20Tours%20and%20Travel"
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-600/20"
            >
              <Phone className="h-4 w-4" />
              <span>Hubungi via WhatsApp</span>
            </a>
            <Link
              href="/admin/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-xs font-medium text-zinc-400"
            >
              <Shield className="h-4 w-4" />
              <span>Portal Administrator</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
