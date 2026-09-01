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
      <div className="rounded-3xl border border-emerald-500/30 bg-zinc-900/90 p-6 sm:p-8 text-center shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-200">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-5 shadow-lg shadow-emerald-500/10">
          <CheckCircle2 className="h-8 w-8" />
        </div>

        <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
          Pemesanan Berhasil Dikirim!
        </h3>
        <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-md mx-auto mb-6">
          Terima kasih, <strong className="text-white">{completedBooking.customerName}</strong>. Permintaan booking Anda telah kami terima dan berstatus <span className="text-amber-400 font-semibold">Pending</span>.
        </p>

        {/* Booking Summary Card */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5 text-left text-xs space-y-2.5 mb-6">
          <div className="flex justify-between items-center border-b border-zinc-800/80 pb-2">
            <span className="text-zinc-500">ID Referensi</span>
            <span className="font-mono text-zinc-300 font-semibold">{completedBooking.id.slice(0, 8)}...</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-zinc-500">Layanan</span>
            <span className="font-semibold text-white">{completedBooking.serviceTitle}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-zinc-500">Tanggal Pemakaian</span>
            <span className="font-semibold text-amber-400">{completedBooking.bookingDate}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-zinc-500">No. WhatsApp</span>
            <span className="text-zinc-300">{completedBooking.customerPhone}</span>
          </div>
          <div className="flex justify-between items-center border-t border-zinc-800/80 pt-2">
            <span className="text-zinc-500 font-semibold">Estimasi Total Biaya</span>
            <span className="font-bold text-emerald-400 text-sm">
              {completedBooking.totalPrice ? formatRupiah(completedBooking.totalPrice) : '-'}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 hover:bg-emerald-400 py-3.5 px-6 text-xs font-bold text-black transition-all shadow-lg shadow-emerald-500/20"
          >
            <MessageCircle className="h-4 w-4" />
            <span>Konfirmasi Langsung via WhatsApp</span>
          </a>

          <button
            onClick={handleReset}
            className="w-full flex items-center justify-center gap-2 rounded-2xl border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 py-3 px-4 text-xs font-medium text-zinc-300 transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5 text-zinc-500" />
            <span>Pesan Layanan Lainnya</span>
          </button>
        </div>
      </div>
    );
  }

  // --- FORM STATE ---
  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-900/80 p-6 sm:p-8 shadow-2xl backdrop-blur-md">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-6">
        <div>
          <h3 className="text-lg font-bold text-white">Form Reservasi & Booking</h3>
          <p className="text-xs text-zinc-400 mt-0.5">Isi data di bawah untuk memesan layanan ini</p>
        </div>
        <div className="text-right">
          <span className="text-xs text-zinc-400 block">Harga</span>
          <span className="text-base font-extrabold text-amber-400">
            {formatRupiah(service.price)}
          </span>
          <span className="text-[10px] text-zinc-400 block">
            /{service.unit?.replace(/^per\s+/i, '') || 'layanan'}
          </span>
        </div>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="mb-6 flex items-start gap-3 rounded-2xl bg-red-950/40 border border-red-800/80 p-4 text-xs text-red-300 animate-in fade-in">
          <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-200">Gagal Mengirim Form</p>
            <p className="text-red-400/90 mt-0.5">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Customer Name */}
        <div>
          <label className="block font-semibold text-zinc-300 mb-1.5">
            Nama Lengkap Anda <span className="text-amber-400">*</span>
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
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
              className={`w-full rounded-xl border bg-zinc-950 pl-10 pr-4 py-3 text-xs text-white placeholder-zinc-500 focus:outline-none disabled:opacity-50 transition-colors ${
                fieldErrors.customerName
                  ? 'border-red-500 focus:border-red-400'
                  : 'border-zinc-800 focus:border-amber-500'
              }`}
            />
          </div>
          {fieldErrors.customerName && (
            <p className="text-[11px] text-red-400 mt-1">{fieldErrors.customerName}</p>
          )}
        </div>

        {/* Email & Phone Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-zinc-300 mb-1.5">
              Alamat Email <span className="text-amber-400">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
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
                className={`w-full rounded-xl border bg-zinc-950 pl-10 pr-4 py-3 text-xs text-white placeholder-zinc-500 focus:outline-none disabled:opacity-50 transition-colors ${
                  fieldErrors.customerEmail
                    ? 'border-red-500 focus:border-red-400'
                    : 'border-zinc-800 focus:border-amber-500'
                }`}
              />
            </div>
            {fieldErrors.customerEmail && (
              <p className="text-[11px] text-red-400 mt-1">{fieldErrors.customerEmail}</p>
            )}
          </div>

          <div>
            <label className="block font-semibold text-zinc-300 mb-1.5">
              Nomor WhatsApp / HP <span className="text-amber-400">*</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
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
                className={`w-full rounded-xl border bg-zinc-950 pl-10 pr-4 py-3 text-xs text-white placeholder-zinc-500 focus:outline-none disabled:opacity-50 transition-colors ${
                  fieldErrors.customerPhone
                    ? 'border-red-500 focus:border-red-400'
                    : 'border-zinc-800 focus:border-amber-500'
                }`}
              />
            </div>
            {fieldErrors.customerPhone && (
              <p className="text-[11px] text-red-400 mt-1">{fieldErrors.customerPhone}</p>
            )}
          </div>
        </div>

        {/* Booking Date */}
        <div>
          <label className="block font-semibold text-zinc-300 mb-1.5">
            Tanggal Reservasi / Pemakaian <span className="text-amber-400">*</span>
          </label>
          <div className="relative">
            <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
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
              className={`w-full rounded-xl border bg-zinc-950 pl-10 pr-4 py-3 text-xs text-white focus:outline-none disabled:opacity-50 transition-colors ${
                fieldErrors.bookingDate
                  ? 'border-red-500 focus:border-red-400'
                  : 'border-zinc-800 focus:border-amber-500'
              }`}
            />
          </div>
          {fieldErrors.bookingDate && (
            <p className="text-[11px] text-red-400 mt-1">{fieldErrors.bookingDate}</p>
          )}
        </div>

        {/* Notes */}
        <div>
          <label className="block font-semibold text-zinc-300 mb-1.5">
            Catatan Tambahan / Permintaan Khusus <span className="text-zinc-500 font-normal">(Opsional)</span>
          </label>
          <div className="relative">
            <FileText className="absolute left-3.5 top-3 h-4 w-4 text-zinc-500" />
            <textarea
              rows={3}
              disabled={isPending}
              placeholder="Contoh: Lokasi penjemputan bandara, jam kedatangan, preferensi desain tato, dll."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 pl-10 pr-4 py-3 text-xs text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none resize-none disabled:opacity-50"
            />
          </div>
        </div>

        {/* Security & Guarantee Note */}
        <div className="flex items-center gap-2 pt-1 text-[11px] text-zinc-400">
          <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>Data reservasi Anda aman & tim kami akan segera menghubungi untuk konfirmasi.</span>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full flex items-center justify-center gap-2 rounded-2xl bg-amber-500 hover:bg-amber-400 py-3.5 px-6 text-xs font-bold text-black transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50 mt-4 cursor-pointer"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Memproses Booking Anda...</span>
            </>
          ) : (
            <>
              <Calendar className="h-4 w-4" />
              <span>Kirim Permintaan Booking</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
