'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Plus, Minus } from 'lucide-react';
import { FadeIn } from '@/components/ui/fade-in';

interface FaqItem {
  num: string;
  question: string;
  answer: string;
}

const DEFAULT_FAQ_DATA: FaqItem[] = [
  {
    num: '01',
    question: "Gimana Cara Booking Layanan Do'amandeh?",
    answer: "Gampang banget! Kamu bisa langsung pilih layanan di website ini dan klik tombol pesan, atau langsung chat admin kami via WhatsApp. Nanti tim Do'amandeh bakal secepatnya konfirmasi jadwal buat kamu.",
  },
  {
    num: '02',
    question: 'Apa Saja Syarat Sewa Motor Atau Mobil? ',
    answer: "Cukup siapkan identitas asli (KTP atau Paspor) dan SIM yang masih aktif (SIM C buat motor, SIM A buat mobil). Asyiknya lagi, Do'amandeh kasih gratis antar-jemput kendaraan langsung ke hotelmu untuk area tertentu lho!",
  },
  {
    num: '03',
    question: 'Studio Tattonya Aman Dan Steril Kan?',
    answer: "Pasti dong! Keamananmu itu nomor satu buat kami. Do'amandeh pakai jarum dan alat sekali pakai (single-use) yang dibuka langsung di depanmu, tinta impor standar medis, plus studionya selalu rutin didisinfeksi.",
  },
  {
    num: '04',
    question: 'Sewa Villa Sudah Termasuk Bersih-Bersih?',
    answer: "Sudah all-in! Nginep di villa Do'amandeh udah pasti dapet private pool, WiFi kenceng, AC, alat mandi, sampai layanan bersih-bersih tiap hari (daily housekeeping). Kamu tinggal santai aja tanpa ada biaya tambahan.",
  },
  {
    num: '05',
    question: 'Belum Pernah Surfing, Bisa Ikut Kelasnya?',
    answer: "Bisa banget! Instruktur selancar Do'amandeh udah terbiasa dan sabar banget ngajarin pemula. Awalnya kita akan latihan santai di air dangkal dulu dengan pengawasan 1-on-1, jadi dijamin aman dan fun.",
  },
];

const DEFAULT_FAQ_IMAGE = '/assets/hero-bali.jpg';

interface FaqSectionProps {
  faqTitle?: string;
  faqSubtitle?: string;
  faqJson?: string;
  faqImage?: string;
}

export function FaqSection({
  faqTitle = 'Jawaban untuk \nsetiap pertanyaanmu.',
  faqSubtitle = 'Jawaban jelas mengenai proses pemesanan, fasilitas layanan, jadwal, dan semua kebutuhan perjalanan Anda di Bali.',
  faqJson,
  faqImage,
}: FaqSectionProps = {}) {
  let list: FaqItem[] = DEFAULT_FAQ_DATA;
  if (faqJson) {
    try {
      const parsed = JSON.parse(faqJson);
      if (Array.isArray(parsed) && parsed.length > 0) {
        list = parsed;
      }
    } catch {
      // fallback to DEFAULT_FAQ_DATA
    }
  }

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="relative w-full bg-brown text-softyellow font-sans overflow-hidden scroll-mt-16 sm:scroll-mt-20">

      {/* 1. TAMPILAN MOBILE */}
      <div className="block md:hidden px-6 py-10 text-softyellow">
        {/* Header Row: Title & Top Right Thumbnail Image */}
        <div className="flex items-end justify-between gap-4 mb-8">
          <h2 className="text-2xl sm:text-3xl font-medium leading-[1.15] tracking-tight text-softyellow max-w-[62%] whitespace-pre-line">
            {faqTitle}
          </h2>
          <div className="relative w-28 h-36 shrink-0 overflow-hidden border border-line rounded-none">
            <Image
              src={faqImage || DEFAULT_FAQ_IMAGE}
              alt="Alam & Budaya Bali"
              fill
              priority
              sizes="120px"
              className="object-cover"
            />
          </div>
        </div>

        {/* Garis Pembatas */}
        <div className="w-full border-t border-white/20 mb-6"></div>

        {/* Daftar Accordion FAQ Mobile */}
        <div className="w-full">
          {list.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={index} className="border-b border-white/20">
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between py-4 focus:outline-none text-left group cursor-pointer"
                >
                  <h3 className="text-xs sm:text-sm font-medium tracking-wider pr-4 text-softyellow">
                    {faq.num || `0${index + 1}`}. {faq.question}
                  </h3>
                  <div className="shrink-0 text-softyellow">
                    {isOpen ? (
                      <Minus className="w-4 h-4" strokeWidth={1.5} />
                    ) : (
                      <Plus className="w-4 h-4" strokeWidth={1.5} />
                    )}
                  </div>
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? 'max-h-40 opacity-100 pb-5' : 'max-h-0 opacity-0 pb-0'
                  }`}
                >
                  <p className="text-xs sm:text-sm text-softyellow/80 leading-relaxed font-light pr-4">
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. TAMPILAN DESKTOP: 2-Kolom Split */}
      <div className="hidden md:grid md:grid-cols-2 items-stretch min-h-[100dvh]">

        {/* Kolom Kiri: Teks & FAQ Accordion */}
        <FadeIn direction="up" className="flex flex-col justify-center p-12 lg:p-20">

          {/* Header Judul Desktop */}
          <div className="mb-12 lg:mb-16">
            <h2 className="text-4xl lg:text-5xl font-medium leading-[1.1] tracking-tight text-softyellow mb-4 whitespace-pre-line">
              {faqTitle}
            </h2>
            <p className="text-sm leading-relaxed text-softyellow/80 font-light max-w-md">
              {faqSubtitle}
            </p>
          </div>

          {/* Garis Pembatas */}
          <div className="w-full border-t border-white/20 mb-6 md:mb-8"></div>

          {/* Daftar Accordion FAQ Desktop */}
          <div className="w-full">
            {list.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div key={index} className="border-b border-white/20">
                  <button
                    type="button"
                    onClick={() => toggleFaq(index)}
                    className="w-full flex items-center justify-between py-4 sm:py-5 focus:outline-none text-left group cursor-pointer"
                  >
                    <h3 className="text-xs sm:text-sm font-medium tracking-wider pr-6 text-softyellow group-hover:opacity-80 transition-opacity">
                      {faq.num || `0${index + 1}`}. {faq.question}
                    </h3>
                    <div className="shrink-0 text-softyellow">
                      {isOpen ? (
                        <Minus className="w-4 h-4" strokeWidth={1.5} />
                      ) : (
                        <Plus className="w-4 h-4" strokeWidth={1.5} />
                      )}
                    </div>
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      isOpen ? 'max-h-40 opacity-100 pb-5' : 'max-h-0 opacity-0 pb-0'
                    }`}
                  >
                    <p className="text-xs sm:text-sm text-softyellow/80 leading-relaxed font-light pr-6">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </FadeIn>

        {/* Kolom Kanan: Foto Full-Height Desktop (Border 1px border-line DESIGN.md v2) */}
        <div className="relative w-full h-full min-h-[100dvh] overflow-hidden border-l border-line">
          <Image
            src={faqImage || DEFAULT_FAQ_IMAGE}
            alt="Tarian Kecak & Alam Bali"
            fill
            sizes="50vw"
            priority
            className="object-cover object-top"
          />
        </div>

      </div>
    </section>
  );
}