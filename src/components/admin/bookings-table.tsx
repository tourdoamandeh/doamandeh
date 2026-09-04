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
  Loader2,
  Eye,
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
    <div className="space-y-4 font-sans">
      {/* Dense Status Segment Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
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
            className={`flex items-center gap-2 px-3.5 py-2 rounded-none text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
              statusFilter === tab.key
                ? 'bg-brown text-softyellow border-2 border-brown'
                : 'bg-softwhite border-2 border-brown/40 text-brown hover:bg-softyellow'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`px-1.5 py-0.2 rounded-none text-[10px] font-bold ${
                statusFilter === tab.key
                  ? 'bg-softyellow text-brown'
                  : 'bg-softyellow/60 text-brown'
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
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brown/60" />
            <input
              type="text"
              placeholder="Cari nama, email, no. telp..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-none border-2 border-brown bg-softwhite pl-9 pr-8 py-2 text-xs text-black placeholder:text-brown/40 focus:border-black focus:outline-none"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-brown/60 hover:text-black"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-none border-2 border-brown bg-softwhite px-3 py-2 text-xs font-medium uppercase text-brown focus:border-black focus:outline-none cursor-pointer"
          >
            <option value="all">Semua Kategori</option>
            <option value="vehicle-rental">Sewa Kendaraan</option>
            <option value="tattoo">Tato Studio</option>
            <option value="villa">Villa & Stay</option>
            <option value="travel">Paket Travel</option>
            <option value="surfing-lesson">Surfing Lesson</option>
          </select>

          {/* Sort By */}
          <div className="flex items-center gap-1.5 rounded-none border-2 border-brown bg-softwhite px-2.5 py-1.5 text-xs text-brown">
            <ArrowUpDown className="h-3.5 w-3.5 text-brown/60" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="bg-transparent text-xs font-medium uppercase text-brown focus:outline-none cursor-pointer"
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
          className="inline-flex items-center justify-center gap-2 rounded-none bg-brown text-softyellow hover:bg-black border-2 border-brown hover:border-black px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-none"
        >
          <Plus className="h-4 w-4 stroke-[2.5]" />
          <span>Tambah Booking</span>
        </button>
      </div>

      {/* Bookings Table */}
      <div className="rounded-none border-2 border-brown bg-softwhite overflow-hidden shadow-none">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-black">
            <thead className="bg-brown text-softyellow text-[10px] font-bold uppercase tracking-wider border-b-2 border-brown">
              <tr>
                <th className="px-4 py-3">Pelanggan</th>
                <th className="px-4 py-3">Layanan</th>
                <th className="px-4 py-3">Tanggal</th>
                <th className="px-4 py-3">Total Biaya</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brown/20">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-14 text-center">
                    <Calendar className="h-8 w-8 text-brown/40 mx-auto mb-2" />
                    <p className="text-xs font-bold uppercase tracking-wider text-brown mb-1">
                      Tidak ada data reservasi ditemukan.
                    </p>
                    <p className="text-[11px] text-brown/70 mb-4 font-light">
                      {search || statusFilter !== 'all' || categoryFilter !== 'all'
                        ? 'Coba ubah kata kunci atau reset filter status.'
                        : 'Belum ada pemesanan yang tercatat di sistem.'}
                    </p>
                    {search || statusFilter !== 'all' || categoryFilter !== 'all' ? (
                      <button
                        onClick={resetFilters}
                        className="rounded-none border-2 border-brown bg-softwhite px-4 py-2 text-xs font-bold uppercase tracking-wider text-brown hover:bg-softyellow cursor-pointer"
                      >
                        Reset Filter
                      </button>
                    ) : (
                      <button
                        onClick={() => setDialogOpen(true)}
                        className="inline-flex items-center gap-2 rounded-none bg-brown text-softyellow hover:bg-black border-2 border-brown px-4 py-2 text-xs font-bold uppercase tracking-wider cursor-pointer"
                      >
                        <Plus className="h-4 w-4" />
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
                      className="h-14 hover:bg-brown/5 transition-colors"
                    >
                      {/* Customer */}
                      <td className="px-4 py-2.5">
                        <p className="font-bold text-black uppercase tracking-tight truncate max-w-[150px]">
                          {booking.customer_name}
                        </p>
                        <div className="flex items-center gap-2 text-[11px] text-brown font-mono mt-0.5">
                          <span>{booking.customer_phone}</span>
                        </div>
                      </td>

                      {/* Service */}
                      <td className="px-4 py-2.5">
                        <p className="font-semibold text-black truncate max-w-[160px]">
                          {booking.service?.title || 'Layanan Umum'}
                        </p>
                        {catLabel && (
                          <span className="text-[10px] uppercase tracking-wider font-bold text-brown/70">
                            {catLabel}
                          </span>
                        )}
                      </td>

                      {/* Booking Date */}
                      <td className="px-4 py-2.5 font-mono text-[11px] text-black whitespace-nowrap">
                        {formatDateIndo(booking.booking_date)}
                      </td>

                      {/* Price */}
                      <td className="px-4 py-2.5 font-bold text-xs text-black whitespace-nowrap">
                        {booking.total_price ? formatRupiah(booking.total_price) : '-'}
                      </td>

                      {/* Status: Badge + Quick Confirm */}
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {booking.status === 'pending' && (
                            <span className="inline-block px-2.5 py-1 rounded-none border border-brown bg-softyellow text-[10px] font-bold uppercase tracking-wider text-brown">
                              Pending
                            </span>
                          )}
                          {booking.status === 'confirmed' && (
                            <span className="inline-block px-2.5 py-1 rounded-none border border-softblue bg-softblue text-[10px] font-bold uppercase tracking-wider text-softyellow">
                              Confirmed
                            </span>
                          )}
                          {booking.status === 'completed' && (
                            <span className="inline-block px-2.5 py-1 rounded-none border border-black bg-black text-[10px] font-bold uppercase tracking-wider text-softyellow">
                              Completed
                            </span>
                          )}
                          {booking.status === 'cancelled' && (
                            <span className="inline-block px-2.5 py-1 rounded-none border border-brown bg-white text-[10px] font-bold uppercase tracking-wider text-black">
                              Cancelled
                            </span>
                          )}

                          {/* Quick Confirm Button */}
                          {booking.status === 'pending' && (
                            <button
                              onClick={() => handleStatusChange(booking.id, 'confirmed')}
                              disabled={isPending || isUpdatingThis}
                              className="px-2.5 py-1 rounded-none border border-brown bg-brown text-[10px] font-bold uppercase tracking-wider text-softyellow hover:bg-black hover:border-black transition-colors cursor-pointer"
                              title="Konfirmasi Booking"
                            >
                              {isUpdatingThis ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Confirm'}
                            </button>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-2.5 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <a
                            href={generateWhatsAppLink(booking)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-none border border-brown text-brown hover:bg-brown hover:text-softyellow transition-colors"
                            title="WhatsApp Customer"
                          >
                            <MessageCircle className="h-3.5 w-3.5" />
                          </a>
                          <button
                            onClick={() => setSelectedBooking(booking)}
                            className="p-1.5 rounded-none border border-brown text-brown hover:bg-brown hover:text-softyellow transition-colors cursor-pointer"
                            title="Lihat Detail"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => setBookingToDelete(booking)}
                            className="p-1.5 rounded-none border border-black text-black hover:bg-black hover:text-softyellow transition-colors cursor-pointer"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-none overflow-y-auto font-sans">
          <div className="relative w-full max-w-md my-6 rounded-none border-2 border-brown bg-softwhite p-6 text-black shadow-none max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b-2 border-brown mb-5">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-brown/70">
                  // DETAIL RESERVASI
                </p>
                <h3 className="text-base font-bold uppercase tracking-wider text-brown mt-0.5">
                  Informasi Pemesanan
                </h3>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="p-1 rounded-none border border-brown text-brown hover:bg-brown hover:text-softyellow transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Content */}
            <div className="space-y-4 text-xs">
              {/* Service & Price */}
              <div className="p-3.5 rounded-none bg-softyellow/40 border border-brown/30 space-y-1.5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-brown">
                  Layanan Dipesan
                </p>
                <p className="font-bold text-sm text-black">
                  {selectedBooking.service?.title || 'Layanan Wisata'}
                </p>
                <div className="flex items-center justify-between pt-2 border-t border-brown/20 text-brown">
                  <span className="font-medium">Total Biaya</span>
                  <span className="font-bold text-black text-sm">
                    {selectedBooking.total_price ? formatRupiah(selectedBooking.total_price) : '-'}
                  </span>
                </div>
              </div>

              {/* Customer Contact */}
              <div className="p-3.5 rounded-none bg-softyellow/40 border border-brown/30 space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-brown">
                  Kontak Pelanggan
                </p>
                <div className="flex justify-between">
                  <span className="text-brown">Nama</span>
                  <span className="font-bold text-black">{selectedBooking.customer_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-brown">Email</span>
                  <span className="font-mono text-black">{selectedBooking.customer_email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-brown">Telepon</span>
                  <span className="font-mono text-black font-bold">{selectedBooking.customer_phone}</span>
                </div>
              </div>

              {/* Schedule */}
              <div className="p-3.5 rounded-none bg-softyellow/40 border border-brown/30 space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-brown">
                  Jadwal Pemakaian
                </p>
                <div className="flex justify-between">
                  <span className="text-brown">Tanggal Booking</span>
                  <span className="font-bold text-black">
                    {formatDateIndo(selectedBooking.booking_date)}
                  </span>
                </div>
              </div>

              {/* Notes */}
              {selectedBooking.notes && (
                <div className="p-3.5 rounded-none bg-softyellow/40 border border-brown/30 space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-brown flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5" /> Catatan Khusus
                  </p>
                  <p className="text-black leading-relaxed font-light">{selectedBooking.notes}</p>
                </div>
              )}

              {/* WhatsApp Action */}
              <a
                href={generateWhatsAppLink(selectedBooking)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2.5 rounded-none bg-brown hover:bg-black text-softyellow border-2 border-brown hover:border-black py-3 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Hubungi via WhatsApp</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>

              {/* Status Selector */}
              <div className="pt-3 border-t-2 border-brown">
                <p className="text-[10px] font-bold uppercase tracking-widest text-brown mb-2.5">
                  Ubah Status Booking
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {(['pending', 'confirmed', 'completed', 'cancelled'] as BookingStatus[]).map(
                    (st) => (
                      <button
                        key={st}
                        onClick={() => handleStatusChange(selectedBooking.id, st)}
                        disabled={isPending || selectedBooking.status === st}
                        className={`py-2 px-1 text-center rounded-none text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer border ${
                          selectedBooking.status === st
                            ? 'bg-brown text-softyellow border-brown'
                            : 'bg-softwhite text-brown border-brown/40 hover:bg-softyellow'
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-none">
          <div className="w-full max-w-sm rounded-none border-2 border-brown bg-softwhite p-6 text-black shadow-none">
            <div className="flex items-center gap-3 mb-3 pb-3 border-b-2 border-brown/30">
              <div className="flex h-9 w-9 items-center justify-center rounded-none bg-brown text-softyellow border border-brown">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-brown">Hapus Booking</h3>
                <p className="text-[10px] text-brown/70">Tindakan ini permanen.</p>
              </div>
            </div>

            <p className="text-xs text-black mb-5 leading-relaxed">
              Yakin ingin menghapus data booking dari <strong className="text-brown">{bookingToDelete.customer_name}</strong>?
            </p>

            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setBookingToDelete(null)}
                disabled={isDeleting}
                className="rounded-none border-2 border-brown bg-softwhite px-4 py-2 text-xs font-bold uppercase tracking-wider text-brown hover:bg-softyellow cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={isDeleting}
                className="inline-flex items-center gap-2 rounded-none bg-black text-softyellow border-2 border-black hover:bg-brown hover:border-brown px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                {isDeleting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                <span>{isDeleting ? 'Menghapus...' : 'Hapus Booking'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
