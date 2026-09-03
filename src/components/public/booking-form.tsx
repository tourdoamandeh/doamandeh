'use client';

import { useState, useTransition } from 'react';
import { Service } from '@/types/database';
import {
  createPublicBookingAction,
  BookingResponseData,
} from '@/lib/actions/public/booking';
import {
  Calendar,
  User,
  Mail,
  Phone,
  FileText,
  Loader2,
  CheckCircle2,
  AlertCircle,
  MessageCircle,
  RefreshCw,
  ShieldCheck,
  ArrowUpRight,
} from 'lucide-react';

interface BookingFormProps {
  service: Service;
}

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function BookingForm({ service }: BookingFormProps) {
  const [isPending, startTransition] = useTransition();

  // Form input states
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [notes, setNotes] = useState('');

  // Status & Feedback states
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [completedBooking, setCompletedBooking] = useState<BookingResponseData | null>(
    null
  );

  // Minimum date today
  const todayDateStr = new Date().toISOString().split('T')[0];

  function handleReset() {
    setCustomerName('');
    setCustomerEmail('');
    setCustomerPhone('');
    setBookingDate('');
    setNotes('');
    setErrorMessage(null);
    setFieldErrors({});
    setCompletedBooking(null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);
    setFieldErrors({});

    // Client preliminary checks
    const errors: Record<string, string> = {};
    if (!customerName.trim() || customerName.trim().length < 2) {
      errors.customerName = 'Nama lengkap minimal 2 karakter';
    }
    if (!customerEmail.trim() || !customerEmail.includes('@')) {
      errors.customerEmail = 'Masukkan alamat email yang valid';
    }
    if (!customerPhone.trim() || customerPhone.trim().length < 8) {
      errors.customerPhone = 'Nomor WhatsApp / telepon minimal 8 digit';
    }
    if (!bookingDate) {
      errors.bookingDate = 'Pilih tanggal reservasi';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    startTransition(async () => {
      const res = await createPublicBookingAction({
        serviceId: service.id,
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        customerPhone: customerPhone.trim(),
        bookingDate,
        notes: notes.trim() || undefined,
      });

      if (!res.success) {
        setErrorMessage(res.error || 'Terjadi kesalahan saat memproses booking.');
        if (res.fieldErrors) {
          setFieldErrors(res.fieldErrors);
        }
      } else if (res.data) {
        setCompletedBooking(res.data);
      }
    });
  }

  // --- SUCCESS STATE ---
  if (completedBooking) {
    const waText = encodeURIComponent(
      `Halo Doamandeh Tours and Travel,\nSaya telah melakukan booking layanan melalui website:\n\n` +
      `• *Layanan*: ${completedBooking.serviceTitle}\n` +
      `• *Nama*: ${completedBooking.customerName}\n` +
      `• *Tanggal*: ${completedBooking.bookingDate}\n` +
      `• *Total*: ${completedBooking.totalPrice ? formatRupiah(completedBooking.totalPrice) : '-'}\n` +
      `• *No. Ref*: ${completedBooking.id.slice(0, 8)}\n\n` +
      `Mohon info konfirmasi dan petunjuk selanjutnya. Terima kasih!`
    );
    const waUrl = `https://wa.me/6281234567890?text=${waText}`;

    return (
      <div className="rounded-[32px] bg-lightblue p-8 sm:p-10 text-center shadow-sm border-none">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-black text-[#D1E6F6] mb-5 shadow-sm">
          <CheckCircle2 className="h-8 w-8" />
        </div>

        <h3 className="font-serif text-3xl sm:text-4xl text-black mb-2">
          Pemesanan Berhasil Dikirim!
        </h3>
        <p className="text-xs sm:text-sm text-black/80 leading-relaxed max-w-md mx-auto mb-6 font-sans">
          Terima kasih, <strong className="text-black">{completedBooking.customerName}</strong>. Permintaan booking Anda telah kami terima dan berstatus <span className="font-semibold underline">Pending</span>.
        </p>

        {/* Booking Summary Card */}
        <div className="rounded-[24px] bg-tissue p-6 text-left text-xs font-sans space-y-3 mb-6 shadow-sm">
          <div className="flex justify-between items-center border-b border-gray-100 pb-2">
            <span className="text-black/60">ID Referensi</span>
            <span className="font-mono text-black font-bold">{completedBooking.id.slice(0, 8)}...</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-black/60">Layanan</span>
            <span className="font-semibold text-black">{completedBooking.serviceTitle}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-black/60">Tanggal Pemakaian</span>
            <span className="font-semibold text-black">{completedBooking.bookingDate}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-black/60">No. WhatsApp</span>
            <span className="text-black">{completedBooking.customerPhone}</span>
          </div>
          <div className="flex justify-between items-center border-t border-gray-100 pt-3">
            <span className="font-medium text-black">Estimasi Total Biaya</span>
            <span className="font-serif text-2xl font-normal text-black">
              {completedBooking.totalPrice ? formatRupiah(completedBooking.totalPrice) : '-'}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 font-serif">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 rounded-full bg-black text-tissue text-xl py-4 px-6 hover:bg-black/90 transition-all shadow-sm border-none"
          >
            <MessageCircle className="h-5 w-5" />
            <span>Konfirmasi Langsung via WhatsApp</span>
          </a>

          <button
            onClick={handleReset}
            className="w-full flex items-center justify-center gap-2 rounded-full bg-tissue text-black text-lg py-3 px-4 hover:bg-slate-50 transition-colors border-none shadow-sm"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Pesan Layanan Lainnya</span>
          </button>
        </div>
      </div>
    );
  }

  // --- FORM STATE ---
  return (
    <div className="rounded-[36px] bg-yellow p-8 sm:p-10 shadow-sm border-none">
      <div className="flex items-center justify-between border-b border-black/15 pb-4 mb-6">
        <div>
          <h3 className="font-serif text-3xl text-black">Form Reservasi</h3>
          <p className="text-xs text-black/70 mt-0.5 font-sans">Isi data di bawah untuk memesan layanan ini</p>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-black/60 font-serif italic block">Harga</span>
          <span className="font-serif text-2xl sm:text-3xl font-normal text-black">
            {formatRupiah(service.price)}
          </span>
        </div>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="mb-6 flex items-start gap-3 rounded-2xl bg-red-100 border border-red-200 p-4 text-xs text-red-900 animate-in fade-in">
          <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-serif text-base text-red-950">Gagal Mengirim Form</p>
            <p className="text-red-800 mt-0.5 font-sans">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Customer Name */}
        <div>
          <label className="block font-serif text-lg text-black mb-1.5">
            Nama Lengkap Anda <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-black/40" />
            <input
              type="text"
              required
              disabled={isPending}
              placeholder="Contoh: Budi Santoso"
              value={customerName}
              onChange={(e) => {
                setCustomerName(e.target.value);
                if (fieldErrors.customerName) {
                  setFieldErrors((prev) => ({ ...prev, customerName: '' }));
                }
              }}
              className={`w-full rounded-2xl border bg-tissue pl-11 pr-4 py-3.5 text-xs text-black font-sans placeholder-black/40 focus:outline-none disabled:opacity-50 transition-colors ${fieldErrors.customerName
                ? 'border-red-500'
                : 'border-gray-200 focus:border-black'
                }`}
            />
          </div>
          {fieldErrors.customerName && (
            <p className="text-[11px] font-sans text-red-600 mt-1">{fieldErrors.customerName}</p>
          )}
        </div>

        {/* Email & Phone Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-serif text-lg text-black mb-1.5">
              Alamat Email <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-black/40" />
              <input
                type="email"
                required
                disabled={isPending}
                placeholder="nama@email.com"
                value={customerEmail}
                onChange={(e) => {
                  setCustomerEmail(e.target.value);
                  if (fieldErrors.customerEmail) {
                    setFieldErrors((prev) => ({ ...prev, customerEmail: '' }));
                  }
                }}
                className={`w-full rounded-2xl border bg-tissue pl-11 pr-4 py-3.5 text-xs text-black font-sans placeholder-black/40 focus:outline-none disabled:opacity-50 transition-colors ${fieldErrors.customerEmail
                  ? 'border-red-500'
                  : 'border-gray-200 focus:border-black'
                  }`}
              />
            </div>
            {fieldErrors.customerEmail && (
              <p className="text-[11px] font-sans text-red-600 mt-1">{fieldErrors.customerEmail}</p>
            )}
          </div>

          <div>
            <label className="block font-serif text-lg text-black mb-1.5">
              No. WhatsApp / HP <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-black/40" />
              <input
                type="tel"
                required
                disabled={isPending}
                placeholder="081234567890"
                value={customerPhone}
                onChange={(e) => {
                  setCustomerPhone(e.target.value);
                  if (fieldErrors.customerPhone) {
                    setFieldErrors((prev) => ({ ...prev, customerPhone: '' }));
                  }
                }}
                className={`w-full rounded-2xl border bg-tissue pl-11 pr-4 py-3.5 text-xs text-black font-sans placeholder-black/40 focus:outline-none disabled:opacity-50 transition-colors ${fieldErrors.customerPhone
                  ? 'border-red-500'
                  : 'border-gray-200 focus:border-black'
                  }`}
              />
            </div>
            {fieldErrors.customerPhone && (
              <p className="text-[11px] font-sans text-red-600 mt-1">{fieldErrors.customerPhone}</p>
            )}
          </div>
        </div>

        {/* Booking Date */}
        <div>
          <label className="block font-serif text-lg text-black mb-1.5">
            Tanggal Reservasi <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-black/40" />
            <input
              type="date"
              required
              min={todayDateStr}
              disabled={isPending}
              value={bookingDate}
              onChange={(e) => {
                setBookingDate(e.target.value);
                if (fieldErrors.bookingDate) {
                  setFieldErrors((prev) => ({ ...prev, bookingDate: '' }));
                }
              }}
              className={`w-full rounded-2xl border bg-tissue pl-11 pr-4 py-3.5 text-xs text-black font-sans focus:outline-none disabled:opacity-50 transition-colors ${fieldErrors.bookingDate
                ? 'border-red-500'
                : 'border-gray-200 focus:border-black'
                }`}
            />
          </div>
          {fieldErrors.bookingDate && (
            <p className="text-[11px] font-sans text-red-600 mt-1">{fieldErrors.bookingDate}</p>
          )}
        </div>

        {/* Notes */}
        <div>
          <label className="block font-serif text-lg text-black mb-1.5">
            Catatan Tambahan <span className="text-black/50 text-sm italic font-serif">(Opsional)</span>
          </label>
          <div className="relative">
            <FileText className="absolute left-4 top-4 h-4 w-4 text-black/40" />
            <textarea
              rows={3}
              disabled={isPending}
              placeholder="Contoh: Lokasi penjemputan bandara, jam kedatangan, preferensi desain tato, dll."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-2xl border border-gray-200 bg-tissue pl-11 pr-4 py-3 text-xs text-black font-sans placeholder-black/40 focus:border-black focus:outline-none resize-none disabled:opacity-50"
            />
          </div>
        </div>

        {/* Security & Guarantee Note */}
        <div className="flex items-center gap-2 pt-1 text-xs text-black/70 font-sans">
          <ShieldCheck className="h-4 w-4 text-black shrink-0" />
          <span>Data reservasi Anda aman & tim kami akan segera menghubungi untuk konfirmasi.</span>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full flex items-center justify-center gap-2 rounded-full bg-black text-tissue font-serif text-xl py-4 px-8 hover:bg-black/90 transition-all border-none shadow-sm disabled:opacity-50 mt-4 cursor-pointer"
        >
          {isPending ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Memproses Booking...</span>
            </>
          ) : (
            <>
              <span>Kirim Permintaan Booking</span>
              <ArrowUpRight className="h-5 w-5" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
