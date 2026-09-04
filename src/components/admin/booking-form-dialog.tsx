'use client';

import { useState, useTransition } from 'react';
import { Service, BookingStatus } from '@/types/database';
import { createBookingAction } from '@/lib/actions/admin/bookings';
import { toast } from 'sonner';
import { X, Loader2, AlertCircle } from 'lucide-react';

interface BookingFormDialogProps {
  services: Service[];
  isOpen: boolean;
  onClose: () => void;
}

export function BookingFormDialog({
  services,
  isOpen,
  onClose,
}: BookingFormDialogProps) {
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [serviceId, setServiceId] = useState<string>(services[0]?.id || '');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<BookingStatus>('pending');
  const [totalPrice, setTotalPrice] = useState('');

  if (!isOpen) return null;

  function handleServiceChange(id: string) {
    setServiceId(id);
    const selected = services.find((s) => s.id === id);
    if (selected && (!totalPrice || totalPrice === '0')) {
      setTotalPrice(selected.price.toString());
    }
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

    if (!customerEmail.trim() || !customerEmail.includes('@')) {
      setErrorMessage('Email customer tidak valid');
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

    const priceNum = totalPrice ? Number(totalPrice) : undefined;

    startTransition(async () => {
      const res = await createBookingAction({
        service_id: serviceId,
        customer_name: customerName.trim(),
        customer_email: customerEmail.trim(),
        customer_phone: customerPhone.trim(),
        booking_date: bookingDate,
        notes: notes.trim() || null,
        status,
        total_price: priceNum,
      });

      if (!res.success) {
        setErrorMessage(res.error || 'Gagal membuat booking');
        toast.error(res.error || 'Gagal membuat booking');
      } else {
        toast.success(`Booking manual untuk "${customerName.trim()}" berhasil disimpan`);
        onClose();
      }
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-none overflow-y-auto font-sans">
      <div
        className="relative w-full max-w-lg my-6 rounded-none border-2 border-brown bg-softwhite p-6 text-black shadow-none max-h-[90vh] overflow-y-auto"
        role="dialog"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-brown mb-5">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-brown/70">
              // INPUT RESERVASI
            </p>
            <h3 className="text-base font-bold uppercase tracking-wider text-brown mt-0.5">
              Input Booking Manual
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-none border border-brown text-brown hover:bg-brown hover:text-softyellow transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {errorMessage && (
          <div className="mb-4 flex items-start gap-2.5 rounded-none bg-softyellow border-2 border-brown p-3 text-xs text-brown">
            <AlertCircle className="h-4 w-4 text-brown shrink-0 mt-0.5" />
            <span className="font-medium">{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Service Selection */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-brown mb-1.5">
              Pilih Layanan *
            </label>
            <select
              value={serviceId}
              onChange={(e) => handleServiceChange(e.target.value)}
              required
              className="w-full rounded-none border-2 border-brown bg-softyellow/40 px-3 py-2 text-xs text-black focus:border-black focus:bg-white focus:outline-none cursor-pointer"
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
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-brown mb-1.5">
              Nama Pelanggan *
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Budi Santoso"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full rounded-none border-2 border-brown bg-softyellow/40 px-3 py-2 text-xs text-black placeholder:text-brown/40 focus:border-black focus:bg-white focus:outline-none"
            />
          </div>

          {/* Email & Phone Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-brown mb-1.5">
                Alamat Email *
              </label>
              <input
                type="email"
                required
                placeholder="customer@email.com"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="w-full rounded-none border-2 border-brown bg-softyellow/40 px-3 py-2 text-xs text-black placeholder:text-brown/40 focus:border-black focus:bg-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-brown mb-1.5">
                No. Telepon / WhatsApp *
              </label>
              <input
                type="tel"
                required
                placeholder="08123456789"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full rounded-none border-2 border-brown bg-softyellow/40 px-3 py-2 text-xs text-black font-mono placeholder:text-brown/40 focus:border-black focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          {/* Date & Price Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-brown mb-1.5">
                Tanggal Booking *
              </label>
              <input
                type="date"
                required
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                className="w-full rounded-none border-2 border-brown bg-softyellow/40 px-3 py-2 text-xs text-black focus:border-black focus:bg-white focus:outline-none font-mono"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-brown mb-1.5">
                Total Biaya (IDR)
              </label>
              <input
                type="number"
                min="0"
                placeholder="350000"
                value={totalPrice}
                onChange={(e) => setTotalPrice(e.target.value)}
                className="w-full rounded-none border-2 border-brown bg-softyellow/40 px-3 py-2 text-xs font-bold text-black focus:border-black focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          {/* Status Selection */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-brown mb-1.5">
              Status Awal
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as BookingStatus)}
              className="w-full rounded-none border-2 border-brown bg-softyellow/40 px-3 py-2 text-xs text-black focus:border-black focus:bg-white focus:outline-none cursor-pointer"
            >
              <option value="pending">Pending (Menunggu)</option>
              <option value="confirmed">Confirmed (Dikonfirmasi)</option>
              <option value="completed">Completed (Selesai)</option>
              <option value="cancelled">Cancelled (Dibatalkan)</option>
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-brown mb-1.5">
              Catatan Khusus
            </label>
            <textarea
              rows={2}
              placeholder="Permintaan penjemputan, spesifikasi kustom..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-none border-2 border-brown bg-softyellow/40 px-3 py-2 text-xs text-black placeholder:text-brown/40 focus:border-black focus:bg-white focus:outline-none resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t-2 border-brown mt-5">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="rounded-none border-2 border-brown bg-softwhite px-4 py-2 text-xs font-bold uppercase tracking-wider text-brown hover:bg-softyellow cursor-pointer disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center gap-2 rounded-none bg-brown text-softyellow hover:bg-black border-2 border-brown hover:border-black px-5 py-2 text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50 cursor-pointer shadow-none"
            >
              {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              <span>Simpan Booking</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
