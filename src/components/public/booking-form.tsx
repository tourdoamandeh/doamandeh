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
  Sparkles,
  ChevronRight,
  Info,
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
        className="rounded-3xl border border-emerald-500/30 bg-zinc-900/95 p-6 sm:p-8 text-center shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-200"
      >
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-5 shadow-lg shadow-emerald-500/10">
          <CheckCircle2 className="h-8 w-8 animate-in zoom-in duration-300" />
        </div>

        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-3">
          <Sparkles className="h-3.5 w-3.5" />
          Permintaan Terkirim
        </span>

        <h3 className="text-xl sm:text-2xl font-black text-white mb-2 tracking-tight">
          Reservasi Berhasil Diajukan!
        </h3>
        <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-md mx-auto mb-6">
          Terima kasih, <strong className="text-white">{completedBooking.customerName}</strong>. Permintaan Anda telah kami catat dengan status{' '}
          <span className="inline-block px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400 font-semibold text-xs">
            Pending
          </span>
          .
        </p>

        {/* Booking Details Card */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5 text-left text-xs space-y-3 mb-6 divide-y divide-zinc-800/60">
          {/* Reference ID with Copy Button */}
          <div className="flex justify-between items-center pb-2">
            <div>
              <span className="text-zinc-500 block text-[10px] uppercase font-semibold tracking-wider">
                ID Referensi
              </span>
              <span className="font-mono text-amber-400 font-bold text-sm">
                #{completedBooking.id.slice(0, 8).toUpperCase()}
              </span>
            </div>
            <button
              onClick={() => handleCopyReference(completedBooking.id)}
              type="button"
              aria-label="Salin ID Referensi Booking"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors text-xs font-medium cursor-pointer"
            >
              {copiedRef ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold">Tersalin</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 text-zinc-400" />
                  <span>Salin ID</span>
                </>
              )}
            </button>
          </div>

          <div className="pt-2 flex justify-between items-center">
            <span className="text-zinc-400">Layanan</span>
            <span className="font-bold text-white text-right">{completedBooking.serviceTitle}</span>
          </div>

          <div className="pt-2 flex justify-between items-center">
            <span className="text-zinc-400">Tanggal / Durasi</span>
            <span className="font-semibold text-amber-400 text-right">{periodDisplay}</span>
          </div>

          <div className="pt-2 flex justify-between items-center">
            <span className="text-zinc-400">WhatsApp Pemesan</span>
            <span className="text-zinc-200">{completedBooking.customerPhone}</span>
          </div>

          <div className="pt-2 flex justify-between items-center">
            <span className="text-zinc-400">Email Pemesan</span>
            <span className="text-zinc-200">{completedBooking.customerEmail}</span>
          </div>

          <div className="pt-3 flex justify-between items-center">
            <div>
              <span className="text-zinc-400 font-semibold block">Estimasi Total Biaya</span>
              <span className="text-[10px] text-zinc-500">
                ({completedBooking.durationDays} hari pemakaian)
              </span>
            </div>
            <span className="font-black text-emerald-400 text-base">
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
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 hover:bg-emerald-400 py-3.5 px-6 text-xs font-bold text-black transition-all shadow-xl shadow-emerald-500/20 cursor-pointer"
          >
            <MessageCircle className="h-4 w-4" />
            <span>Konfirmasi Cepat via WhatsApp</span>
          </a>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <a
              href={mailUrl}
              className="flex items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/90 hover:bg-zinc-800 py-2.5 px-3 text-[11px] font-medium text-zinc-300 transition-colors"
            >
              <Mail className="h-3.5 w-3.5 text-zinc-400" />
              <span>Simpan via Email</span>
            </a>

            <button
              onClick={handleReset}
              type="button"
              className="flex items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/90 hover:bg-zinc-800 py-2.5 px-3 text-[11px] font-medium text-zinc-300 transition-colors cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5 text-zinc-400" />
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
      className="rounded-3xl border border-zinc-800 bg-zinc-900/85 p-6 sm:p-8 shadow-2xl backdrop-blur-md"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-6">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-400" />
            Form Reservasi Layanan
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Lengkapi data untuk mengajukan jadwal & konfirmasi
          </p>
        </div>
        <div className="text-right">
          <span className="text-[10px] uppercase font-semibold text-zinc-500 block">Tarif</span>
          <span className="text-base font-black text-amber-400">{formatRupiah(service.price)}</span>
          <span className="text-[10px] text-zinc-400 block">
            /{service.unit?.replace(/^per\s+/i, '') || 'hari'}
          </span>
        </div>
      </div>

      {/* Error Alert Banner */}
      {errorMessage && (
        <div
          role="alert"
          className="mb-6 flex items-start gap-3 rounded-2xl bg-red-950/40 border border-red-800/80 p-4 text-xs text-red-300 animate-in fade-in"
        >
          <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-200">Gagal Mengirim Form Reservasi</p>
            <p className="text-red-400/90 mt-0.5">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} noValidate className="space-y-4 text-xs">
        {/* Customer Name */}
        <div>
          <label htmlFor={nameId} className="block font-semibold text-zinc-300 mb-1.5">
            Nama Lengkap Anda <span className="text-amber-400" aria-hidden="true">*</span>
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" aria-hidden="true" />
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
              className={`w-full rounded-xl border bg-zinc-950 pl-10 pr-4 py-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 disabled:opacity-50 transition-all ${
                fieldErrors.customerName
                  ? 'border-red-500 focus:border-red-400'
                  : 'border-zinc-800 focus:border-amber-500'
              }`}
            />
          </div>
          {fieldErrors.customerName && (
            <p id={`${nameId}-error`} role="alert" className="text-[11px] text-red-400 mt-1 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              <span>{fieldErrors.customerName}</span>
            </p>
          )}
        </div>

        {/* Email & Phone Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor={emailId} className="block font-semibold text-zinc-300 mb-1.5">
              Alamat Email <span className="text-amber-400" aria-hidden="true">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" aria-hidden="true" />
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
                className={`w-full rounded-xl border bg-zinc-950 pl-10 pr-4 py-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 disabled:opacity-50 transition-all ${
                  fieldErrors.customerEmail
                    ? 'border-red-500 focus:border-red-400'
                    : 'border-zinc-800 focus:border-amber-500'
                }`}
              />
            </div>
            {fieldErrors.customerEmail && (
              <p id={`${emailId}-error`} role="alert" className="text-[11px] text-red-400 mt-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                <span>{fieldErrors.customerEmail}</span>
              </p>
            )}
          </div>

          <div>
            <label htmlFor={phoneId} className="block font-semibold text-zinc-300 mb-1.5">
              Nomor WhatsApp / HP <span className="text-amber-400" aria-hidden="true">*</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" aria-hidden="true" />
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
                className={`w-full rounded-xl border bg-zinc-950 pl-10 pr-4 py-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 disabled:opacity-50 transition-all ${
                  fieldErrors.customerPhone
                    ? 'border-red-500 focus:border-red-400'
                    : 'border-zinc-800 focus:border-amber-500'
                }`}
              />
            </div>
            {fieldErrors.customerPhone && (
              <p id={`${phoneId}-error`} role="alert" className="text-[11px] text-red-400 mt-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                <span>{fieldErrors.customerPhone}</span>
              </p>
            )}
          </div>
        </div>

        {/* Date Mode Toggle */}
        <div className="flex items-center justify-between pt-1 pb-0.5">
          <span className="text-xs font-semibold text-zinc-300">Durasi Pemesanan:</span>
          <button
            type="button"
            onClick={() => {
              setIsMultiDay(!isMultiDay);
              if (isMultiDay) {
                setEndDate('');
              }
            }}
            className="text-[11px] text-amber-400 hover:text-amber-300 font-medium underline underline-offset-2 transition-colors cursor-pointer"
          >
            {isMultiDay ? 'Ganti ke Pemesanan 1 Hari' : 'Pesan Rentang Beberapa Hari'}
          </button>
        </div>

        {/* Date Pickers Grid */}
        <div className={`grid gap-4 ${isMultiDay ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
          {/* Start Date */}
          <div>
            <label htmlFor={startDateId} className="block font-semibold text-zinc-300 mb-1.5">
              {isMultiDay ? 'Tanggal Mulai / Check-in' : 'Tanggal Reservasi / Pemakaian'}{' '}
              <span className="text-amber-400" aria-hidden="true">*</span>
            </label>
            <div className="relative">
              <CalendarIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" aria-hidden="true" />
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
                  // If endDate is earlier than new startDate, adjust it
                  if (endDate && val && endDate < val) {
                    setEndDate(val);
                  }
                }}
                className={`w-full rounded-xl border bg-zinc-950 pl-10 pr-4 py-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 disabled:opacity-50 transition-all ${
                  fieldErrors.startDate
                    ? 'border-red-500 focus:border-red-400'
                    : 'border-zinc-800 focus:border-amber-500'
                }`}
              />
            </div>
            {fieldErrors.startDate && (
              <p id={`${startDateId}-error`} role="alert" className="text-[11px] text-red-400 mt-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                <span>{fieldErrors.startDate}</span>
              </p>
            )}
          </div>

          {/* End Date (if multi-day) */}
          {isMultiDay && (
            <div>
              <label htmlFor={endDateId} className="block font-semibold text-zinc-300 mb-1.5">
                Tanggal Selesai / Check-out <span className="text-amber-400" aria-hidden="true">*</span>
              </label>
              <div className="relative">
                <CalendarIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" aria-hidden="true" />
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
                  className={`w-full rounded-xl border bg-zinc-950 pl-10 pr-4 py-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 disabled:opacity-50 transition-all ${
                    fieldErrors.endDate
                      ? 'border-red-500 focus:border-red-400'
                      : 'border-zinc-800 focus:border-amber-500'
                  }`}
                />
              </div>
              {fieldErrors.endDate && (
                <p id={`${endDateId}-error`} role="alert" className="text-[11px] text-red-400 mt-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  <span>{fieldErrors.endDate}</span>
                </p>
              )}
            </div>
          )}
        </div>

        {/* Quick Date Presets */}
        <div className="flex flex-wrap items-center gap-2 pt-1 pb-1">
          <span className="text-[11px] text-zinc-400 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Preset durasi:
          </span>
          <button
            type="button"
            onClick={() => {
              setIsMultiDay(false);
              setEndDate('');
            }}
            className={`px-2.5 py-1 rounded-lg border text-[10px] font-medium transition-colors cursor-pointer ${
              !isMultiDay
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            1 Hari
          </button>
          <button
            type="button"
            onClick={() => handleQuickDays(1)}
            className="px-2.5 py-1 rounded-lg border border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-white hover:border-zinc-700 text-[10px] font-medium transition-colors cursor-pointer"
          >
            +1 Hari (2 Hari)
          </button>
          <button
            type="button"
            onClick={() => handleQuickDays(2)}
            className="px-2.5 py-1 rounded-lg border border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-white hover:border-zinc-700 text-[10px] font-medium transition-colors cursor-pointer"
          >
            +2 Hari (3 Hari)
          </button>
          <button
            type="button"
            onClick={() => handleQuickDays(6)}
            className="px-2.5 py-1 rounded-lg border border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-white hover:border-zinc-700 text-[10px] font-medium transition-colors cursor-pointer"
          >
            +6 Hari (1 Minggu)
          </button>
        </div>

        {/* Price & Duration Summary Box */}
        <div className="rounded-2xl border border-zinc-800/90 bg-zinc-950/60 p-4 space-y-2">
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-zinc-400">Durasi Terpilih</span>
            <span className="font-semibold text-white">
              {durationDays} {service.category === 'villa' ? 'Malam' : 'Hari'}
            </span>
          </div>
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-zinc-400">Tarif Satuan</span>
            <span className="text-zinc-300">{formatRupiah(service.price)}</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-zinc-800/80">
            <div>
              <span className="font-bold text-white text-xs block">Estimasi Total Biaya</span>
              <span className="text-[10px] text-zinc-500">
                {durationDays > 1 ? `${durationDays} x ${formatRupiah(service.price)}` : 'Tarif 1 sesi/hari'}
              </span>
            </div>
            <span className="text-base font-black text-amber-400">
              {formatRupiah(estimatedTotal)}
            </span>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label htmlFor={notesId} className="block font-semibold text-zinc-300 mb-1.5">
            Catatan Tambahan / Permintaan Khusus{' '}
            <span className="text-zinc-500 font-normal">(Opsional)</span>
          </label>
          <div className="relative">
            <FileText className="absolute left-3.5 top-3 h-4 w-4 text-zinc-500 pointer-events-none" aria-hidden="true" />
            <textarea
              id={notesId}
              rows={3}
              disabled={isPending}
              placeholder="Contoh: Lokasi antar jemput bandara/hotel, jam kedatangan, preferensi khusus..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 pl-10 pr-4 py-3 text-xs text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 resize-none disabled:opacity-50 transition-all"
            />
          </div>
        </div>

        {/* Trust & Guarantee */}
        <div className="flex items-center gap-2 pt-1 text-[11px] text-zinc-400">
          <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" aria-hidden="true" />
          <span>Data aman & tim Doamandeh akan segera mengonfirmasi ketersediaan.</span>
        </div>

        {/* Submit Button with Loading State */}
        <button
          type="submit"
          disabled={isPending}
          aria-busy={isPending}
          className="w-full flex items-center justify-center gap-2 rounded-2xl bg-amber-500 hover:bg-amber-400 active:scale-[0.99] py-3.5 px-6 text-xs font-bold text-black transition-all shadow-xl shadow-amber-500/20 disabled:opacity-50 mt-4 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              <span>Memproses Permintaan Booking...</span>
            </>
          ) : (
            <>
              <CalendarIcon className="h-4 w-4" aria-hidden="true" />
              <span>Kirim Permintaan Booking</span>
              <ChevronRight className="h-4 w-4 ml-0.5" aria-hidden="true" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
