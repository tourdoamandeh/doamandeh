'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Plus, Minus } from 'lucide-react';

interface FaqItem {
  num: string;
  question: string;
  answer: string;
}

const FAQ_DATA: FaqItem[] = [
  {
    num: '01',
    question: 'BAGAIMANA CARA MELAKUKAN PEMESANAN?',
    answer: 'Pemesanan dapat dilakukan langsung melalui website dengan memilih layanan yang diinginkan atau melalui tombol WhatsApp. Tim customer service kami akan segera memverifikasi ketersediaan dan mengirimkan konfirmasi.',
  },
  {
    num: '02',
    question: 'APA PERSYARATAN SEWA KENDARAAN?',
    answer: 'Untuk menyewa motor/mobil, Anda perlu menyiapkan identitas diri asli (KTP/Paspor) serta SIM C (untuk motor) atau SIM A (untuk mobil). Kami menyediakan layanan gratis antar-jemput unit ke hotel area tertentu.',
  },
  {
    num: '03',
    question: 'BAGAIMANA STANDAR STERILITAS TATO?',
    answer: 'Kami menggunakan 100% jarum dan perlengkapan single-use steril yang dibuka di depan pelanggan, tinta impor bersertifikat medis, serta mesin dan area studio yang didisinfeksi secara menyeluruh.',
  },
  {
    num: '04',
    question: 'APAKAH VILLA TERMASUK HOUSEKEEPING?',
    answer: 'Ya, semua villa sudah dilengkapi fasilitas private pool, WiFi, AC, perlengkapan mandi, dan layanan pembersihan harian (daily housekeeping) tanpa biaya tambahan apapun.',
  },
  {
    num: '05',
    question: 'BISAKAH PEMULA IKUT SURFING LESSON?',
    answer: 'Tentu. Instruktur bersertifikat kami sangat berpengalaman mendampingi pemula. Sesi latihan awal akan dilakukan di area dangkal dengan pengawasan penuh 1-on-1.',
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-white text-[#131718] font-sans min-h-[100dvh] flex items-center py-16 lg:py-0 border-y border-[#131718]/15">
      <div className="max-w-[1400px] w-full mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-stretch">

          {/* Kolom Kiri: Judul Besar & Foto Utama */}
          <div className="flex flex-col justify-between">
            <div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-light leading-[1.1] tracking-tight uppercase max-w-sm">
                PERTANYAAN SEPUTAR KAMI
              </h2>
            </div>

            {/* Foto Utama 02 (Sembunyi di tampilan mobile, muncul di desktop) */}
            <div className="mt-8 lg:mt-16 w-full lg:w-5/6 hidden md:block">
              <div className="flex flex-col items-start">
                <div className="relative w-full aspect-[4/5] max-h-[45vh] lg:max-h-[50vh] bg-gray-100 rounded-none overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80"
                    alt="Doamandeh Lifestyle"
                    fill
                    className="object-cover"
                  />
                </div>
                <p className="text-[10px] mt-2 uppercase tracking-widest text-[#131718]/50">02</p>
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Foto Kecil & Accordion FAQ */}
          <div className="flex flex-col justify-between h-full">

            {/* Foto Kecil (Kanan Atas) */}
            <div className="flex justify-end mb-8 lg:mb-12">
              <div className="flex flex-col items-start">
                <div className="relative w-28 h-36 md:w-32 md:h-40 bg-gray-100 rounded-none overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=400&q=80"
                    alt="Detail Architecture"
                    fill
                    className="object-cover"
                  />
                </div>
                <p className="text-[10px] mt-2 uppercase tracking-widest text-[#131718]/50">01</p>
              </div>
            </div>

            {/* Daftar Accordion Minimalis */}
            <div className="border-t border-[#131718] w-full mt-auto">
              {FAQ_DATA.map((faq, index) => {
                const isOpen = openIndex === index;
                return (
                  <div key={index} className="border-b border-[#131718]">
                    <button
                      type="button"
                      onClick={() => toggleFaq(index)}
                      className="w-full flex items-center justify-between py-4 focus:outline-none text-left group"
                    >
                      <h3 className="text-xs md:text-sm font-medium tracking-widest uppercase pr-8 group-hover:opacity-60 transition-opacity">
                        {faq.num}. {faq.question}
                      </h3>
                      <div className="shrink-0 text-[#131718]">
                        {isOpen ? (
                          <Minus className="w-4 h-4 stroke-[1.5]" />
                        ) : (
                          <Plus className="w-4 h-4 stroke-[1.5]" />
                        )}
                      </div>
                    </button>

                    <div
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-40 opacity-100 pb-4' : 'max-h-0 opacity-0 pb-0'
                        }`}
                    >
                      <p className="text-xs md:text-sm text-[#131718]/70 leading-relaxed font-light pr-10">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}