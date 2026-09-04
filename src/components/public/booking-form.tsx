'use client';

import { useState, useTransition, useId } from 'react';
import { Service } from '@/types/database';
import {
  createPublicBookingAction,
  BookingResponseData,
} from '@/lib/actions/public/booking';
import { useToast } from './toast';
import {
  Calendar as CalendarIcon,
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
  Copy,
  Check,
  Clock,
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

function formatDateIndo(dateStr: string): string {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-');
  const dateObj = new Date(Number(y), Number(m) - 1, Number(d));
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(dateObj);
}

export function BookingForm({ service }: BookingFormProps) {
  const { success: showToastSuccess, error: showToastError, info: showToastInfo } = useToast();
  const [isPending, startTransition] = useTransition();

  // Unique IDs for Accessibility
  const nameId = useId();
  const emailId = useId();
  const phoneId = useId();
  const startDateId = useId();
  const endDateId = useId();
  const notesId = useId();

  // Form input states
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isMultiDay, setIsMultiDay] = useState(
    service.category === 'vehicle-rental' || service.category === 'villa'
  );
  const [notes, setNotes] = useState('');

  // UI state
  const [copiedRef, setCopiedRef] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [completedBooking, setCompletedBooking] = useState<BookingResponseData | null>(null);

  // Minimum date today
  const todayDateStr = new Date().toISOString().split('T')[0];

  // Calculate duration in days
  let durationDays = 1;
  if (isMultiDay && startDate && endDate && endDate >= startDate) {
    const startMs = new Date(startDate).getTime();
    const endMs = new Date(endDate).getTime();
    const diff = Math.round((endMs - startMs) / (1000 * 60 * 60 * 24));
    durationDays = Math.max(1, diff + 1);
  }

  // Calculate estimated total
  const estimatedTotal = service.price * durationDays;

  // Handle quick date preset additions (+1, +2, +3, +7 days)
  function handleQuickDays(daysToAdd: number) {
    const base = startDate ? new Date(startDate) : new Date();
    if (!startDate) {
      setStartDate(todayDateStr);
    }
    const targetDate = new Date(base);
    targetDate.setDate(targetDate.getDate() + daysToAdd);
    const endStr = targetDate.toISOString().split('T')[0];
    setIsMultiDay(true);
    setEndDate(endStr);
    if (fieldErrors.endDate) {
      setFieldErrors((prev) => ({ ...prev, endDate: '' }));
    }
  }

  function handleReset() {
    setCustomerName('');
    setCustomerEmail('');
    setCustomerPhone('');
    setStartDate('');
    setEndDate('');
    setNotes('');
    setErrorMessage(null);
    setFieldErrors({});
    setCompletedBooking(null);
    setCopiedRef(false);
  }

  function handleCopyReference(refId: string) {
    navigator.clipboard.writeText(refId);
    setCopiedRef(true);
    showToastInfo('Kode referensi booking disalin ke clipboard');
    setTimeout(() => setCopiedRef(false), 2500);
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
      errors.customerEmail = 'Masukkan alamat email yang valid (contoh: nama@email.com)';
    }
    if (!customerPhone.trim() || customerPhone.trim().length < 8) {
      errors.customerPhone = 'Nomor WhatsApp / telepon minimal 8 digit';
    }
    if (!startDate) {
      errors.startDate = 'Pilih tanggal mulai reservasi';
    }
    if (isMultiDay && endDate && endDate < startDate) {
      errors.endDate = 'Tanggal selesai tidak boleh sebelum tanggal mulai';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      showToastError('Form Belum Lengkap', 'Mohon periksa data yang ditandai merah.');
      return;
    }

    startTransition(async () => {
      const res = await createPublicBookingAction({
        serviceId: service.id,
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        customerPhone: customerPhone.trim(),
        startDate,
        endDate: isMultiDay && endDate ? endDate : undefined,
        durationDays,
        notes: notes.trim() || undefined,
      });

      if (!res.success) {
        const errorText = res.error || 'Terjadi kesalahan saat memproses booking.';
        setErrorMessage(errorText);
        showToastError('Booking Gagal', errorText);
        if (res.fieldErrors) {
          setFieldErrors(res.fieldErrors);
        }
      } else if (res.data) {
        setCompletedBooking(res.data);
        showToastSuccess(
          'Pemesanan Berhasil Terkirim!',
          'Permintaan Anda telah masuk ke sistem Doamandeh.'
        );
      }
    });
  }

  // --- SUCCESS STATE ---
  if (completedBooking) {
    const periodDisplay =
      completedBooking.endDate && completedBooking.endDate !== completedBooking.startDate
        ? `${formatDateIndo(completedBooking.startDate)} s/d ${formatDateIndo(completedBooking.endDate)} (${completedBooking.durationDays} hari)`
        : formatDateIndo(completedBooking.startDate);

    const waText = encodeURIComponent(
      `Halo Doamandeh Tours and Travel,\n\nSaya telah melakukan booking layanan melalui website resmi:\n\n` +
        `• *ID Booking*: ${completedBooking.id.slice(0, 8)}\n` +
        `• *Layanan*: ${completedBooking.serviceTitle}\n` +
        `• *Nama Pemesan*: ${completedBooking.customerName}\n` +
        `• *No. WhatsApp*: ${completedBooking.customerPhone}\n` +
        `• *Email*: ${completedBooking.customerEmail}\n` +
        `• *Periode/Tanggal*: ${periodDisplay}\n` +
        `• *Total Estimasi*: ${completedBooking.totalPrice ? formatRupiah(completedBooking.totalPrice) : '-'}\n` +
        (completedBooking.notes ? `• *Catatan*: ${completedBooking.notes}\n` : '') +
        `\nMohon informasi ketersediaan dan konfirmasi proses selanjutnya. Terima kasih!`
    );
    const waUrl = `https://wa.me/6281234567890?text=${waText}`;

    // Mailto link for backup email summary
    const mailSubject = encodeURIComponent(`Konfirmasi Reservasi: ${completedBooking.serviceTitle} - Doamandeh`);
    const mailBody = encodeURIComponent(
      `Halo Doamandeh Tours,\n\nSaya telah melakukan booking ${completedBooking.serviceTitle} dengan ID: ${completedBooking.id}.\nMohon konfirmasi pesanan saya.`
    );
    const mailUrl = `mailto:info@doamandeh.com?subject=${mailSubject}&body=${mailBody}`;

    return (
      <div
        role="region"
        aria-label="Konfirmasi Pemesanan"
        className="rounded-[32px] border-none bg-[#FBFBFB] p-8 sm:p-10 text-center shadow-sm animate-in fade-in zoom-in-95 duration-200"
      >
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-softpink text-black mb-5 shadow-sm">
          <CheckCircle2 className="h-8 w-8" />
        </div>

        <span className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full text-xs font-serif bg-lightblue text-black mb-3">
          Permintaan Terkirim
        </span>

        <h3 className="font-serif text-3xl text-black mb-2">
          Reservasi Berhasil Diajukan!
        </h3>
        <p className="text-xs sm:text-sm text-black/70 font-sans leading-relaxed max-w-md mx-auto mb-6">
          Terima kasih, <strong className="text-black font-semibold">{completedBooking.customerName}</strong>. Permintaan Anda telah kami catat dengan status{' '}
          <span className="inline-block px-2.5 py-0.5 rounded-md bg-yellow text-black font-serif text-xs font-semibold">
            Pending
          </span>
          .
        </p>

        {/* Booking Details Card */}
        <div className="rounded-2xl bg-tissue p-5 sm:p-6 text-left text-xs space-y-3 mb-6 divide-y divide-gray-200 font-sans">
          {/* Reference ID with Copy Button */}
          <div className="flex justify-between items-center pb-2">
            <div>
              <span className="text-black/50 block text-[10px] uppercase font-semibold tracking-wider font-sans">
                ID Referensi
              </span>
              <span className="font-mono text-black font-bold text-sm">
                #{completedBooking.id.slice(0, 8).toUpperCase()}
              </span>
            </div>
            <button
              onClick={() => handleCopyReference(completedBooking.id)}
              type="button"
              aria-label="Salin ID Referensi Booking"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 bg-white hover:bg-gray-100 text-black transition-colors text-xs font-medium cursor-pointer"
            >
              {copiedRef ? (
                <>
                  <Check className="h-3.5 w-3.5 text-black" />
                  <span className="font-semibold">Tersalin</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 text-black/60" />
                  <span>Salin ID</span>
                </>
              )}
            </button>
          </div>

          <div className="pt-2 flex justify-between items-center">
            <span className="text-black/60">Layanan</span>
            <span className="font-bold text-black font-serif text-sm text-right">{completedBooking.serviceTitle}</span>
          </div>

          <div className="pt-2 flex justify-between items-center">
            <span className="text-black/60">Tanggal / Durasi</span>
            <span className="font-semibold text-black text-right">{periodDisplay}</span>
          </div>

          <div className="pt-2 flex justify-between items-center">
            <span className="text-black/60">WhatsApp Pemesan</span>
            <span className="text-black">{completedBooking.customerPhone}</span>
          </div>

          <div className="pt-2 flex justify-between items-center">
            <span className="text-black/60">Email Pemesan</span>
            <span className="text-black">{completedBooking.customerEmail}</span>
          </div>

          <div className="pt-3 flex justify-between items-center">
            <div>
              <span className="text-black/70 font-semibold block">Estimasi Total Biaya</span>
              <span className="text-[10px] text-black/50">
                ({completedBooking.durationDays} hari pemakaian)
              </span>
            </div>
            <span className="font-serif text-xl font-bold text-black">
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
            className="w-full flex items-center justify-center gap-2 rounded-full bg-black text-tissue font-serif text-xl py-4 px-8 hover:bg-black/90 transition-all border-none shadow-sm cursor-pointer"
          >
            <MessageCircle className="h-5 w-5" />
            <span>Konfirmasi Cepat via WhatsApp</span>
          </a>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <a
              href={mailUrl}
              className="flex items-center justify-center gap-2 rounded-full border border-gray-200 bg-tissue hover:bg-gray-100 py-3 px-4 text-xs font-medium text-black transition-colors"
            >
              <Mail className="h-4 w-4 text-black/60" />
              <span>Simpan via Email</span>
            </a>

            <button
              onClick={handleReset}
              type="button"
              className="flex items-center justify-center gap-2 rounded-full border border-gray-200 bg-tissue hover:bg-gray-100 py-3 px-4 text-xs font-medium text-black transition-colors cursor-pointer"
            >
              <RefreshCw className="h-4 w-4 text-black/60" />
              <span>Pesan Layanan Lain</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- FORM STATE ---
  return (
    <div
      role="region"
      aria-label="Formulir Reservasi Layanan"
      className="rounded-[32px] border-none bg-[#FBFBFB] p-8 sm:p-10 shadow-sm"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
        <div>
          <h3 className="font-serif text-3xl text-black">
            Reservasi Layanan
          </h3>
          <p className="text-xs text-black/60 mt-1 font-sans">
            Isi data di bawah untuk memesan layanan ini
          </p>
        </div>
        <div className="text-right">
          <span className="font-serif text-xs text-black/60 block">Harga</span>
          <span className="font-serif text-2xl font-normal text-black">{formatRupiah(service.price)}</span>
          <span className="font-serif text-xs text-black/60 block">
            /{service.unit?.replace(/^per\s+/i, '') || 'hari'}
          </span>
        </div>
      </div>

      {/* Error Alert Banner */}
      {errorMessage && (
        <div
          role="alert"
          className="mb-6 flex items-start gap-3 rounded-2xl bg-red-50 border border-red-200 p-4 text-xs text-red-700 animate-in fade-in"
        >
          <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <p className="font-semibold text-red-800">Gagal Mengirim Form Reservasi</p>
            <p className="text-red-600 mt-0.5">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} noValidate className="space-y-4 text-xs">
        {/* Customer Name */}
        <div>
          <label htmlFor={nameId} className="block font-serif text-lg text-black mb-1.5">
            Nama Lengkap Anda <span className="text-red-500" aria-hidden="true">*</span>
          </label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-black/40 pointer-events-none" aria-hidden="true" />
            <input
              id={nameId}
              type="text"
              required
              aria-required="true"
              aria-invalid={!!fieldErrors.customerName}
              aria-describedby={fieldErrors.customerName ? `${nameId}-error` : undefined}
              disabled={isPending}
              placeholder="Contoh: Budi Santoso"
              value={customerName}
              onChange={(e) => {
                setCustomerName(e.target.value);
                if (fieldErrors.customerName) {
                  setFieldErrors((prev) => ({ ...prev, customerName: '' }));
                }
              }}
              className={`w-full rounded-2xl border bg-tissue pl-11 pr-4 py-3.5 text-xs text-black font-sans placeholder-black/40 focus:outline-none disabled:opacity-50 transition-colors ${
                fieldErrors.customerName
                  ? 'border-red-500 focus:border-red-600'
                  : 'border-gray-200 focus:border-black'
              }`}
            />
          </div>
          {fieldErrors.customerName && (
            <p id={`${nameId}-error`} role="alert" className="text-[11px] font-sans text-red-600 mt-1 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              <span>{fieldErrors.customerName}</span>
            </p>
          )}
        </div>

        {/* Email & Phone Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor={emailId} className="block font-serif text-lg text-black mb-1.5">
              Alamat Email <span className="text-red-500" aria-hidden="true">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-black/40 pointer-events-none" aria-hidden="true" />
              <input
                id={emailId}
                type="email"
                required
                aria-required="true"
                aria-invalid={!!fieldErrors.customerEmail}
                aria-describedby={fieldErrors.customerEmail ? `${emailId}-error` : undefined}
                disabled={isPending}
                placeholder="nama@email.com"
                value={customerEmail}
                onChange={(e) => {
                  setCustomerEmail(e.target.value);
                  if (fieldErrors.customerEmail) {
                    setFieldErrors((prev) => ({ ...prev, customerEmail: '' }));
                  }
                }}
                className={`w-full rounded-2xl border bg-tissue pl-11 pr-4 py-3.5 text-xs text-black font-sans placeholder-black/40 focus:outline-none disabled:opacity-50 transition-colors ${
                  fieldErrors.customerEmail
                    ? 'border-red-500 focus:border-red-600'
                    : 'border-gray-200 focus:border-black'
                }`}
              />
            </div>
            {fieldErrors.customerEmail && (
              <p id={`${emailId}-error`} role="alert" className="text-[11px] font-sans text-red-600 mt-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                <span>{fieldErrors.customerEmail}</span>
              </p>
            )}
          </div>

          <div>
            <label htmlFor={phoneId} className="block font-serif text-lg text-black mb-1.5">
              No. WhatsApp / HP <span className="text-red-500" aria-hidden="true">*</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-black/40 pointer-events-none" aria-hidden="true" />
              <input
                id={phoneId}
                type="tel"
                required
                aria-required="true"
                aria-invalid={!!fieldErrors.customerPhone}
                aria-describedby={fieldErrors.customerPhone ? `${phoneId}-error` : undefined}
                disabled={isPending}
                placeholder="081234567890"
                value={customerPhone}
                onChange={(e) => {
                  setCustomerPhone(e.target.value);
                  if (fieldErrors.customerPhone) {
                    setFieldErrors((prev) => ({ ...prev, customerPhone: '' }));
                  }
                }}
                className={`w-full rounded-2xl border bg-tissue pl-11 pr-4 py-3.5 text-xs text-black font-sans placeholder-black/40 focus:outline-none disabled:opacity-50 transition-colors ${
                  fieldErrors.customerPhone
                    ? 'border-red-500 focus:border-red-600'
                    : 'border-gray-200 focus:border-black'
                }`}
              />
            </div>
            {fieldErrors.customerPhone && (
              <p id={`${phoneId}-error`} role="alert" className="text-[11px] font-sans text-red-600 mt-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                <span>{fieldErrors.customerPhone}</span>
              </p>
            )}
          </div>
        </div>

        {/* Date Mode Toggle */}
        <div className="flex items-center justify-between pt-1 pb-0.5">
          <span className="text-xs font-serif text-black">Durasi Pemesanan:</span>
          <button
            type="button"
            onClick={() => {
              setIsMultiDay(!isMultiDay);
              if (isMultiDay) {
                setEndDate('');
              }
            }}
            className="text-xs font-serif text-black hover:underline cursor-pointer"
          >
            {isMultiDay ? 'Ganti ke Pemesanan 1 Hari' : 'Pesan Rentang Beberapa Hari'}
          </button>
        </div>

        {/* Date Pickers Grid */}
        <div className={`grid gap-4 ${isMultiDay ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
          {/* Start Date */}
          <div>
            <label htmlFor={startDateId} className="block font-serif text-lg text-black mb-1.5">
              {isMultiDay ? 'Tanggal Mulai / Check-in' : 'Tanggal Reservasi / Pemakaian'}{' '}
              <span className="text-red-500" aria-hidden="true">*</span>
            </label>
            <div className="relative">
              <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-black/40 pointer-events-none" aria-hidden="true" />
              <input
                id={startDateId}
                type="date"
                required
                aria-required="true"
                aria-invalid={!!fieldErrors.startDate}
                aria-describedby={fieldErrors.startDate ? `${startDateId}-error` : undefined}
                min={todayDateStr}
                disabled={isPending}
                value={startDate}
                onChange={(e) => {
                  const val = e.target.value;
                  setStartDate(val);
                  if (fieldErrors.startDate) {
                    setFieldErrors((prev) => ({ ...prev, startDate: '' }));
                  }
                  if (endDate && val && endDate < val) {
                    setEndDate(val);
                  }
                }}
                className={`w-full rounded-2xl border bg-tissue pl-11 pr-4 py-3.5 text-xs text-black font-sans focus:outline-none disabled:opacity-50 transition-colors ${
                  fieldErrors.startDate
                    ? 'border-red-500 focus:border-red-600'
                    : 'border-gray-200 focus:border-black'
                }`}
              />
            </div>
            {fieldErrors.startDate && (
              <p id={`${startDateId}-error`} role="alert" className="text-[11px] font-sans text-red-600 mt-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                <span>{fieldErrors.startDate}</span>
              </p>
            )}
          </div>

          {/* End Date (if multi-day) */}
          {isMultiDay && (
            <div>
              <label htmlFor={endDateId} className="block font-serif text-lg text-black mb-1.5">
                Tanggal Selesai / Check-out <span className="text-red-500" aria-hidden="true">*</span>
              </label>
              <div className="relative">
                <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-black/40 pointer-events-none" aria-hidden="true" />
                <input
                  id={endDateId}
                  type="date"
                  required
                  aria-required="true"
                  aria-invalid={!!fieldErrors.endDate}
                  aria-describedby={fieldErrors.endDate ? `${endDateId}-error` : undefined}
                  min={startDate || todayDateStr}
                  disabled={isPending || !startDate}
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    if (fieldErrors.endDate) {
                      setFieldErrors((prev) => ({ ...prev, endDate: '' }));
                    }
                  }}
                  className={`w-full rounded-2xl border bg-tissue pl-11 pr-4 py-3.5 text-xs text-black font-sans focus:outline-none disabled:opacity-50 transition-colors ${
                    fieldErrors.endDate
                      ? 'border-red-500 focus:border-red-600'
                      : 'border-gray-200 focus:border-black'
                  }`}
                />
              </div>
              {fieldErrors.endDate && (
                <p id={`${endDateId}-error`} role="alert" className="text-[11px] font-sans text-red-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  <span>{fieldErrors.endDate}</span>
                </p>
              )}
            </div>
          )}
        </div>

        {/* Quick Date Presets */}
        <div className="flex flex-wrap items-center gap-2 pt-1 pb-1">
          <span className="text-[11px] text-black/60 font-sans flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Preset durasi:
          </span>
          <button
            type="button"
            onClick={() => {
              setIsMultiDay(false);
              setEndDate('');
            }}
            className={`px-3 py-1.5 rounded-full border text-[11px] font-sans transition-colors cursor-pointer ${
              !isMultiDay
                ? 'bg-yellow border-yellow text-black font-semibold'
                : 'bg-tissue border-gray-200 text-black/70 hover:bg-gray-100'
            }`}
          >
            1 Hari
          </button>
          <button
            type="button"
            onClick={() => handleQuickDays(1)}
            className="px-3 py-1.5 rounded-full border border-gray-200 bg-tissue text-black/70 hover:bg-gray-100 text-[11px] font-sans transition-colors cursor-pointer"
          >
            +1 Hari (2 Hari)
          </button>
          <button
            type="button"
            onClick={() => handleQuickDays(2)}
            className="px-3 py-1.5 rounded-full border border-gray-200 bg-tissue text-black/70 hover:bg-gray-100 text-[11px] font-sans transition-colors cursor-pointer"
          >
            +2 Hari (3 Hari)
          </button>
          <button
            type="button"
            onClick={() => handleQuickDays(6)}
            className="px-3 py-1.5 rounded-full border border-gray-200 bg-tissue text-black/70 hover:bg-gray-100 text-[11px] font-sans transition-colors cursor-pointer"
          >
            +6 Hari (1 Minggu)
          </button>
        </div>

        {/* Price & Duration Summary Box */}
        <div className="rounded-2xl bg-yellow p-4 text-black font-sans space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-black/70">Durasi Terpilih</span>
            <span className="font-semibold text-black">
              {durationDays} {service.category === 'villa' ? 'Malam' : 'Hari'}
            </span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-black/70">Tarif Satuan</span>
            <span className="text-black">{formatRupiah(service.price)}</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-black/10">
            <div>
              <span className="font-bold text-black text-xs block">Estimasi Total Biaya</span>
              <span className="text-[10px] text-black/60">
                {durationDays > 1 ? `${durationDays} x ${formatRupiah(service.price)}` : 'Tarif 1 sesi/hari'}
              </span>
            </div>
            <span className="font-serif text-2xl font-normal text-black">
              {formatRupiah(estimatedTotal)}
            </span>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label htmlFor={notesId} className="block font-serif text-lg text-black mb-1.5">
            Catatan Tambahan <span className="text-black/50 text-sm italic font-serif">(Opsional)</span>
          </label>
          <div className="relative">
            <FileText className="absolute left-4 top-4 h-4 w-4 text-black/40 pointer-events-none" aria-hidden="true" />
            <textarea
              id={notesId}
              rows={3}
              disabled={isPending}
              placeholder="Contoh: Lokasi antar jemput bandara/hotel, jam kedatangan, preferensi khusus..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-2xl border border-gray-200 bg-tissue pl-11 pr-4 py-3 text-xs text-black font-sans placeholder-black/40 focus:border-black focus:outline-none resize-none disabled:opacity-50 transition-colors"
            />
          </div>
        </div>

        {/* Trust & Guarantee */}
        <div className="flex items-center gap-2 pt-1 text-xs text-black/70 font-sans">
          <ShieldCheck className="h-4 w-4 text-black shrink-0" aria-hidden="true" />
          <span>Data reservasi Anda aman & tim kami akan segera menghubungi untuk konfirmasi.</span>
        </div>

        {/* Submit Button with Loading State */}
        <button
          type="submit"
          disabled={isPending}
          aria-busy={isPending}
          className="w-full flex items-center justify-center gap-2 rounded-full bg-black text-tissue font-serif text-xl py-4 px-8 hover:bg-black/90 transition-all border-none shadow-sm disabled:opacity-50 mt-4 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
        >
          {isPending ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
              <span>Memproses Booking...</span>
            </>
          ) : (
            <>
              <span>Kirim Permintaan Booking</span>
              <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
