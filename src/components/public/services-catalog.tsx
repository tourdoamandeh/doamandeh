'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Service, ServiceCategory } from '@/types/database';
import { formatRupiah, getServiceImageUrl, getServiceFallbackImage } from '@/lib/constants';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ArrowUpRight, Search, X } from 'lucide-react';
import { SiteSettingsInput } from '@/lib/validations/admin';

interface ServicesCatalogProps {
  services: Service[];
  whatsappNumber?: string;
  settings?: Partial<SiteSettingsInput>;
}

const CATEGORY_TABS: { key: 'all' | ServiceCategory; label: string; num: string }[] = [
  { key: 'all', label: 'Semua', num: 'ALL' },
  { key: 'travel', label: 'Tour & Trip', num: '01' },
  { key: 'vehicle-rental', label: 'Sewa Kendaraan', num: '02' },
  { key: 'villa', label: 'Villa & Stay', num: '03' },
  { key: 'tattoo', label: 'Tato Studio', num: '04' },
  { key: 'surfing-lesson', label: 'Surfing Lesson', num: '05' },
];

function getCategoryLabel(cat: ServiceCategory): string {
  switch (cat) {
    case 'travel':
      return 'Tour & Trip';
    case 'vehicle-rental':
      return 'Sewa Kendaraan';
    case 'villa':
      return 'Villa Stay';
    case 'tattoo':
      return 'Tato Studio';
    case 'surfing-lesson':
      return 'Surfing Lesson';
    default:
      return cat;
  }
}

function CatalogServiceThumbnail({ service }: { service: Service }) {
  const initialUrl = getServiceImageUrl(service);
  const [imgSrc, setImgSrc] = useState(initialUrl);

  return (
    <div className="relative w-20 h-16 sm:w-28 sm:h-20 md:w-32 md:h-20 shrink-0 border border-line bg-foam overflow-hidden rounded-none">
      <Image
        src={imgSrc}
        alt={service.title}
        fill
        sizes="(max-width: 640px) 80px, 130px"
        className="object-cover group-hover:scale-105 transition-transform duration-300"
        onError={() => {
          const fallback = getServiceFallbackImage(service.category);
          if (imgSrc !== fallback) {
            setImgSrc(fallback);
          }
        }}
      />
    </div>
  );
}

const VALID_CATEGORIES: ServiceCategory[] = [
  'travel',
  'vehicle-rental',
  'villa',
  'tattoo',
  'surfing-lesson',
];

export function ServicesCatalog({
  services,
  settings,
}: ServicesCatalogProps) {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category') as ServiceCategory | null;

  const initialCat =
    categoryParam && VALID_CATEGORIES.includes(categoryParam)
      ? categoryParam
      : 'all';

  const [activeCategory, setActiveCategory] = useState<'all' | ServiceCategory>(initialCat);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (categoryParam && VALID_CATEGORIES.includes(categoryParam)) {
      setActiveCategory(categoryParam);
    }
  }, [categoryParam]);

  const pageTagline = settings?.services_page_tagline || '// LAYANAN';
  const pageTitle = settings?.services_page_title || 'Services';
  const pageDesc = settings?.services_page_description || 'Koleksi pengalaman, mobilitas privat, hunian villa, seni tato higienis, dan kelas selancar yang siap diatur untuk liburanmu di Bali.';

  const bannerImg = settings?.services_banner_image || '/assets/hero-bali.jpg';
  const bannerTagline = settings?.services_banner_tagline || '// BALI EXPERIENCES & STAYS';
  const bannerTitle = settings?.services_banner_title || "DO'AMANDEH SERVICES DIRECTORY";
  const bannerSubtitle = settings?.services_banner_subtitle || 'Pilihan lengkap sewa motor & mobil matic, private villa, studio tato higienis, tour Nusa Penida, dan kelas selancar.';

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: services.length };
    for (const s of services) {
      counts[s.category] = (counts[s.category] || 0) + 1;
    }
    return counts;
  }, [services]);

  // Filtered services
  const filteredServices = useMemo(() => {
    return services.filter((s) => {
      const matchCat = activeCategory === 'all' || s.category === activeCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        s.title.toLowerCase().includes(q) ||
        (s.description && s.description.toLowerCase().includes(q)) ||
        s.category.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [services, activeCategory, searchQuery]);

  return (
    <div className="w-full font-sans text-ink">
      {/* 1. HEADER SPLIT (DESIGN.md v2) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pb-12 sm:pb-16 border-b border-line items-end">
        {/* Kiri: Tag // LAYANAN + Judul text-6xl/7xl */}
        <div className="lg:col-span-7">
          <p className="text-xs uppercase tracking-widest font-mono text-ocean mb-3">
            {pageTagline}
          </p>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-medium tracking-tight text-ink leading-[0.95]">
            {pageTitle}
          </h1>
        </div>

        {/* Kanan: Deskripsi singkat + Jumlah layanan angka besar */}
        <div className="lg:col-span-5 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <p className="text-sm sm:text-base text-ink/75 font-light leading-relaxed max-w-sm">
            {pageDesc}
          </p>
          <div className="border-l border-line pl-6 shrink-0">
            <span className="text-5xl sm:text-6xl font-medium text-ink tracking-tight font-mono block leading-none">
              {services.length}
            </span>
            <span className="text-[10px] uppercase tracking-widest text-ink/60 font-mono block mt-2">
              Layanan Aktif
            </span>
          </div>
        </div>
      </div>

      {/* 2. FEATURED SCENERY BANNER */}
      <div className="relative w-full aspect-[21/9] sm:aspect-[24/8] max-h-[280px] my-6 sm:my-8 border border-line rounded-none overflow-hidden bg-foam">
        <Image
          src={bannerImg}
          alt={bannerTitle}
          fill
          priority
          sizes="(max-width: 1400px) 100vw, 1400px"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/25 to-transparent flex items-end justify-between p-4 sm:p-6 text-paper">
          <div>
            <span className="text-[10px] sm:text-xs uppercase tracking-widest font-mono text-sun block mb-1">
              {bannerTagline}
            </span>
            <p className="text-xs sm:text-sm md:text-base font-light tracking-tight text-paper/90 max-w-xl">
              {bannerSubtitle}
            </p>
          </div>
          <span className="hidden sm:inline-block font-mono text-[10px] tracking-widest uppercase text-paper/70">
            {bannerTitle}
          </span>
        </div>
      </div>

      {/* 3. FILTER & SEARCH BAR */}
      <div className="py-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-line">
        {/* Filter Categories Ribbon */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {CATEGORY_TABS.map((tab) => {
            const isActive = activeCategory === tab.key;
            const count = categoryCounts[tab.key] || 0;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveCategory(tab.key)}
                className={`px-3.5 py-2 text-xs uppercase tracking-widest font-medium transition-colors border rounded-none shrink-0 flex items-center gap-2 ${
                  isActive
                    ? 'bg-ink text-paper border-ink'
                    : 'bg-foam text-ink border-line hover:bg-sun hover:border-line'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[10px] font-mono ${isActive ? 'text-paper/60' : 'text-ink/50'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Box */}
        <div className="relative w-full md:w-72 shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-ink/40 pointer-events-none" strokeWidth={1.5} />
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari layanan..."
            className="pl-9 pr-8 py-2 text-xs rounded-none border-line bg-foam text-ink placeholder:text-ink/40 shadow-none focus-visible:ring-1 focus-visible:ring-ocean"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink"
              aria-label="Hapus pencarian"
            >
              <X className="size-3.5" strokeWidth={1.5} />
            </button>
          )}
        </div>
      </div>

      {/* 4. DAFTAR LAYANAN = ROW EDITORIAL FULL-WIDTH (DESIGN.md v2) */}
      {filteredServices.length === 0 ? (
        <div className="py-24 text-center border-b border-line bg-foam/40 px-6">
          <p className="text-xs uppercase tracking-widest text-ink/50 font-mono mb-2">
            // TIDAK ADA HASIL
          </p>
          <p className="text-lg font-medium text-ink mb-4">
            Tidak menemukan layanan untuk pencarian &quot;{searchQuery}&quot;
          </p>
          <button
            type="button"
            onClick={() => {
              setActiveCategory('all');
              setSearchQuery('');
            }}
            className="px-4 py-2 bg-ink text-paper text-xs uppercase tracking-widest font-medium hover:bg-ocean transition-colors rounded-none"
          >
            Reset Filter
          </button>
        </div>
      ) : (
        <div className="divide-y divide-line border-b border-line">
          {filteredServices.map((service, index) => (
            <Link
              key={service.id}
              href={`/services/${service.id}`}
              className="group flex flex-col md:flex-row md:items-center justify-between gap-4 py-6 sm:py-7 px-4 sm:px-6 transition-colors duration-150 hover:bg-sun cursor-pointer"
            >
              {/* [01] [Thumbnail Foto] [Nama Layanan Besar + Badge Category] */}
              <div className="flex items-center sm:items-start gap-4 sm:gap-6 flex-1 min-w-0">
                <span className="font-mono text-xs sm:text-sm text-ink/40 group-hover:text-ink transition-colors shrink-0 pt-1">
                  {String(index + 1).padStart(2, '0')}
                </span>

                {/* Thumbnail Foto Layanan */}
                <CatalogServiceThumbnail service={service} />

                <div className="flex-1 min-w-0">
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-medium tracking-tight text-ink leading-tight group-hover:text-ink">
                    {service.title}
                  </h2>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 mt-2">
                    <Badge
                      variant="outline"
                      className="rounded-none border-line bg-foam text-ink text-[10px] uppercase tracking-widest font-mono group-hover:bg-paper"
                    >
                      {getCategoryLabel(service.category)}
                    </Badge>
                    {service.duration && (
                      <span className="text-[11px] text-ink/60 font-mono">
                        // {service.duration}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* [Deskripsi 1 baris] */}
              {service.description && (
                <p className="hidden lg:block text-xs sm:text-sm text-ink/70 font-light truncate max-w-xs xl:max-w-sm px-4">
                  {service.description}
                </p>
              )}

              {/* [from Rp X] [ArrowUpRight] */}
              <div className="flex items-center justify-between md:justify-end gap-6 shrink-0 mt-2 md:mt-0 pt-3 md:pt-0 border-t md:border-t-0 border-line/40">
                <div className="text-left md:text-right">
                  <span className="text-[10px] uppercase tracking-widest text-ink/50 block font-mono">
                    FROM
                  </span>
                  <span className="text-lg sm:text-xl font-medium text-ink font-mono tracking-tight">
                    {formatRupiah(service.price)}
                  </span>
                  {service.unit && (
                    <span className="text-xs text-ink/60 font-light"> / {service.unit}</span>
                  )}
                </div>

                <div className="size-11 border border-line flex items-center justify-center bg-paper text-ink group-hover:bg-ink group-hover:text-paper group-hover:border-ink transition-colors shrink-0">
                  <ArrowUpRight
                    className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    strokeWidth={1.5}
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* 4. FOOTER NOTE */}
      <div className="pt-8 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-light text-ink/60">
        <p>
          Menampilkan <span className="font-medium text-ink">{filteredServices.length}</span> dari {services.length} layanan yang tersedia.
        </p>
        <p className="text-[11px] uppercase tracking-wider font-mono">
          Semua harga sudah termasuk pajak &amp; layanan operasional.
        </p>
      </div>
    </div>
  );
}
