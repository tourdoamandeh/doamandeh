'use client';

import { useState, useTransition, useId } from 'react';
import { Service, ServiceCategory } from '@/types/database';
import {
  createPublicBookingAction,
  BookingResponseData,
} from '@/lib/actions/public/booking';
import { useToast } from './toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format, startOfDay } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import {
  Calendar as CalendarIcon,
  User,
  Mail,
  Phone,
  MapPin,
  Clock,
  Users,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  MessageCircle,
  RefreshCw,
  Copy,
  Check,
  ArrowUpRight,
  Loader2,
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
  if (isNaN(dateObj.getTime())) return dateStr;
  return new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(dateObj);
}

// Reusable DatePicker with shadcn Calendar + Popover
function BookingDatePicker({
  id,
  label,
  value,
  onChange,
  minDate,
  placeholder = 'Pilih tanggal...',
  error,
  disabled,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (dateStr: string) => void;
  minDate?: Date;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const selectedDate = value ? new Date(value + 'T00:00:00') : undefined;

  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="block text-xs uppercase tracking-wider font-medium text-ink">
        {label} <span className="text-red-500" aria-hidden="true">*</span>
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          render={
            <Button
              id={id}
              type="button"
              variant="outline"
              disabled={disabled}
              className={cn(
                'w-full justify-start text-left font-normal h-10 text-xs rounded-none border-line bg-paper text-ink shadow-none hover:bg-foam hover:border-line focus-visible:ring-1 focus-visible:ring-ocean',
                !value && 'text-ink/40'
              )}
            >
              <CalendarIcon className="mr-2.5 size-4 shrink-0 text-ink/50" />
              {selectedDate && !isNaN(selectedDate.getTime()) ? (
                <span className="font-mono text-ink font-medium">
                  {format(selectedDate, 'EEEE, d MMM yyyy', { locale: idLocale })}
                </span>
              ) : (
                <span>{placeholder}</span>
              )}
            </Button>
          }
        />
        <PopoverContent
          className="w-auto p-0 z-50 bg-paper border border-line rounded-none shadow-xl text-ink"
          align="start"
        >
          <Calendar
            mode="single"
            locale={idLocale}
            selected={selectedDate}
            disabled={minDate ? { before: minDate } : { before: startOfDay(new Date()) }}
            onSelect={(date) => {
              if (date) {
                const y = date.getFullYear();
                const m = String(date.getMonth() + 1).padStart(2, '0');
                const d = String(date.getDate()).padStart(2, '0');
                onChange(`${y}-${m}-${d}`);
                setOpen(false);
              }
            }}
          />
        </PopoverContent>
      </Popover>
      {error && (
        <p role="alert" className="text-[11px] text-red-600 mt-1 flex items-center gap-1 font-mono">
          <AlertCircle className="size-3" strokeWidth={1.5} />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}

export function BookingForm({ service }: BookingFormProps) {
  const { success: showToastSuccess, error: showToastError, info: showToastInfo } = useToast();
  const [isPending, startTransition] = useTransition();

  const category: ServiceCategory = service.category;
  const isMultiDay = category === 'vehicle-rental' || category === 'villa';

  // Accessibility IDs
  const nameId = useId();
  const emailId = useId();
  const phoneId = useId();
  const startDateId = useId();
  const endDateId = useId();
  const notesId = useId();

  // Common customer fields
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  // Date states
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Category specific fields
  // 1. Vehicle Rental
  const [pickupLocation, setPickupLocation] = useState('');
  const [pickupTime, setPickupTime] = useState('');

  // 2. Villa Stay
  const [guestCount, setGuestCount] = useState('2 Tamu');
  const [arrivalTime, setArrivalTime] = useState('');

  // 3. Travel / Tour
  const [participantCount, setParticipantCount] = useState('2');
  const [pickupHotel, setPickupHotel] = useState('');

  // 4. Tattoo Studio
  const [placementSize, setPlacementSize] = useState('');
  const [tattooStyle, setTattooStyle] = useState('');
  const [designIdea, setDesignIdea] = useState('');

  // 5. Surfing Lesson
  const [sessionTime, setSessionTime] = useState<'Pagi' | 'Sore'>('Pagi');
  const [skillLevel, setSkillLevel] = useState<'Pemula' | 'Menengah'>('Pemula');
  const [surfPax, setSurfPax] = useState('1');

  // General notes
  const [generalNotes, setGeneralNotes] = useState('');

  // UI state
  const [copiedRef, setCopiedRef] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [completedBooking, setCompletedBooking] = useState<BookingResponseData | null>(null);

  // Duration & Price Calculations
  let durationUnits = 1;
  let durationLabel = '1 Hari';

  if (category === 'villa') {
    if (startDate && endDate && endDate > startDate) {
      const startMs = new Date(startDate).getTime();
      const endMs = new Date(endDate).getTime();
      durationUnits = Math.max(1, Math.round((endMs - startMs) / (1000 * 60 * 60 * 24)));
    }
    durationLabel = `${durationUnits} Malam`;
  } else if (category === 'vehicle-rental') {
    if (startDate && endDate && endDate >= startDate) {
      const startMs = new Date(startDate).getTime();
      const endMs = new Date(endDate).getTime();
      durationUnits = Math.max(1, Math.round((endMs - startMs) / (1000 * 60 * 60 * 24)) + 1);
    }
    durationLabel = `${durationUnits} Hari`;
  } else if (category === 'travel') {
    durationUnits = Math.max(1, parseInt(participantCount) || 1);
    durationLabel = `${durationUnits} Peserta`;
  } else if (category === 'surfing-lesson') {
    durationUnits = Math.max(1, parseInt(surfPax) || 1);
    durationLabel = `${durationUnits} Peserta (Sesi ${sessionTime})`;
  } else if (category === 'tattoo') {
    durationUnits = 1;
    durationLabel = 'Sesi Konsultasi & Pengerjaan';
  }

  const estimatedTotal =
    category === 'tattoo'
      ? Number(service.price)
      : Number(service.price) * durationUnits;

  // Compile structured notes for database
  const compileStructuredNotes = (): string => {
    const lines: string[] = [];

    if (category === 'vehicle-rental') {
      if (pickupLocation.trim()) lines.push(`• Lokasi Antar/Jemput: ${pickupLocation.trim()}`);
      if (pickupTime.trim()) lines.push(`• Jam Pengantaran: ${pickupTime.trim()}`);
    } else if (category === 'villa') {
      if (guestCount.trim()) lines.push(`• Jumlah Tamu: ${guestCount.trim()}`);
      if (arrivalTime.trim()) lines.push(`• Estimasi Jam Tiba: ${arrivalTime.trim()}`);
    } else if (category === 'travel') {
      if (participantCount.trim()) lines.push(`• Jumlah Peserta: ${participantCount.trim()} orang`);
      if (pickupHotel.trim()) lines.push(`• Penjemputan Hotel/Villa: ${pickupHotel.trim()}`);
    } else if (category === 'tattoo') {
      if (placementSize.trim()) lines.push(`• Ukuran & Penempatan: ${placementSize.trim()}`);
      if (tattooStyle.trim()) lines.push(`• Gaya Tato: ${tattooStyle.trim()}`);
      if (designIdea.trim()) lines.push(`• Deskripsi Desain: ${designIdea.trim()}`);
    } else if (category === 'surfing-lesson') {
      lines.push(`• Waktu Sesi: Sesi ${sessionTime} (${sessionTime === 'Pagi' ? '08:00 - 10:00 WITA' : '15:00 - 17:00 WITA'})`);
      lines.push(`• Pengalaman: ${skillLevel === 'Pemula' ? 'Pemula (Baru pertama kali)' : 'Menengah (Sudah bisa berdiri)'}`);
      if (surfPax.trim()) lines.push(`• Jumlah Peserta: ${surfPax.trim()} orang`);
    }

    if (generalNotes.trim()) {
      lines.push(`• Catatan Tambahan: ${generalNotes.trim()}`);
    }

    return lines.join('\n');
  };

  const handleReset = () => {
    setCompletedBooking(null);
    setStartDate('');
    setEndDate('');
    setGeneralNotes('');
    setErrorMessage(null);
    setFieldErrors({});
  };

  const handleCopyReference = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedRef(true);
    showToastInfo('Kode referensi booking disalin ke clipboard');
    setTimeout(() => setCopiedRef(false), 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setFieldErrors({});

    // Basic client validation
    const errors: Record<string, string> = {};
    if (!customerName.trim()) errors.customerName = 'Nama lengkap wajib diisi.';
    if (!customerEmail.trim()) {
      errors.customerEmail = 'Alamat email wajib diisi.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
      errors.customerEmail = 'Format email tidak valid.';
    }
    if (!customerPhone.trim()) {
      errors.customerPhone = 'Nomor WhatsApp wajib diisi.';
    } else if (!/^[0-9+\s\-()]{8,20}$/.test(customerPhone.trim())) {
      errors.customerPhone = 'Nomor WhatsApp minimal 8 digit.';
    }

    if (!startDate) {
      errors.startDate = isMultiDay ? 'Tanggal mulai wajib dipilih.' : 'Tanggal pemesanan wajib dipilih.';
    }

    if (isMultiDay) {
      if (!endDate) {
        errors.endDate = 'Tanggal selesai wajib dipilih.';
      } else if (endDate < startDate) {
        errors.endDate = 'Tanggal selesai tidak boleh sebelum tanggal mulai.';
      }
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setErrorMessage('Harap lengkapi semua kolom wajib.');
      return;
    }

    startTransition(async () => {
      const structuredNotes = compileStructuredNotes();

      const res = await createPublicBookingAction({
        serviceId: service.id,
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        customerPhone: customerPhone.trim(),
        startDate,
        endDate: isMultiDay ? endDate : startDate,
        notes: structuredNotes,
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
          'Reservasi Terkirim',
          'Permintaan booking Anda telah tercatat. Silakan konfirmasi via WhatsApp untuk respon instan.'
        );
      }
    });
  };

  // --- CONFIRMATION SCREEN ---
  if (completedBooking) {
    const bookingDateDisplay =
      completedBooking.endDate && completedBooking.endDate !== completedBooking.startDate
        ? `${formatDateIndo(completedBooking.startDate)} s/d ${formatDateIndo(completedBooking.endDate)}`
        : formatDateIndo(completedBooking.startDate);

    const waMessage =
      `Halo Do'amandeh Tours and Travel,\n\n` +
      `Saya telah melakukan booking layanan melalui website resmi:\n\n` +
      `• *ID Booking*: #${completedBooking.id.slice(0, 8).toUpperCase()}\n` +
      `• *Layanan*: ${completedBooking.serviceTitle}\n` +
      `• *Nama Pemesan*: ${completedBooking.customerName}\n` +
      `• *No. WhatsApp*: ${completedBooking.customerPhone}\n` +
      `• *Email*: ${completedBooking.customerEmail}\n` +
      `• *Jadwal*: ${bookingDateDisplay}\n` +
      `• *Estimasi Total*: ${completedBooking.totalPrice ? formatRupiah(completedBooking.totalPrice) : '-'}\n` +
      (completedBooking.notes ? `\n*Rincian Permintaan*:\n${completedBooking.notes}\n` : '') +
      `\nMohon konfirmasi ketersediaan dan proses pemesanan saya. Terima kasih!`;

    const waLink = `https://wa.me/6281234567890?text=${encodeURIComponent(waMessage)}`;

    return (
      <Card className="rounded-none border border-line bg-paper text-ink shadow-none font-sans p-6 sm:p-8 space-y-6">
        <CardHeader className="p-0 text-center space-y-3">
          <div className="mx-auto flex size-14 items-center justify-center rounded-none bg-sun text-ink border border-line">
            <CheckCircle2 className="size-7" strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest font-mono text-ocean mb-1">
              // RESERVASI DITERIMA
            </p>
            <CardTitle className="text-2xl sm:text-3xl font-medium tracking-tight text-ink">
              Permintaan Booking Berhasil!
            </CardTitle>
          </div>
          <CardDescription className="text-xs text-ink/75 font-light leading-relaxed max-w-md mx-auto">
            Terima kasih, <strong className="text-ink font-medium">{completedBooking.customerName}</strong>. Tim kami akan segera meninjau jadwal dan ketersediaan layanan Anda.
          </CardDescription>
        </CardHeader>

        {/* Booking Details Box */}
        <Card className="rounded-none border border-line bg-foam p-5 text-xs space-y-3.5 shadow-none">
          <div className="flex items-center justify-between pb-3 border-b border-line">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-ink/50 block font-mono">
                ID REFERENSI
              </span>
              <Badge
                variant="outline"
                className="font-mono text-sm font-semibold tracking-wider text-ink border-0 p-0 bg-transparent"
              >
                #{completedBooking.id.slice(0, 8).toUpperCase()}
              </Badge>
            </div>
            <Button
              type="button"
              variant="outline"
              size="xs"
              onClick={() => handleCopyReference(completedBooking.id)}
              className="rounded-none border-line bg-paper hover:bg-sun text-ink text-[11px] font-mono shadow-none h-7 px-2.5"
            >
              {copiedRef ? (
                <>
                  <Check className="size-3 text-ocean mr-1" strokeWidth={1.5} />
                  <span>Tersalin</span>
                </>
              ) : (
                <>
                  <Copy className="size-3 mr-1" strokeWidth={1.5} />
                  <span>Salin ID</span>
                </>
              )}
            </Button>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-start">
              <span className="text-ink/60">Layanan</span>
              <span className="font-medium text-ink text-right">{completedBooking.serviceTitle}</span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-ink/60">Jadwal</span>
              <span className="text-ink font-medium text-right">{bookingDateDisplay}</span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-ink/60">WhatsApp</span>
              <span className="text-ink font-mono">{completedBooking.customerPhone}</span>
            </div>
            <Separator className="bg-line" />
            <div className="flex justify-between items-center pt-1">
              <span className="font-medium text-ink">Estimasi Biaya</span>
              <span className="text-base font-semibold text-ink font-mono">
                {completedBooking.totalPrice ? formatRupiah(completedBooking.totalPrice) : '-'}
              </span>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <CardFooter className="p-0 flex flex-col gap-3">
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 bg-ink text-paper hover:bg-ocean transition-colors font-medium uppercase tracking-widest text-xs py-3.5 px-4 rounded-none border-0 text-center"
          >
            <MessageCircle className="size-4" strokeWidth={1.5} />
            <span>Konfirmasi Cepat via WhatsApp</span>
          </a>

          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            className="w-full rounded-none border-line text-xs uppercase tracking-widest font-medium py-3 hover:bg-foam h-auto"
          >
            <RefreshCw className="size-3.5 mr-2" strokeWidth={1.5} />
            Buat Reservasi Baru
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // --- ACTIVE BOOKING FORM ---
  const getCategoryTitle = () => {
    switch (category) {
      case 'vehicle-rental':
        return 'Form Sewa Kendaraan';
      case 'villa':
        return 'Reservasi Villa Stay';
      case 'travel':
        return 'Booking Tour & Trip';
      case 'tattoo':
        return 'Booking Sesi Tato Studio';
      case 'surfing-lesson':
        return 'Booking Kelas Selancar';
      default:
        return 'Formulir Reservasi';
    }
  };

  return (
    <Card
      role="region"
      aria-label="Formulir Reservasi Layanan"
      className="rounded-none border border-line bg-foam text-ink shadow-none p-0 overflow-hidden font-sans"
    >
      {/* Header */}
      <CardHeader className="border-b border-line p-6 sm:p-7 flex flex-row items-start justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-widest font-mono text-ocean mb-1">
            // PESAN ONLINE
          </p>
          <CardTitle className="text-2xl sm:text-3xl font-medium tracking-tight text-ink font-sans">
            {getCategoryTitle()}
          </CardTitle>
          <CardDescription className="text-xs text-ink/70 font-light mt-1">
            Isi formulir ringkas berikut untuk reservasi langsung &amp; konfirmasi via WhatsApp.
          </CardDescription>
        </div>
        <div className="text-right shrink-0">
          <span className="text-[10px] uppercase tracking-widest text-ink/50 block font-mono">
            TARIF
          </span>
          <span className="text-xl sm:text-2xl font-medium text-ink font-mono tracking-tight block">
            {formatRupiah(service.price)}
          </span>
          <Badge
            variant="outline"
            className="rounded-none border-line bg-paper text-ink/80 text-[10px] font-mono py-0.5 px-2 mt-1"
          >
            /{service.unit?.replace(/^per\s+/i, '') || (category === 'villa' ? 'malam' : 'hari')}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-6 sm:p-7 space-y-5">
        {/* Error Alert Banner */}
        {errorMessage && (
          <Alert
            variant="destructive"
            className="rounded-none border-red-300 bg-paper text-red-900"
          >
            <AlertCircle className="size-4 text-red-600" strokeWidth={1.5} />
            <AlertTitle className="font-semibold text-red-950">Gagal Mengirim Form</AlertTitle>
            <AlertDescription className="text-red-800">{errorMessage}</AlertDescription>
          </Alert>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-4 text-xs">
          {/* 1. DATA PEMESAN */}
          <div className="space-y-4">
            <div>
              <Label htmlFor={nameId} className="block text-xs uppercase tracking-wider font-medium text-ink mb-1.5">
                Nama Lengkap <span className="text-red-500" aria-hidden="true">*</span>
              </Label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-ink/40 pointer-events-none" strokeWidth={1.5} aria-hidden="true" />
                <Input
                  id={nameId}
                  type="text"
                  required
                  disabled={isPending}
                  placeholder="Contoh: Budi Santoso"
                  value={customerName}
                  onChange={(e) => {
                    setCustomerName(e.target.value);
                    if (fieldErrors.customerName) setFieldErrors((p) => ({ ...p, customerName: '' }));
                  }}
                  className="pl-10 text-xs rounded-none border-line bg-paper text-ink placeholder:text-ink/40 shadow-none focus-visible:ring-1 focus-visible:ring-ocean h-10"
                />
              </div>
              {fieldErrors.customerName && (
                <p role="alert" className="text-[11px] text-red-600 mt-1 flex items-center gap-1 font-mono">
                  <AlertCircle className="size-3" strokeWidth={1.5} />
                  <span>{fieldErrors.customerName}</span>
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor={phoneId} className="block text-xs uppercase tracking-wider font-medium text-ink mb-1.5">
                  No. WhatsApp <span className="text-red-500" aria-hidden="true">*</span>
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-ink/40 pointer-events-none" strokeWidth={1.5} aria-hidden="true" />
                  <Input
                    id={phoneId}
                    type="tel"
                    required
                    disabled={isPending}
                    placeholder="0812-3456-7890"
                    value={customerPhone}
                    onChange={(e) => {
                      setCustomerPhone(e.target.value);
                      if (fieldErrors.customerPhone) setFieldErrors((p) => ({ ...p, customerPhone: '' }));
                    }}
                    className="pl-10 text-xs rounded-none border-line bg-paper text-ink placeholder:text-ink/40 shadow-none focus-visible:ring-1 focus-visible:ring-ocean h-10 font-mono"
                  />
                </div>
                {fieldErrors.customerPhone && (
                  <p role="alert" className="text-[11px] text-red-600 mt-1 flex items-center gap-1 font-mono">
                    <AlertCircle className="size-3" strokeWidth={1.5} />
                    <span>{fieldErrors.customerPhone}</span>
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor={emailId} className="block text-xs uppercase tracking-wider font-medium text-ink mb-1.5">
                  Alamat Email <span className="text-red-500" aria-hidden="true">*</span>
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-ink/40 pointer-events-none" strokeWidth={1.5} aria-hidden="true" />
                  <Input
                    id={emailId}
                    type="email"
                    required
                    disabled={isPending}
                    placeholder="nama@email.com"
                    value={customerEmail}
                    onChange={(e) => {
                      setCustomerEmail(e.target.value);
                      if (fieldErrors.customerEmail) setFieldErrors((p) => ({ ...p, customerEmail: '' }));
                    }}
                    className="pl-10 text-xs rounded-none border-line bg-paper text-ink placeholder:text-ink/40 shadow-none focus-visible:ring-1 focus-visible:ring-ocean h-10"
                  />
                </div>
                {fieldErrors.customerEmail && (
                  <p role="alert" className="text-[11px] text-red-600 mt-1 flex items-center gap-1 font-mono">
                    <AlertCircle className="size-3" strokeWidth={1.5} />
                    <span>{fieldErrors.customerEmail}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          <Separator className="bg-line my-1" />

          {/* 2. JADWAL (Menggunakan shadcn Calendar & Popover) */}
          {isMultiDay ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <BookingDatePicker
                id={startDateId}
                label={category === 'villa' ? 'Tanggal Check-in' : 'Mulai Sewa'}
                value={startDate}
                onChange={(val) => {
                  setStartDate(val);
                  if (fieldErrors.startDate) setFieldErrors((p) => ({ ...p, startDate: '' }));
                  if (endDate && val && endDate < val) {
                    setEndDate(val);
                  }
                }}
                error={fieldErrors.startDate}
                disabled={isPending}
                placeholder="Pilih tgl mulai"
              />

              <BookingDatePicker
                id={endDateId}
                label={category === 'villa' ? 'Tanggal Check-out' : 'Selesai Sewa'}
                value={endDate}
                minDate={startDate ? new Date(startDate + 'T00:00:00') : startOfDay(new Date())}
                onChange={(val) => {
                  setEndDate(val);
                  if (fieldErrors.endDate) setFieldErrors((p) => ({ ...p, endDate: '' }));
                }}
                error={fieldErrors.endDate}
                disabled={isPending || !startDate}
                placeholder="Pilih tgl selesai"
              />
            </div>
          ) : (
            <div>
              <BookingDatePicker
                id={startDateId}
                label={
                  category === 'tattoo'
                    ? 'Tanggal Sesi Tato'
                    : category === 'surfing-lesson'
                    ? 'Tanggal Kelas Selancar'
                    : 'Tanggal Tour'
                }
                value={startDate}
                onChange={(val) => {
                  setStartDate(val);
                  if (fieldErrors.startDate) setFieldErrors((p) => ({ ...p, startDate: '' }));
                }}
                error={fieldErrors.startDate}
                disabled={isPending}
                placeholder="Pilih tanggal jadwal..."
              />
            </div>
          )}

          {/* 3. FIELD KHUSUS SESUAI LAYANAN (100% Relevan) */}

          {/* A. SEWA KENDARAAN */}
          {category === 'vehicle-rental' && (
            <div className="space-y-4 pt-1">
              <div>
                <Label htmlFor="rental-pickup-location" className="block text-xs uppercase tracking-wider font-medium text-ink mb-1.5">
                  Lokasi Antar / Penjemputan Unit <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-ink/40 pointer-events-none" strokeWidth={1.5} />
                  <Input
                    id="rental-pickup-location"
                    type="text"
                    required
                    disabled={isPending}
                    placeholder="Contoh: Bandara Ngurah Rai, Hotel di Seminyak, Villa di Canggu"
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    className="pl-10 text-xs rounded-none border-line bg-paper text-ink placeholder:text-ink/40 shadow-none focus-visible:ring-1 focus-visible:ring-ocean h-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="rental-pickup-time" className="block text-xs uppercase tracking-wider font-medium text-ink mb-1.5">
                  Estimasi Jam Antar Unit <span className="text-ink/40 text-[10px] font-mono lowercase">(opsional)</span>
                </Label>
                <div className="relative">
                  <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-ink/40 pointer-events-none" strokeWidth={1.5} />
                  <Input
                    id="rental-pickup-time"
                    type="text"
                    disabled={isPending}
                    placeholder="Contoh: 10:00 WITA / sesuai jam mendarat pesawat"
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    className="pl-10 text-xs rounded-none border-line bg-paper text-ink placeholder:text-ink/40 shadow-none focus-visible:ring-1 focus-visible:ring-ocean h-10"
                  />
                </div>
              </div>
            </div>
          )}

          {/* B. VILLA STAY */}
          {category === 'villa' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <Label htmlFor="villa-guests" className="block text-xs uppercase tracking-wider font-medium text-ink mb-1.5">
                  Jumlah Tamu <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-ink/40 pointer-events-none" strokeWidth={1.5} />
                  <Input
                    id="villa-guests"
                    type="text"
                    required
                    disabled={isPending}
                    placeholder="Contoh: 2 Dewasa, 1 Anak"
                    value={guestCount}
                    onChange={(e) => setGuestCount(e.target.value)}
                    className="pl-10 text-xs rounded-none border-line bg-paper text-ink placeholder:text-ink/40 shadow-none focus-visible:ring-1 focus-visible:ring-ocean h-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="villa-arrival" className="block text-xs uppercase tracking-wider font-medium text-ink mb-1.5">
                  Estimasi Jam Tiba <span className="text-ink/40 text-[10px] font-mono lowercase">(opsional)</span>
                </Label>
                <div className="relative">
                  <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-ink/40 pointer-events-none" strokeWidth={1.5} />
                  <Input
                    id="villa-arrival"
                    type="text"
                    disabled={isPending}
                    placeholder="Contoh: 14:00 WITA"
                    value={arrivalTime}
                    onChange={(e) => setArrivalTime(e.target.value)}
                    className="pl-10 text-xs rounded-none border-line bg-paper text-ink placeholder:text-ink/40 shadow-none focus-visible:ring-1 focus-visible:ring-ocean h-10"
                  />
                </div>
              </div>
            </div>
          )}

          {/* C. TOUR & TRIP */}
          {category === 'travel' && (
            <div className="space-y-4 pt-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tour-participants" className="block text-xs uppercase tracking-wider font-medium text-ink mb-1.5">
                    Jumlah Peserta (Pax) <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-ink/40 pointer-events-none" strokeWidth={1.5} />
                    <Input
                      id="tour-participants"
                      type="number"
                      min="1"
                      required
                      disabled={isPending}
                      placeholder="2"
                      value={participantCount}
                      onChange={(e) => setParticipantCount(e.target.value)}
                      className="pl-10 text-xs rounded-none border-line bg-paper text-ink placeholder:text-ink/40 shadow-none focus-visible:ring-1 focus-visible:ring-ocean h-10 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="tour-pickup-hotel" className="block text-xs uppercase tracking-wider font-medium text-ink mb-1.5">
                    Nama Hotel / Villa Penjemputan <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-ink/40 pointer-events-none" strokeWidth={1.5} />
                    <Input
                      id="tour-pickup-hotel"
                      type="text"
                      required
                      disabled={isPending}
                      placeholder="Contoh: Lobby Hotel Padma Ubud / Villa Seminyak"
                      value={pickupHotel}
                      onChange={(e) => setPickupHotel(e.target.value)}
                      className="pl-10 text-xs rounded-none border-line bg-paper text-ink placeholder:text-ink/40 shadow-none focus-visible:ring-1 focus-visible:ring-ocean h-10"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* D. TATTOO STUDIO */}
          {category === 'tattoo' && (
            <div className="space-y-4 pt-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tattoo-placement" className="block text-xs uppercase tracking-wider font-medium text-ink mb-1.5">
                    Ukuran &amp; Penempatan Tubuh <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="tattoo-placement"
                    type="text"
                    required
                    disabled={isPending}
                    placeholder="Contoh: 8x8 cm di lengan bagian dalam / leher"
                    value={placementSize}
                    onChange={(e) => setPlacementSize(e.target.value)}
                    className="text-xs rounded-none border-line bg-paper text-ink placeholder:text-ink/40 shadow-none focus-visible:ring-1 focus-visible:ring-ocean h-10"
                  />
                </div>

                <div>
                  <Label htmlFor="tattoo-style" className="block text-xs uppercase tracking-wider font-medium text-ink mb-1.5">
                    Gaya Tato yang Diinginkan <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="tattoo-style"
                    type="text"
                    required
                    disabled={isPending}
                    placeholder="Contoh: Fine Line, Blackwork, Realism, Script"
                    value={tattooStyle}
                    onChange={(e) => setTattooStyle(e.target.value)}
                    className="text-xs rounded-none border-line bg-paper text-ink placeholder:text-ink/40 shadow-none focus-visible:ring-1 focus-visible:ring-ocean h-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="tattoo-idea" className="block text-xs uppercase tracking-wider font-medium text-ink mb-1.5">
                  Ide Konsep Desain <span className="text-ink/40 text-[10px] font-mono lowercase">(opsional)</span>
                </Label>
                <Textarea
                  id="tattoo-idea"
                  rows={2}
                  disabled={isPending}
                  placeholder="Ceritakan ide tato, makna simbolis, atau jika sudah punya referensi gambar (bisa dikirim via WA)..."
                  value={designIdea}
                  onChange={(e) => setDesignIdea(e.target.value)}
                  className="text-xs rounded-none border-line bg-paper text-ink placeholder:text-ink/40 shadow-none focus-visible:ring-1 focus-visible:ring-ocean resize-y min-h-[70px]"
                />
              </div>
            </div>
          )}

          {/* E. SURFING LESSON */}
          {category === 'surfing-lesson' && (
            <div className="space-y-4 pt-1">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Session Time Toggle */}
                <div>
                  <Label className="block text-xs uppercase tracking-wider font-medium text-ink mb-1.5">
                    Pilihan Waktu
                  </Label>
                  <div className="grid grid-cols-2 gap-1 bg-paper border border-line p-1">
                    <Button
                      type="button"
                      variant={sessionTime === 'Pagi' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setSessionTime('Pagi')}
                      className={`rounded-none h-8 text-[11px] shadow-none ${
                        sessionTime === 'Pagi' ? 'bg-ink text-paper' : 'text-ink hover:bg-foam'
                      }`}
                    >
                      Pagi (08:00)
                    </Button>
                    <Button
                      type="button"
                      variant={sessionTime === 'Sore' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setSessionTime('Sore')}
                      className={`rounded-none h-8 text-[11px] shadow-none ${
                        sessionTime === 'Sore' ? 'bg-ink text-paper' : 'text-ink hover:bg-foam'
                      }`}
                    >
                      Sore (15:00)
                    </Button>
                  </div>
                </div>

                {/* Skill Level Toggle */}
                <div>
                  <Label className="block text-xs uppercase tracking-wider font-medium text-ink mb-1.5">
                    Tingkat Pengalaman
                  </Label>
                  <div className="grid grid-cols-2 gap-1 bg-paper border border-line p-1">
                    <Button
                      type="button"
                      variant={skillLevel === 'Pemula' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setSkillLevel('Pemula')}
                      className={`rounded-none h-8 text-[11px] shadow-none ${
                        skillLevel === 'Pemula' ? 'bg-ink text-paper' : 'text-ink hover:bg-foam'
                      }`}
                    >
                      Pemula
                    </Button>
                    <Button
                      type="button"
                      variant={skillLevel === 'Menengah' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setSkillLevel('Menengah')}
                      className={`rounded-none h-8 text-[11px] shadow-none ${
                        skillLevel === 'Menengah' ? 'bg-ink text-paper' : 'text-ink hover:bg-foam'
                      }`}
                    >
                      Menengah
                    </Button>
                  </div>
                </div>

                {/* Participants */}
                <div>
                  <Label htmlFor="surf-pax" className="block text-xs uppercase tracking-wider font-medium text-ink mb-1.5">
                    Peserta (Pax)
                  </Label>
                  <Input
                    id="surf-pax"
                    type="number"
                    min="1"
                    disabled={isPending}
                    value={surfPax}
                    onChange={(e) => setSurfPax(e.target.value)}
                    className="text-xs rounded-none border-line bg-paper text-ink shadow-none focus-visible:ring-1 focus-visible:ring-ocean h-10 font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* CATATAN TAMBAHAN (UMUM) */}
          <div>
            <Label htmlFor={notesId} className="block text-xs uppercase tracking-wider font-medium text-ink mb-1.5">
              Catatan / Permintaan Khusus <span className="text-ink/40 text-[10px] font-mono lowercase">(opsional)</span>
            </Label>
            <Textarea
              id={notesId}
              rows={2}
              disabled={isPending}
              placeholder="Tuliskan jika ada kebutuhan khusus atau pertanyaan tambahan..."
              value={generalNotes}
              onChange={(e) => setGeneralNotes(e.target.value)}
              className="text-xs rounded-none border-line bg-paper text-ink placeholder:text-ink/40 shadow-none focus-visible:ring-1 focus-visible:ring-ocean resize-y min-h-[60px]"
            />
          </div>

          {/* RINGKASAN ESTIMASI HARGA (Clean & Simple) */}
          <Card className="rounded-none border border-line bg-paper p-4 text-ink font-sans space-y-2 shadow-none">
            <div className="flex justify-between items-center text-xs">
              <span className="text-ink/70">Durasi / Satuan</span>
              <Badge variant="outline" className="rounded-none border-line font-mono font-medium bg-foam text-ink">
                {durationLabel}
              </Badge>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-ink/70">Tarif Satuan</span>
              <span className="text-ink font-mono">{formatRupiah(service.price)}</span>
            </div>
            <Separator className="bg-line" />
            <div className="flex justify-between items-center pt-0.5">
              <div>
                <span className="font-medium text-ink text-xs block">
                  {category === 'tattoo' ? 'Estimasi Mulai Dari' : 'Estimasi Total'}
                </span>
                {category === 'tattoo' && (
                  <span className="text-[10px] text-ink/50 font-sans">
                    Biaya final disesuaikan ukuran di studio
                  </span>
                )}
              </div>
              <span className="text-xl font-medium text-ink font-mono tracking-tight">
                {formatRupiah(estimatedTotal)}
              </span>
            </div>
          </Card>

          {/* Trust Guarantee */}
          <div className="flex items-center gap-2 pt-0.5 text-[11px] text-ink/70 font-light">
            <ShieldCheck className="size-4 text-ocean shrink-0" strokeWidth={1.5} aria-hidden="true" />
            <span>Pemesanan aman &amp; konfirmasi langsung terhubung ke admin lokal via WhatsApp.</span>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isPending}
            aria-busy={isPending}
            className="w-full rounded-none bg-ink text-paper hover:bg-ocean transition-colors uppercase tracking-widest font-medium text-xs py-4 px-6 border-0 shadow-none mt-3 cursor-pointer h-auto"
          >
            {isPending ? (
              <>
                <Loader2 className="size-4 animate-spin mr-2" strokeWidth={1.5} aria-hidden="true" />
                <span>Memproses Booking...</span>
              </>
            ) : (
              <>
                <span>Kirim Permintaan Booking</span>
                <ArrowUpRight className="size-4 ml-2" strokeWidth={1.5} aria-hidden="true" />
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
