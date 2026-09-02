'use client';

import { useState, useTransition } from 'react';
import { Booking, BookingStatus, Service, ServiceCategory } from '@/types/database';
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
  User,
  Loader2,
  Clock,
  CheckCircle2,
  FileText,
  XCircle,
  Eye,
  Check,
  X,
  ArrowUpDown,
  Car,
  Palette,
  Home,
  Compass,
  Waves,
  MessageCircle,
  ExternalLink,
  AlertTriangle,
} from 'lucide-react';

interface BookingsTableProps {
  initialBookings: (Booking & { service?: Service | null })[];
  services: Service[];
}

const CATEGORY_MAP: Record<
  ServiceCategory,
  { label: string; icon: React.ComponentType<{ className?: string }> }
> = {
  'vehicle-rental': { label: 'Sewa Kendaraan', icon: Car },
  'tattoo': { label: 'Tato Studio', icon: Palette },
  'villa': { label: 'Villa & Stay', icon: Home },
  'travel': { label: 'Paket Travel', icon: Compass },
  'surfing-lesson': { label: 'Surfing Lesson', icon: Waves },
};

const STATUS_CONFIG: Record<
  BookingStatus,
  { label: string; bg: string; text: string; border: string; icon: React.ComponentType<{ className?: string }> }
> = {
  pending: {
    label: 'Pending',
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    border: 'border-amber-500/25',
    icon: Clock,
  },
  confirmed: {
    label: 'Confirmed',
    bg: 'bg-blue-500/10',
    text: 'text-blue-400',
    border: 'border-blue-500/25',
    icon: CheckCircle2,
  },
  completed: {
    label: 'Completed',
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    border: 'border-emerald-500/25',
    icon: CheckCircle2,
  },
  cancelled: {
    label: 'Cancelled',
    bg: 'bg-red-500/10',
    text: 'text-red-400',
    border: 'border-red-500/25',
    icon: XCircle,
  },
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
      weekday: 'long',
      day: 'numeric',
      month: 'long',
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
      // 'newest' default
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  // Calculate status counts
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
      await updateBookingStatusAction(id, newStatus);
      setUpdatingId(null);
      if (selectedBooking && selectedBooking.id === id) {
        setSelectedBooking((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
    });
  }

  function confirmDelete() {
    if (!bookingToDelete) return;
    setIsDeleting(true);
    startTransition(async () => {
      await deleteBookingAction(bookingToDelete.id);
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
      `Halo ${booking.customer_name}, kami dari Doamandeh Tours & Travel ingin mengonfirmasi pesanan Anda untuk *${serviceName}* pada tanggal *${booking.booking_date}*. Mohon konfirmasi ketersediaan Anda. Terima kasih!`
    );
    return `https://wa.me/${cleanPhone}?text=${text}`;
  }

  return (
    <div className="space-y-6">
      {/* Quick Status Pill Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {[
          { key: 'all', label: 'Semua Booking', count: statusCounts.all },
          { key: 'pending', label: 'Pending', count: statusCounts.pending, color: 'text-amber-400' },
          { key: 'confirmed', label: 'Confirmed', count: statusCounts.confirmed, color: 'text-blue-400' },
          { key: 'completed', label: 'Completed', count: statusCounts.completed, color: 'text-emerald-400' },
          { key: 'cancelled', label: 'Cancelled', count: statusCounts.cancelled, color: 'text-red-400' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setStatusFilter(tab.key)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              statusFilter === tab.key
                ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                : 'bg-zinc-900/80 text-zinc-400 border border-zinc-800 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                statusFilter === tab.key
                  ? 'bg-black/20 text-black'
                  : 'bg-zinc-800 text-zinc-300'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Filter and Action Controls */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        <div className="flex flex-1 flex-wrap items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Cari nama, email, no. telp, atau layanan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900/90 pl-9 pr-8 py-2.5 text-xs text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-zinc-500 hover:text-zinc-300"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-xl border border-zinc-800 bg-zinc-900/90 px-3 py-2.5 text-xs text-zinc-300 focus:border-amber-500 focus:outline-none"
          >
            <option value="all">Semua Kategori</option>
            <option value="vehicle-rental">Sewa Kendaraan</option>
            <option value="tattoo">Tato Studio</option>
            <option value="villa">Villa & Stay</option>
            <option value="travel">Paket Travel</option>
            <option value="surfing-lesson">Surfing Lesson</option>
          </select>

          {/* Sort By */}
          <div className="flex items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900/90 px-2.5 py-1 text-xs text-zinc-400">
            <ArrowUpDown className="h-3.5 w-3.5 text-zinc-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="bg-transparent text-xs text-zinc-300 focus:outline-none py-1 cursor-pointer"
            >
              <option value="newest" className="bg-zinc-900 text-white">Booking Terbaru</option>
              <option value="oldest" className="bg-zinc-900 text-white">Booking Terlama</option>
              <option value="date-asc" className="bg-zinc-900 text-white">Tgl Pemakaian Terdekat</option>
              <option value="price-desc" className="bg-zinc-900 text-white">Biaya Terbesar</option>
            </select>
          </div>
        </div>

        {/* Add Booking Button */}
        <button
          onClick={() => setDialogOpen(true)}
          className="flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-bold text-black hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20"
        >
          <Plus className="h-4 w-4" />
          <span>Tambah Booking Manual</span>
        </button>
      </div>

      {/* Bookings Table */}
      <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="border-b border-zinc-800 bg-zinc-900/80 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
              <tr>
                <th className="px-5 py-4">Customer</th>
                <th className="px-5 py-4">Layanan</th>
                <th className="px-5 py-4">Tgl Booking</th>
                <th className="px-5 py-4">Total Biaya</th>
                <th className="px-5 py-4">Status & Quick Action</th>
                <th className="px-5 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <div className="max-w-sm mx-auto flex flex-col items-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-800/80 text-zinc-400 mb-3 border border-zinc-700/60">
                        <Calendar className="h-6 w-6 text-amber-400" />
                      </div>
                      <h4 className="text-sm font-bold text-white mb-1">
                        Tidak Ada Booking Ditemukan
                      </h4>
                      <p className="text-xs text-zinc-400 mb-4">
                        {search || statusFilter !== 'all' || categoryFilter !== 'all'
                          ? 'Tidak ada pemesanan yang cocok dengan kriteria filter aktif saat ini.'
                          : 'Belum ada pemesanan yang masuk ke sistem Doamandeh.'}
                      </p>
                      {search || statusFilter !== 'all' || categoryFilter !== 'all' ? (
                        <button
                          onClick={resetFilters}
                          className="px-4 py-2 rounded-xl border border-zinc-700 bg-zinc-800 text-xs font-semibold text-zinc-200 hover:bg-zinc-700 transition-colors"
                        >
                          Reset Semua Filter
                        </button>
                      ) : (
                        <button
                          onClick={() => setDialogOpen(true)}
                          className="flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-black hover:bg-amber-400 transition-colors"
                        >
                          <Plus className="h-4 w-4" />
                          <span>Buat Booking Manual</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredBookings.map((booking) => {
                  const statusInfo = STATUS_CONFIG[booking.status] || STATUS_CONFIG.pending;
                  const StatusIcon = statusInfo.icon;
                  const isUpdatingThis = updatingId === booking.id;

                  const cat = booking.service?.category
                    ? CATEGORY_MAP[booking.service.category]
                    : null;
                  const CatIcon = cat ? cat.icon : Compass;

                  return (
                    <tr
                      key={booking.id}
                      className="hover:bg-zinc-800/30 transition-colors group"
                    >
                      {/* Customer Info */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 font-semibold text-white">
                          <User className="h-3.5 w-3.5 text-zinc-500" />
                          <span className="group-hover:text-amber-400 transition-colors">
                            {booking.customer_name}
                          </span>
                        </div>
                        <div className="mt-1 space-y-0.5 text-[11px] text-zinc-400">
                          <div className="flex items-center gap-1.5">
                            <Mail className="h-3 w-3 text-zinc-500" />
                            <span className="truncate max-w-[180px]">{booking.customer_email}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Phone className="h-3 w-3 text-emerald-500" />
                            <a
                              href={generateWhatsAppLink(booking)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-emerald-400/90 hover:underline hover:text-emerald-300"
                            >
                              {booking.customer_phone}
                            </a>
                          </div>
                        </div>
                      </td>

                      {/* Service Info */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <p className="font-semibold text-white">
                          {booking.service?.title || 'Layanan Umum'}
                        </p>
                        {cat && (
                          <span className="inline-flex items-center gap-1 text-[10px] text-amber-400/90 mt-0.5">
                            <CatIcon className="h-3 w-3" />
                            {cat.label}
                          </span>
                        )}
                      </td>

                      {/* Booking Date */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 font-medium text-white">
                          <Calendar className="h-3.5 w-3.5 text-zinc-500" />
                          <span>{booking.booking_date}</span>
                        </div>
                        <p className="text-[10px] text-zinc-500 mt-0.5">
                          Masuk: {new Date(booking.created_at).toLocaleDateString('id-ID')}
                        </p>
                      </td>

                      {/* Total Price */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="font-bold text-white text-xs sm:text-sm">
                          {booking.total_price ? formatRupiah(booking.total_price) : '-'}
                        </span>
                      </td>

                      {/* Status & Quick Action Buttons */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${statusInfo.bg} ${statusInfo.text} ${statusInfo.border}`}
                          >
                            <StatusIcon className="h-3 w-3" />
                            {statusInfo.label}
                          </span>

                          {/* Quick Action Buttons */}
                          {booking.status === 'pending' && (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleStatusChange(booking.id, 'confirmed')}
                                disabled={isPending || isUpdatingThis}
                                className="p-1 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-colors"
                                title="Konfirmasi Cepat"
                              >
                                {isUpdatingThis ? (
                                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                ) : (
                                  <Check className="h-3.5 w-3.5" />
                                )}
                              </button>
                              <button
                                onClick={() => handleStatusChange(booking.id, 'cancelled')}
                                disabled={isPending || isUpdatingThis}
                                className="p-1 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors"
                                title="Batalkan Cepat"
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          )}

                          {booking.status === 'confirmed' && (
                            <button
                              onClick={() => handleStatusChange(booking.id, 'completed')}
                              disabled={isPending || isUpdatingThis}
                              className="px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 text-[10px] font-medium transition-colors"
                              title="Tandai Selesai"
                            >
                              Selesai
                            </button>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedBooking(booking)}
                            className="rounded-xl p-2 text-zinc-400 hover:bg-zinc-800 hover:text-amber-400 transition-colors"
                            title="Lihat Detail Booking"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setBookingToDelete(booking)}
                            className="rounded-xl p-2 text-zinc-400 hover:bg-red-950/40 hover:text-red-400 transition-colors"
                            title="Hapus Booking"
                          >
                            <Trash2 className="h-4 w-4" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto">
          <div className="relative w-full max-w-lg my-8 rounded-2xl border border-zinc-800 bg-zinc-900 p-6 text-white shadow-2xl shadow-black/90">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
                  {selectedBooking.customer_name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">Detail Pemesanan</h3>
                  <p className="text-xs text-zinc-400">ID: {selectedBooking.id}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="rounded-xl p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="space-y-4 text-xs sm:text-sm">
              {/* Status Banner */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-950 border border-zinc-800">
                <span className="text-xs text-zinc-400">Status Saat Ini</span>
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                    STATUS_CONFIG[selectedBooking.status]?.bg
                  } ${STATUS_CONFIG[selectedBooking.status]?.text} ${
                    STATUS_CONFIG[selectedBooking.status]?.border
                  }`}
                >
                  {STATUS_CONFIG[selectedBooking.status]?.label}
                </span>
              </div>

              {/* Service Info Box */}
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
                <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider block">
                  Informasi Layanan
                </span>
                <p className="font-bold text-base text-white">
                  {selectedBooking.service?.title || 'Layanan Wisata'}
                </p>
                <div className="flex items-center justify-between text-xs text-zinc-400 pt-1 border-t border-zinc-800/60">
                  <span>Kategori</span>
                  <span className="capitalize text-amber-400 font-medium">
                    {selectedBooking.service?.category || '-'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-zinc-400">
                  <span>Estimasi Biaya</span>
                  <span className="font-bold text-white text-sm">
                    {selectedBooking.total_price ? formatRupiah(selectedBooking.total_price) : '-'}
                  </span>
                </div>
              </div>

              {/* Customer Contact Box */}
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2.5">
                <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider block">
                  Informasi Kontak Pemesan
                </span>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400">Nama Lengkap</span>
                  <span className="font-semibold text-white">{selectedBooking.customer_name}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400">Email</span>
                  <a
                    href={`mailto:${selectedBooking.customer_email}`}
                    className="text-zinc-200 hover:text-amber-400 hover:underline"
                  >
                    {selectedBooking.customer_email}
                  </a>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400">Nomor Telepon</span>
                  <span className="font-mono text-zinc-200">{selectedBooking.customer_phone}</span>
                </div>
              </div>

              {/* Booking Schedule Box */}
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
                <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider block">
                  Jadwal & Waktu
                </span>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400">Tanggal Booking</span>
                  <span className="font-bold text-amber-400">
                    {formatDateIndo(selectedBooking.booking_date)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-zinc-500">
                  <span>Dibuat Pada</span>
                  <span>{new Date(selectedBooking.created_at).toLocaleString('id-ID')}</span>
                </div>
              </div>

              {/* Special Notes Box */}
              {selectedBooking.notes && (
                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1.5">
                  <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-1">
                    <FileText className="h-3 w-3" /> Catatan Khusus dari Pemesan
                  </span>
                  <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-900/80 p-2.5 rounded-lg border border-zinc-800">
                    {selectedBooking.notes}
                  </p>
                </div>
              )}

              {/* Direct WhatsApp Contact Button */}
              <a
                href={generateWhatsAppLink(selectedBooking)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 py-3 px-4 text-xs font-bold text-black transition-colors shadow-lg shadow-emerald-500/20"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Hubungi Customer via WhatsApp</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>

              {/* Change Status Buttons Grid */}
              <div className="pt-2">
                <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider block mb-2">
                  Ubah Status Booking
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['pending', 'confirmed', 'completed', 'cancelled'] as BookingStatus[]).map(
                    (st) => (
                      <button
                        key={st}
                        onClick={() => handleStatusChange(selectedBooking.id, st)}
                        disabled={isPending || selectedBooking.status === st}
                        className={`py-2 px-2 rounded-xl text-xs font-semibold capitalize transition-all ${
                          selectedBooking.status === st
                            ? 'bg-zinc-800 text-zinc-500 border border-zinc-700/40 opacity-60 cursor-not-allowed'
                            : 'bg-zinc-950 text-zinc-200 border border-zinc-800 hover:bg-zinc-800 hover:text-white'
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-6 text-white shadow-2xl shadow-black">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-400 border border-red-500/20">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Hapus Data Booking?</h3>
                <p className="text-xs text-zinc-400">Tindakan ini permanen.</p>
              </div>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-950 p-3 rounded-xl border border-zinc-800/80 mb-6">
              Apakah Anda yakin ingin menghapus booking dari{' '}
              <strong className="text-amber-400">{bookingToDelete.customer_name}</strong> untuk
              layanan <strong className="text-white">{bookingToDelete.service?.title || 'Layanan'}</strong>?
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setBookingToDelete(null)}
                disabled={isDeleting}
                className="rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-700 transition-colors disabled:opacity-50"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={isDeleting}
                className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2 text-xs font-bold text-white hover:bg-red-500 transition-colors shadow-lg shadow-red-600/20 disabled:opacity-50"
              >
                {isDeleting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                <span>{isDeleting ? 'Menghapus...' : 'Ya, Hapus Booking'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
