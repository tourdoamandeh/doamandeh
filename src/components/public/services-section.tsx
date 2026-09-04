'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Service } from '@/types/database';
import { formatRupiah } from '@/lib/constants';
import Image from 'next/image';
import { FadeIn, FadeInStagger } from '@/components/ui/fade-in';

interface ServicesSectionProps {
  services: Service[];
  servicesTitle?: string;
  servicesSubtitle?: string;
}

export function ServicesSection({
  services,
  servicesTitle = 'Pilih \nPetualanganmu',
  servicesSubtitle = 'Mulai dari kamu mendarat sampai waktunya pulang, biarkan Doamandeh yang urus detailnya. Kami siapkan pilihan aktivitas dan fasilitas terbaik supaya liburanmu di Bali terasa santai, seru, dan pastinya bebas ribet.',
}: ServicesSectionProps) {
  // State untuk melacak item yang sedang di-hover (default null: semua ketutup)
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const categoryConfig = [
    {
      cat: 'travel',
      line1: 'PAKET',
      line2: 'TOUR',
      desc: 'Jelajahi sisi terbaik Bali seharian penuh, tanpa pusing mikirin rute.',
      price: 500000,
      image: '/assets/service-travel.jpg',
    },
    {
      cat: 'villa',
      line1: 'VILLA',
      line2: 'STAY',
      desc: 'Ruang tenang dan estetik untuk bersantai penuh setelah seharian jalan-jalan.',
      price: 1500000,
      image: '/assets/service-villa.jpg',
    },
    {
      cat: 'surfing-lesson',
      line1: 'SURFING',
      line2: 'LESSON',
      desc: 'Taklukkan ombak pertamamu dengan aman bareng instruktur lokal kami.',
      price: 350000,
      image: '/assets/service-surfing.png',
    },
    {
      cat: 'vehicle-rental',
      line1: 'SEWA',
      line2: 'KENDARAAN',
      desc: 'Bebas keliling pulau sesukamu dengan armada yang bersih dan selalu terawat.',
      price: 75000,
      image: '/assets/service-vehicle.jpg',
    },
    {
      cat: 'tattoo',
      line1: 'TATO',
      line2: 'STUDIO',
      desc: 'Abadikan kenangan liburan di Bali dengan karya tato custom steril berstandar higienis.',
      price: 300000,
      image: '/assets/service-tattoo.jpg',
    },
  ];

  const displayServices = categoryConfig.map((item) => {
    const found = services.find((s) => s.category === item.cat);
    return {
      id: found ? found.id : item.cat,
      category: item.cat,
      line1: item.line1,
      line2: item.line2,
      description: item.desc,
      price: (found && found.price) || item.price,
      image_url: item.image,
    };
  });

  return (
    <section
      id="services"
      className="relative bg-brown text-softyellow font-sans py-20 lg:py-28 overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto px-8 sm:px-12 lg:px-16 relative z-10">

        {/* Layout Utama: Kiri (Teks & Tombol) dan Kanan (Grid Sejajar) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">

          {/* Kolom Kiri: Header Section (Sticky hanya di desktop lg:sticky) */}
          <FadeIn direction="up" className="lg:col-span-4 flex flex-col gap-4 sm:gap-6 lg:sticky lg:top-24 mb-6 lg:mb-0">
            <h2 className="text-4xl sm:text-5xl lg:text-[2.7rem] uppercase font-medium leading-[0.95] tracking-tighter text-softyellow whitespace-pre-line">
              {servicesTitle}
            </h2>

            <p className="text-base sm:text-lg md:text-xl leading-relaxed text-softyellow/80 max-w-sm mt-1 sm:mt-2 font-light">
              {servicesSubtitle}
            </p>

            <div className="mt-4 sm:mt-6">
              <Link
                href="/services"
                className="inline-flex items-center gap-3 px-6 sm:px-7 py-3 sm:py-3.5 bg-softyellow text-brown rounded-none hover:bg-softyellow/90 hover:text-brown transition-colors text-[10px] sm:text-xs uppercase tracking-widest font-bold shadow-none border border-softyellow"
              >
                <span>Lihat keseruan lainnya</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </Link>
            </div>
          </FadeIn>

          {/* Kolom Kanan: Grid Sejajar ala Referensi Gambar */}
          <div className="lg:col-span-8">
            <FadeInStagger className="grid grid-cols-2 gap-x-4 sm:gap-x-10 gap-y-8 sm:gap-y-12 items-start">
              {displayServices.map((service) => {
                const isActive = hoveredId === service.category;

                return (
                  <article
                    key={service.id}
                    onMouseEnter={() => setHoveredId(service.category)}
                    onMouseLeave={() => setHoveredId(null)}
                    className="group relative flex flex-col gap-2.5 sm:gap-3 border-t border-white/30 pt-4 sm:pt-6 cursor-pointer"
                  >
                    {/* Header Layanan: Judul 2 Baris & Panah Pojok */}
                    <div className="flex justify-between items-start gap-2 sm:gap-3">
                      <h3 className="text-xl sm:text-3xl md:text-[2.25rem] font-semibold leading-[0.95] tracking-tight uppercase text-softyellow w-4/5">
                        <Link href={`/category/${service.category}`} className="block">
                          <span>{service.line1}</span>
                          <br />
                          <span>{service.line2}</span>
                        </Link>
                      </h3>

                      <Link
                        href={`/category/${service.category}`}
                        className="text-softyellow shrink-0"
                        aria-label={`Detail ${service.line1} ${service.line2}`}
                      >
                        <ArrowUpRight className="w-5 h-5 sm:w-7 sm:h-7 stroke-[2]" />
                      </Link>
                    </div>

                    {/* Deskripsi Singkat */}
                    <p className="text-sm sm:text-base md:text-lg text-softyellow/85 leading-relaxed font-light mt-0.5 sm:mt-1">
                      {service.description}
                    </p>

                    {/* Animasi Turun ke Bawah (Slide-Down Reveal) Foto dari Assets */}
                    <div
                      className={`grid transition-all duration-500 ease-in-out ${isActive
                        ? 'grid-rows-[1fr] opacity-100 mt-2 sm:mt-3'
                        : 'grid-rows-[0fr] opacity-0 mt-0'
                        }`}
                    >
                      <div className="overflow-hidden">
                        <div className="relative w-full aspect-[3/4] max-h-[220px] sm:max-h-[300px] bg-softblue rounded-none overflow-hidden border-2 border-softyellow shadow-none">
                          <Image
                            src={service.image_url}
                            alt={`${service.line1} ${service.line2}`}
                            fill
                            sizes="(max-width: 768px) 50vw, 400px"
                            className="object-cover w-full h-full transition-transform duration-700 hover:scale-105"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Footer Layanan: Harga */}
                    <div className="mt-auto pt-2 sm:pt-3 flex items-baseline gap-1.5 sm:gap-2 text-softyellow">
                      <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-softyellow/70 font-medium">
                        Mulai
                      </span>
                      <span className="text-xs sm:text-base font-semibold tracking-tight text-softyellow">
                        {formatRupiah(service.price)}
                      </span>
                    </div>

                  </article>
                );
              })}
            </FadeInStagger>
          </div>

        </div>
      </div>
    </section>
  );
}