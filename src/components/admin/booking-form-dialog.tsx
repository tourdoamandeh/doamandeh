'use client';

import { useState, useTransition, useEffect } from 'react';
import { Service, Booking, BookingStatus } from '@/types/database';
import { createBookingAction, updateBookingAction } from '@/lib/actions/admin/bookings';
import { toast } from 'sonner';
import { X, Loader2, AlertCircle, CalendarIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from '@/components/ui/drawer';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface BookingFormDialogProps {
  services: Service[];
  isOpen: boolean;
  onClose: () => void;
  bookingToEdit?: (Booking & { service?: Service | null }) | null;
}

// --- Period & Notes Synchronization Helpers ---

function parsePeriodFromNotes(notesText: string): {
  startDate?: string;
  endDate?: string;
  remainingNotes: string;
} {
  if (!notesText) return { remainingNotes: '' };

  const periodRegex = /\[Periode:\s*(\d{4}-\d{2}-\d{2})(?:\s*s\/d\s*(\d{4}-\d{2}-\d{2}))?(?:\s*\((.*?)\))?\]/i;
  const match = notesText.match(periodRegex);

  if (match) {
    const startDate = match[1];
    const endDate = match[2] || startDate;
    return { startDate, endDate, remainingNotes: notesText };
  }

  return { remainingNotes: notesText };
}

function getDaysDifference(startStr: string, endStr: string): number {
  if (!startStr || !endStr) return 0;
  const s = new Date(startStr + 'T00:00:00').getTime();
  const e = new Date(endStr + 'T00:00:00').getTime();
  if (isNaN(s) || isNaN(e)) return 0;
  return Math.round((e - s) / (1000 * 60 * 60 * 24));
}

function shiftDateByDays(dateStr: string, days: number): string {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  if (isNaN(d.getTime())) return dateStr;
  d.setDate(d.getDate() + days);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function buildPeriodHeader(
  startDate: string,
  endDate: string,
  category?: string,
  unit?: string | null
): string {
  if (!startDate) return '';

  const isNightUnit = category === 'villa' || /malam|night/i.test(unit || '');

  let durationDays = 1;
  if (endDate && endDate >= startDate) {
    const diff = getDaysDifference(startDate, endDate);
    durationDays = isNightUnit ? Math.max(1, diff) : Math.max(1, diff + 1);
  }

  const unitLabel = isNightUnit ? 'malam' : 'hari';

  if (endDate && endDate !== startDate) {
    return `[Periode: ${startDate} s/d ${endDate} (${durationDays} ${unitLabel})]`;
  } else {
    return `[Periode: ${startDate} (${durationDays} ${unitLabel})]`;
  }
}

function updateNotesPeriod(
  currentNotes: string,
  startDate: string,
  endDate: string,
  category?: string,
  unit?: string | null
): string {
  if (!startDate) return currentNotes;

  const newHeader = buildPeriodHeader(startDate, endDate, category, unit);
  const periodRegex = /\[Periode:[^\]]*\]\r?\n?/gi;

  if (periodRegex.test(currentNotes)) {
    const cleanBody = currentNotes.replace(periodRegex, '').trim();
    return newHeader ? `${newHeader}\n${cleanBody}` : cleanBody;
  } else {
    const isMultiDayCategory = category === 'vehicle-rental' || category === 'villa';
    if ((endDate && endDate !== startDate) || isMultiDayCategory) {
      const cleanBody = currentNotes.trim();
      return newHeader ? `${newHeader}\n${cleanBody}` : cleanBody;
    }
    return currentNotes;
  }
}

export function BookingFormDialog({
  services,
  isOpen,
  onClose,
  bookingToEdit,
}: BookingFormDialogProps) {
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [serviceId, setServiceId] = useState<string>(services[0]?.id || '');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<BookingStatus>('pending');
  const [totalPrice, setTotalPrice] = useState('');
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isEndCalendarOpen, setIsEndCalendarOpen] = useState(false);

  useEffect(() => {
    if (bookingToEdit) {
      const sId = bookingToEdit.service_id || bookingToEdit.service?.id || services[0]?.id || '';
      setServiceId(sId);
      setCustomerName(bookingToEdit.customer_name || '');
      setCustomerEmail(bookingToEdit.customer_email || '');
      setCustomerPhone(bookingToEdit.customer_phone || '');
      
      const rawNotes = bookingToEdit.notes || '';
      const parsedPeriod = parsePeriodFromNotes(rawNotes);
      
      const sDate = bookingToEdit.booking_date || parsedPeriod.startDate || '';
      const eDate = parsedPeriod.endDate || sDate;
      
      setBookingDate(sDate);
      setEndDate(eDate);
      setNotes(rawNotes);
      setStatus(bookingToEdit.status || 'pending');
      setTotalPrice(bookingToEdit.total_price != null ? String(bookingToEdit.total_price) : '');
    } else {
      setServiceId(services[0]?.id || '');
      setCustomerName('');
      setCustomerEmail('');
      setCustomerPhone('');
      setBookingDate('');
      setEndDate('');
      setNotes('');
      setStatus('pending');
      setTotalPrice('');
    }
  }, [bookingToEdit, isOpen, services]);

  const selectedService = services.find((s) => s.id === serviceId);
  const category = selectedService?.category;
  const isMultiDay = category === 'vehicle-rental' || category === 'villa' || (!!endDate && endDate !== bookingDate);

  // Synchronize price and notes whenever dates or service changes
  function syncFormAndNotes(
    newStartDate: string,
    newEndDate: string,
    targetServiceId: string,
    currentNotes: string
  ) {
    const svc = services.find((s) => s.id === targetServiceId);
    const cat = svc?.category;
    const unit = svc?.unit;
    const price = svc ? Number(svc.price) : 0;

    const isNightUnit = cat === 'villa' || /malam|night/i.test(unit || '');

    let durationDays = 1;
    if (newStartDate && newEndDate && newEndDate >= newStartDate) {
      const diff = getDaysDifference(newStartDate, newEndDate);
      durationDays = isNightUnit ? Math.max(1, diff) : Math.max(1, diff + 1);
    }

    if (price > 0) {
      const calculated = price * durationDays;
      setTotalPrice(String(calculated));
    }

    if (newStartDate) {
      const updatedNotes = updateNotesPeriod(currentNotes, newStartDate, newEndDate, cat, unit);
      setNotes(updatedNotes);
    }
  }

  function handleStartDateChange(newStartDate: string) {
    let newEndDate = endDate;
    if (bookingDate && endDate && endDate >= bookingDate) {
      const diff = getDaysDifference(bookingDate, endDate);
      newEndDate = shiftDateByDays(newStartDate, diff);
    } else if (!newEndDate || newEndDate < newStartDate) {
      newEndDate = newStartDate;
    }

    setBookingDate(newStartDate);
    setEndDate(newEndDate);
    syncFormAndNotes(newStartDate, newEndDate, serviceId, notes);
  }

  function handleEndDateChange(newEndDate: string) {
    setEndDate(newEndDate);
    syncFormAndNotes(bookingDate, newEndDate, serviceId, notes);
  }

  function handleServiceChange(id: string) {
    setServiceId(id);
    syncFormAndNotes(bookingDate, endDate, id, notes);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);

    if (!serviceId) {
      setErrorMessage('Pilih layanan terlebih dahulu');
      return;
    }

    if (!customerName.trim()) {
      setErrorMessage('Nama customer wajib diisi');
      return;
    }

    if (!customerPhone.trim()) {
      setErrorMessage('Nomor telepon customer wajib diisi');
      return;
    }

    if (!bookingDate) {
      setErrorMessage('Tanggal booking wajib dipilih');
      return;
    }

    const finalNotes = updateNotesPeriod(
      notes,
      bookingDate,
      endDate || bookingDate,
      category,
      selectedService?.unit
    );

    const priceNum = totalPrice ? Number(totalPrice) : undefined;
    const inputData = {
      service_id: serviceId,
      customer_name: customerName.trim(),
      customer_email: customerEmail.trim() || 'customer@guest.local',
      customer_phone: customerPhone.trim(),
      booking_date: bookingDate,
      notes: finalNotes.trim() || null,
      status,
      total_price: priceNum,
    };

    startTransition(async () => {
      const res = bookingToEdit
        ? await updateBookingAction(bookingToEdit.id, inputData)
        : await createBookingAction(inputData);

      if (!res.success) {
        const errText = res.error || (bookingToEdit ? 'Gagal mengedit booking' : 'Gagal membuat booking');
        setErrorMessage(errText);
        toast.error(errText);
      } else {
        toast.success(
          bookingToEdit
            ? `Data booking "${customerName.trim()}" berhasil diperbarui`
            : `Booking manual untuk "${customerName.trim()}" berhasil disimpan`
        );
        onClose();
      }
    });
  }

  return (
    <Drawer
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      swipeDirection="right"
    >
      <DrawerContent className="sm:max-w-xl [--drawer-content-width:100%] sm:[--drawer-content-width:32rem] bg-card text-foreground font-sans border-l border-border flex flex-col h-screen max-h-screen">
        {/* Header */}
        <DrawerHeader className="px-6 py-4 border-b border-border flex flex-row items-center justify-between shrink-0">
          <div>
            <DrawerTitle className="text-base font-semibold text-foreground">
              {bookingToEdit ? 'Edit Data Booking' : 'Input Booking Manual'}
            </DrawerTitle>
            <DrawerDescription className="text-xs text-muted-foreground mt-0.5">
              {bookingToEdit
                ? 'Perbarui detail informasi reservasi dan layanan pelanggan.'
                : 'Tambah catatan reservasi pelanggan langsung dari dashboard admin.'}
            </DrawerDescription>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="size-8 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </DrawerHeader>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
            {errorMessage && (
              <div className="flex items-start gap-2.5 rounded bg-destructive/10 border border-destructive/20 p-3 text-xs text-destructive">
                <AlertCircle className="size-4 shrink-0 mt-0.5" />
                <span className="font-medium">{errorMessage}</span>
              </div>
            )}

            {/* Service Selection */}
            <div className="space-y-1.5">
              <Label htmlFor="service_id" className="text-xs font-medium">
                Pilih Layanan *
              </Label>
              <select
                id="service_id"
                value={serviceId}
                onChange={(e) => handleServiceChange(e.target.value)}
                required
                className="w-full h-9 rounded border border-border bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer"
              >
                <option value="" disabled>Pilih layanan...</option>
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title} ({s.category})
                  </option>
                ))}
              </select>
            </div>

            {/* Customer Name */}
            <div className="space-y-1.5">
              <Label htmlFor="customer_name" className="text-xs font-medium">
                Nama Pelanggan *
              </Label>
              <Input
                id="customer_name"
                type="text"
                required
                placeholder="Contoh: Budi Santoso"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="h-9 text-xs"
              />
            </div>

            {/* Email & Phone Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="customer_email" className="text-xs font-medium">
                  Alamat Email *
                </Label>
                <Input
                  id="customer_email"
                  type="email"
                  required
                  placeholder="customer@email.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="customer_phone" className="text-xs font-medium">
                  No. Telepon / WhatsApp *
                </Label>
                <Input
                  id="customer_phone"
                  type="tel"
                  required
                  placeholder="08123456789"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="h-9 text-xs font-mono"
                />
              </div>
            </div>

            {/* Date & Price Grid */}
            <div className={cn('grid gap-3', isMultiDay ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2')}>
              {/* Start Date Picker */}
              <div className="space-y-1.5">
                <Label htmlFor="booking_date" className="text-xs font-medium">
                  {isMultiDay ? 'Tgl Mulai / Check-in *' : 'Tanggal Booking *'}
                </Label>
                <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                  <PopoverTrigger
                    render={
                      <Button
                        id="booking_date"
                        type="button"
                        variant="outline"
                        className={cn(
                          'w-full justify-start text-left font-normal h-9 text-xs bg-background border-border',
                          !bookingDate && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className="mr-2 size-4 shrink-0 text-muted-foreground" />
                        {bookingDate ? (
                          <span className="font-mono text-foreground font-medium">
                            {format(new Date(bookingDate + 'T00:00:00'), 'dd MMM yyyy')}
                          </span>
                        ) : (
                          <span>Pilih tanggal...</span>
                        )}
                      </Button>
                    }
                  />
                  <PopoverContent className="w-auto p-0 z-50 bg-card border border-border shadow-xl rounded-lg" align="start">
                    <Calendar
                      mode="single"
                      selected={bookingDate ? new Date(bookingDate + 'T00:00:00') : undefined}
                      onSelect={(date) => {
                        if (date) {
                          const y = date.getFullYear();
                          const m = String(date.getMonth() + 1).padStart(2, '0');
                          const d = String(date.getDate()).padStart(2, '0');
                          handleStartDateChange(`${y}-${m}-${d}`);
                          setIsCalendarOpen(false);
                        }
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* End Date Picker (For multi-day or rental/villa) */}
              {isMultiDay && (
                <div className="space-y-1.5">
                  <Label htmlFor="end_date" className="text-xs font-medium">
                    Tgl Selesai / Check-out
                  </Label>
                  <Popover open={isEndCalendarOpen} onOpenChange={setIsEndCalendarOpen}>
                    <PopoverTrigger
                      render={
                        <Button
                          id="end_date"
                          type="button"
                          variant="outline"
                          className={cn(
                            'w-full justify-start text-left font-normal h-9 text-xs bg-background border-border',
                            !endDate && 'text-muted-foreground'
                          )}
                        >
                          <CalendarIcon className="mr-2 size-4 shrink-0 text-muted-foreground" />
                          {endDate ? (
                            <span className="font-mono text-foreground font-medium">
                              {format(new Date(endDate + 'T00:00:00'), 'dd MMM yyyy')}
                            </span>
                          ) : (
                            <span>Pilih tanggal...</span>
                          )}
                        </Button>
                      }
                    />
                    <PopoverContent className="w-auto p-0 z-50 bg-card border border-border shadow-xl rounded-lg" align="start">
                      <Calendar
                        mode="single"
                        selected={endDate ? new Date(endDate + 'T00:00:00') : undefined}
                        disabled={bookingDate ? { before: new Date(bookingDate + 'T00:00:00') } : undefined}
                        onSelect={(date) => {
                          if (date) {
                            const y = date.getFullYear();
                            const m = String(date.getMonth() + 1).padStart(2, '0');
                            const d = String(date.getDate()).padStart(2, '0');
                            handleEndDateChange(`${y}-${m}-${d}`);
                            setIsEndCalendarOpen(false);
                          }
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              )}

              {/* Price */}
              <div className="space-y-1.5">
                <Label htmlFor="total_price" className="text-xs font-medium">
                  Total Biaya (IDR)
                </Label>
                <Input
                  id="total_price"
                  type="number"
                  min="0"
                  placeholder="350000"
                  value={totalPrice}
                  onChange={(e) => setTotalPrice(e.target.value)}
                  className="h-9 text-xs font-mono tabular-nums"
                />
              </div>
            </div>

            {/* Status Selection */}
            <div className="space-y-1.5">
              <Label htmlFor="initial_status" className="text-xs font-medium">
                Status Awal
              </Label>
              <select
                id="initial_status"
                value={status}
                onChange={(e) => setStatus(e.target.value as BookingStatus)}
                className="w-full h-9 rounded border border-border bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer"
              >
                <option value="pending">Pending (Menunggu)</option>
                <option value="confirmed">Confirmed (Dikonfirmasi)</option>
                <option value="completed">Completed (Selesai)</option>
                <option value="cancelled">Cancelled (Dibatalkan)</option>
              </select>
            </div>

            {/* Notes */}
            <div className="space-y-1.5">
              <Label htmlFor="notes" className="text-xs font-medium">
                Catatan Khusus
              </Label>
              <textarea
                id="notes"
                rows={4}
                placeholder="Permintaan penjemputan, spesifikasi kustom..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full rounded border border-border bg-background px-3 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring leading-relaxed resize-y min-h-[90px] font-mono text-[11px]"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <DrawerFooter className="px-6 py-4 border-t border-border bg-card/80 backdrop-blur-sm flex flex-row items-center justify-end gap-2.5 shrink-0 mt-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isPending}
            >
              Batal
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isPending}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
            >
              {isPending && <Loader2 className="size-3.5 animate-spin mr-1.5" />}
              <span>Simpan Booking</span>
            </Button>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
}

