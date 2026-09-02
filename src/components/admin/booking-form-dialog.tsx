'use client';

import { useState, useTransition } from 'react';
import { Service, BookingStatus } from '@/types/database';
import { createBookingAction } from '@/lib/actions/admin/bookings';
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
      } else {
        onClose();
      }
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
      <div
        className="relative w-full max-w-lg my-6 rounded-lg border border-stone-200 bg-white p-5 sm:p-6 text-stone-900 shadow-xl max-h-[90vh] overflow-y-auto"
        role="dialog"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-200 mb-4">
          <div>
            <h3 className="text-sm font-bold text-stone-900">Input Booking Manual</h3>
            <p className="text-[11px] text-stone-500">Pencatatan reservasi offline atau langsung dari admin.</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-stone-400 hover:text-stone-700 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {errorMessage && (
          <div className="mb-4 flex items-start gap-2 rounded-lg bg-rose-50 border border-rose-200 p-2.5 text-xs text-rose-800">
            <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {/* Service Selection */}
          <div>
            <label className="block text-[11px] font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Pilih Layanan *
            </label>
            <select
              value={serviceId}
              onChange={(e) => handleServiceChange(e.target.value)}
              required
              className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs text-stone-900 focus:border-teal-700 focus:outline-none"
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
            <label className="block text-[11px] font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Nama Pelanggan *
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Budi Santoso"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs text-stone-900 placeholder:text-stone-400 focus:border-teal-700 focus:outline-none"
            />
          </div>

          {/* Email & Phone Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Email *
              </label>
              <input
                type="email"
                required
                placeholder="customer@email.com"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs text-stone-900 placeholder:text-stone-400 focus:border-teal-700 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-stone-700 uppercase tracking-wider mb-1">
                No. Telepon / WhatsApp *
              </label>
              <input
                type="tel"
                required
                placeholder="08123456789"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs text-stone-900 font-mono placeholder:text-stone-400 focus:border-teal-700 focus:outline-none"
              />
            </div>
          </div>

          {/* Date & Price Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Tanggal Pemakaian *
              </label>
              <input
                type="date"
                required
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs text-stone-900 focus:border-teal-700 focus:outline-none font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Total Biaya (IDR)
              </label>
              <input
                type="number"
                min="0"
                placeholder="350000"
                value={totalPrice}
                onChange={(e) => setTotalPrice(e.target.value)}
                className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs text-stone-900 font-mono focus:border-teal-700 focus:outline-none"
              />
            </div>
          </div>

          {/* Status Selection */}
          <div>
            <label className="block text-[11px] font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Status Awal
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as BookingStatus)}
              className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs text-stone-900 focus:border-teal-700 focus:outline-none"
            >
              <option value="pending">Pending (Menunggu)</option>
              <option value="confirmed">Confirmed (Dikonfirmasi)</option>
              <option value="completed">Completed (Selesai)</option>
              <option value="cancelled">Cancelled (Dibatalkan)</option>
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-[11px] font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Catatan Khusus
            </label>
            <textarea
              rows={2}
              placeholder="Permintaan penjemputan, spesifikasi kustom..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs text-stone-900 placeholder:text-stone-400 focus:border-teal-700 focus:outline-none resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-200 mt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="rounded-lg border border-stone-200 bg-white px-3.5 py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-50 disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#0F766E] px-4 py-1.5 text-xs font-medium text-white hover:bg-[#115E59] transition-colors disabled:opacity-50"
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
