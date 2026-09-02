'use client';

import { useState, useTransition } from 'react';
import { Booking, BookingStatus, Service, ServiceCategory } from '@/types/database';
import { toast } from 'sonner';
import {
  updateBookingStatusAction,
  deleteBookingAction,
} from '@/lib/actions/admin/bookings';
import { BookingFormDialog } from './booking-form-dialog';
import {
  Search,
  Plus,
  Trash2,
  Calendar,
  Phone,
  Mail,
  Loader2,
  Eye,
  Check,
  X,
  ArrowUpDown,
  MessageCircle,
  ExternalLink,
  AlertTriangle,
  FileText,
} from 'lucide-react';

interface BookingsTableProps {
  initialBookings: (Booking & { service?: Service | null })[];
  services: Service[];
}

const CATEGORY_MAP: Record<ServiceCategory, string> = {
  'vehicle-rental': 'Sewa Kendaraan',
  'tattoo': 'Tato Studio',
  'villa': 'Villa & Stay',
  'travel': 'Paket Travel',
  'surfing-lesson': 'Surfing Lesson',
};

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDateIndo(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return new Intl.DateTimeFormat('id-ID', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(d);
  } catch {
    return dateStr;
  }
}

export function BookingsTable({ initialBookings, services }: BookingsTableProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'date-asc' | 'price-desc'>('newest');

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<(Booking & { service?: Service | null }) | null>(null);
  const [bookingToDelete, setBookingToDelete] = useState<(Booking & { service?: Service | null }) | null>(null);

  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Filter & Sort
  const filteredBookings = initialBookings
    .filter((b) => {
      const query = search.toLowerCase().trim();
      const matchesSearch =
        !query ||
        b.customer_name.toLowerCase().includes(query) ||
        b.customer_email.toLowerCase().includes(query) ||
        b.customer_phone.includes(query) ||
        (b.service?.title && b.service.title.toLowerCase().includes(query)) ||
        (b.notes && b.notes.toLowerCase().includes(query));

      const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
      const matchesCategory =
        categoryFilter === 'all' || (b.service && b.service.category === categoryFilter);

      return matchesSearch && matchesStatus && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'oldest') {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      }
      if (sortBy === 'date-asc') {
        return new Date(a.booking_date).getTime() - new Date(b.booking_date).getTime();
      }
      if (sortBy === 'price-desc') {
        return (Number(b.total_price) || 0) - (Number(a.total_price) || 0);
      }
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  const statusCounts = {
    all: initialBookings.length,
    pending: initialBookings.filter((b) => b.status === 'pending').length,
    confirmed: initialBookings.filter((b) => b.status === 'confirmed').length,
    completed: initialBookings.filter((b) => b.status === 'completed').length,
    cancelled: initialBookings.filter((b) => b.status === 'cancelled').length,
  };

  function handleStatusChange(id: string, newStatus: BookingStatus) {
    setUpdatingId(id);
    startTransition(async () => {
      const res = await updateBookingStatusAction(id, newStatus);
      if (!res.success) {
        toast.error(res.error || 'Gagal mengubah status booking');
      } else {
        toast.success(`Status booking diubah menjadi ${newStatus.toUpperCase()}`);
      }
      setUpdatingId(null);
      if (selectedBooking && selectedBooking.id === id) {
        setSelectedBooking((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
    });
  }

  function confirmDelete() {
    if (!bookingToDelete) return;
    setIsDeleting(true);
    const targetName = bookingToDelete.customer_name;
    startTransition(async () => {
      const res = await deleteBookingAction(bookingToDelete.id);
      if (!res.success) {
        toast.error(res.error || 'Gagal menghapus data booking');
      } else {
        toast.success(`Booking atas nama "${targetName}" berhasil dihapus`);
      }
      setIsDeleting(false);
      setBookingToDelete(null);
      if (selectedBooking && selectedBooking.id === bookingToDelete.id) {
        setSelectedBooking(null);
      }
    });
  }

  function resetFilters() {
    setSearch('');
    setStatusFilter('all');
    setCategoryFilter('all');
    setSortBy('newest');
  }

  function generateWhatsAppLink(booking: Booking & { service?: Service | null }): string {
    const rawPhone = booking.customer_phone.replace(/\D/g, '');
    const cleanPhone = rawPhone.startsWith('0') ? '62' + rawPhone.slice(1) : rawPhone;
    const serviceName = booking.service?.title || 'Layanan Wisata';
    const text = encodeURIComponent(
      `Halo ${booking.customer_name}, kami dari Doamandeh Tours & Travel ingin mengonfirmasi pesanan Anda untuk ${serviceName} pada tanggal ${booking.booking_date}. Mohon konfirmasi ketersediaan Anda. Terima kasih!`
    );
    return `https://wa.me/${cleanPhone}?text=${text}`;
  }

  return (
    <div className="space-y-4">
      {/* Dense Status Segment Filter */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {[
          { key: 'all', label: 'Semua', count: statusCounts.all },
          { key: 'pending', label: 'Pending', count: statusCounts.pending },
          { key: 'confirmed', label: 'Confirmed', count: statusCounts.confirmed },
          { key: 'completed', label: 'Completed', count: statusCounts.completed },
          { key: 'cancelled', label: 'Cancelled', count: statusCounts.cancelled },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setStatusFilter(tab.key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              statusFilter === tab.key
                ? 'bg-stone-900 text-white font-semibold shadow-xs'
                : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50 hover:text-stone-900'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`font-mono text-[10px] tabular-nums px-1.5 py-0.2 rounded ${
                statusFilter === tab.key
                  ? 'bg-stone-700 text-stone-200'
                  : 'bg-stone-100 text-stone-600'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex flex-1 flex-wrap items-center gap-2.5">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400" />
            <input
              type="text"
              placeholder="Cari nama, email, no. telp..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-stone-200 bg-white pl-8 pr-7 py-1.5 text-xs text-stone-900 placeholder:text-stone-400 focus:border-teal-700 focus:outline-none"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-stone-400 hover:text-stone-600"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-lg border border-stone-200 bg-white px-2.5 py-1.5 text-xs text-stone-700 focus:border-teal-700 focus:outline-none"
          >
            <option value="all">Semua Kategori</option>
            <option value="vehicle-rental">Sewa Kendaraan</option>
            <option value="tattoo">Tato Studio</option>
            <option value="villa">Villa & Stay</option>
            <option value="travel">Paket Travel</option>
            <option value="surfing-lesson">Surfing Lesson</option>
          </select>

          {/* Sort By */}
          <div className="flex items-center gap-1 rounded-lg border border-stone-200 bg-white px-2 py-1 text-xs text-stone-600">
            <ArrowUpDown className="h-3 w-3 text-stone-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="bg-transparent text-xs text-stone-700 focus:outline-none cursor-pointer"
            >
              <option value="newest">Booking Terbaru</option>
              <option value="oldest">Booking Terlama</option>
              <option value="date-asc">Tgl Terdekat</option>
              <option value="price-desc">Biaya Tertinggi</option>
            </select>
          </div>
        </div>

        {/* Primary Action Button */}
        <button
          onClick={() => setDialogOpen(true)}
          className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#0F766E] px-3.5 py-1.5 text-xs font-medium text-white hover:bg-[#115E59] transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Tambah Booking</span>
        </button>
      </div>

      {/* Compact Bookings Table */}
      <div className="rounded-lg border border-stone-200 bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-700">
            <thead className="bg-stone-50 text-[11px] font-semibold text-stone-500 uppercase tracking-wider border-b border-stone-200">
              <tr>
                <th className="px-4 py-2.5">Pelanggan</th>
                <th className="px-4 py-2.5">Layanan</th>
                <th className="px-4 py-2.5">Tanggal</th>
                <th className="px-4 py-2.5">Total Biaya</th>
                <th className="px-4 py-2.5">Status</th>
                <th className="px-4 py-2.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <Calendar className="h-6 w-6 text-stone-400 mx-auto mb-2" />
                    <p className="text-xs font-medium text-stone-700 mb-1">
                      Tidak ada data booking ditemukan.
                    </p>
                    <p className="text-[11px] text-stone-500 mb-3">
                      {search || statusFilter !== 'all' || categoryFilter !== 'all'
                        ? 'Coba ubah kata kunci atau reset filter status.'
                        : 'Belum ada pemesanan yang tercatat di sistem.'}
                    </p>
                    {search || statusFilter !== 'all' || categoryFilter !== 'all' ? (
                      <button
                        onClick={resetFilters}
                        className="rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-50"
                      >
                        Reset Filter
                      </button>
                    ) : (
                      <button
                        onClick={() => setDialogOpen(true)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-[#0F766E] px-3.5 py-1.5 text-xs font-medium text-white hover:bg-[#115E59]"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Input Booking Baru</span>
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                filteredBookings.map((booking) => {
                  const isUpdatingThis = updatingId === booking.id;
                  const catLabel = booking.service?.category
                    ? CATEGORY_MAP[booking.service.category]
                    : null;

                  return (
                    <tr
                      key={booking.id}
                      className="h-12 hover:bg-stone-50/70 transition-colors"
                    >
                      {/* Customer */}
                      <td className="px-4 py-2">
                        <p className="font-medium text-stone-900 truncate max-w-[140px]">
                          {booking.customer_name}
                        </p>
                        <div className="flex items-center gap-2 text-[11px] text-stone-500">
                          <span className="font-mono">{booking.customer_phone}</span>
                        </div>
                      </td>

                      {/* Service */}
                      <td className="px-4 py-2">
                        <p className="font-medium text-stone-900 truncate max-w-[160px]">
                          {booking.service?.title || 'Layanan Umum'}
                        </p>
                        {catLabel && (
                          <span className="text-[10px] text-stone-500">
                            {catLabel}
                          </span>
                        )}
                      </td>

                      {/* Booking Date */}
                      <td className="px-4 py-2 font-mono text-[11px] text-stone-600 whitespace-nowrap">
                        {formatDateIndo(booking.booking_date)}
                      </td>

                      {/* Price */}
                      <td className="px-4 py-2 font-mono text-xs font-semibold text-stone-900 tabular-nums whitespace-nowrap">
                        {booking.total_price ? formatRupiah(booking.total_price) : '-'}
                      </td>

                      {/* Status: Dot + Text */}
                      <td className="px-4 py-2 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {booking.status === 'pending' && (
                            <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-amber-700">
                              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                              Pending
                            </span>
                          )}
                          {booking.status === 'confirmed' && (
                            <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#0F766E]">
                              <span className="h-1.5 w-1.5 rounded-full bg-[#0F766E]" />
                              Confirmed
                            </span>
                          )}
                          {booking.status === 'completed' && (
                            <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-700">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                              Completed
                            </span>
                          )}
                          {booking.status === 'cancelled' && (
                            <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-rose-700">
                              <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                              Cancelled
                            </span>
                          )}

                          {/* Quick Confirm Button */}
                          {booking.status === 'pending' && (
                            <button
                              onClick={() => handleStatusChange(booking.id, 'confirmed')}
                              disabled={isPending || isUpdatingThis}
                              className="px-2 py-0.5 rounded border border-teal-200 bg-teal-50 text-[10px] font-medium text-[#0F766E] hover:bg-teal-100 transition-colors"
                              title="Konfirmasi Booking"
                            >
                              {isUpdatingThis ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Confirm'}
                            </button>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-2 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1">
                          <a
                            href={generateWhatsAppLink(booking)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 rounded text-emerald-600 hover:bg-emerald-50 transition-colors"
                            title="WhatsApp Customer"
                          >
                            <MessageCircle className="h-3.5 w-3.5" />
                          </a>
                          <button
                            onClick={() => setSelectedBooking(booking)}
                            className="p-1 rounded text-stone-500 hover:bg-stone-100 hover:text-stone-900 transition-colors"
                            title="Lihat Detail"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => setBookingToDelete(booking)}
                            className="p-1 rounded text-stone-500 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                            title="Hapus Booking"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Booking Dialog */}
      <BookingFormDialog
        services={services}
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
      />

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-md my-6 rounded-lg border border-stone-200 bg-white p-5 text-stone-900 shadow-xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 mb-4">
              <div>
                <h3 className="text-sm font-bold text-stone-900">Detail Pemesanan</h3>
                <p className="font-mono text-[10px] text-stone-400">ID: {selectedBooking.id}</p>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="p-1 rounded text-stone-400 hover:text-stone-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Content */}
            <div className="space-y-3.5 text-xs">
              {/* Service & Price */}
              <div className="p-3 rounded-lg bg-stone-50 border border-stone-200 space-y-1">
                <p className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider">
                  Layanan Dipesan
                </p>
                <p className="font-bold text-stone-900">
                  {selectedBooking.service?.title || 'Layanan Wisata'}
                </p>
                <div className="flex items-center justify-between pt-1 border-t border-stone-200 text-stone-600">
                  <span>Total Biaya</span>
                  <span className="font-mono font-bold text-stone-900">
                    {selectedBooking.total_price ? formatRupiah(selectedBooking.total_price) : '-'}
                  </span>
                </div>
              </div>

              {/* Customer Contact */}
              <div className="p-3 rounded-lg bg-stone-50 border border-stone-200 space-y-1.5">
                <p className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider">
                  Kontak Pelanggan
                </p>
                <div className="flex justify-between">
                  <span className="text-stone-500">Nama</span>
                  <span className="font-medium text-stone-900">{selectedBooking.customer_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Email</span>
                  <span className="font-mono text-stone-800">{selectedBooking.customer_email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Telepon</span>
                  <span className="font-mono text-stone-800">{selectedBooking.customer_phone}</span>
                </div>
              </div>

              {/* Schedule */}
              <div className="p-3 rounded-lg bg-stone-50 border border-stone-200 space-y-1">
                <p className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider">
                  Jadwal
                </p>
                <div className="flex justify-between">
                  <span className="text-stone-500">Tanggal Booking</span>
                  <span className="font-mono font-semibold text-stone-900">
                    {formatDateIndo(selectedBooking.booking_date)}
                  </span>
                </div>
              </div>

              {/* Notes */}
              {selectedBooking.notes && (
                <div className="p-3 rounded-lg bg-stone-50 border border-stone-200 space-y-1">
                  <p className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider flex items-center gap-1">
                    <FileText className="h-3 w-3" /> Catatan
                  </p>
                  <p className="text-stone-700 leading-relaxed">{selectedBooking.notes}</p>
                </div>
              )}

              {/* WhatsApp Action */}
              <a
                href={generateWhatsAppLink(selectedBooking)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[#25D366] text-white py-2 text-xs font-medium hover:bg-[#1EBE5D] transition-colors"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                <span>Hubungi via WhatsApp</span>
                <ExternalLink className="h-3 w-3" />
              </a>

              {/* Status Selector */}
              <div className="pt-2 border-t border-stone-200">
                <p className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider mb-2">
                  Ubah Status
                </p>
                <div className="grid grid-cols-4 gap-1.5">
                  {(['pending', 'confirmed', 'completed', 'cancelled'] as BookingStatus[]).map(
                    (st) => (
                      <button
                        key={st}
                        onClick={() => handleStatusChange(selectedBooking.id, st)}
                        disabled={isPending || selectedBooking.status === st}
                        className={`py-1.5 px-2 rounded text-[11px] font-medium capitalize transition-colors ${
                          selectedBooking.status === st
                            ? 'bg-stone-900 text-white font-semibold'
                            : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                        }`}
                      >
                        {st}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {bookingToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-lg border border-stone-200 bg-white p-5 text-stone-900 shadow-xl">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-rose-50 text-rose-600 border border-rose-200">
                <AlertTriangle className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-stone-900">Hapus Booking</h3>
                <p className="text-[11px] text-stone-500">Tindakan ini permanen.</p>
              </div>
            </div>

            <p className="text-xs text-stone-600 mb-5 leading-relaxed">
              Yakin ingin menghapus booking dari <strong className="text-stone-900">{bookingToDelete.customer_name}</strong>?
            </p>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setBookingToDelete(null)}
                disabled={isDeleting}
                className="rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-50"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={isDeleting}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#DC2626] px-3.5 py-1.5 text-xs font-medium text-white hover:bg-rose-700 transition-colors"
              >
                {isDeleting && <Loader2 className="h-3 w-3 animate-spin" />}
                <span>{isDeleting ? 'Menghapus...' : 'Hapus'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
