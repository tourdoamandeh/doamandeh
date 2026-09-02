'use client';

import { useState, useTransition, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Service, ServiceCategory } from '@/types/database';
import {
  toggleServiceActiveAction,
  deleteServiceAction,
} from '@/lib/actions/admin/services';
import { ServiceFormDialog } from './service-form-dialog';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Loader2,
  Car,
  Palette,
  Home,
  Compass,
  Waves,
  AlertTriangle,
  ArrowUpDown,
  X,
  Sparkles,
  ImageIcon,
} from 'lucide-react';

interface ServicesTableProps {
  initialServices: Service[];
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

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function ServicesTable({ initialServices }: ServicesTableProps) {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>(initialServices);

  // Sync state if initialServices updates from server
  useEffect(() => {
    setServices(initialServices);
  }, [initialServices]);

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'title' | 'price-asc' | 'price-desc'>('newest');

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  // Custom Delete Confirmation Modal State
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const [isPending, startTransition] = useTransition();

  // Filter & Sort
  const filteredServices = services
    .filter((s) => {
      const query = search.toLowerCase().trim();
      const matchesSearch =
        !query ||
        s.title.toLowerCase().includes(query) ||
        (s.description && s.description.toLowerCase().includes(query)) ||
        (s.unit && s.unit.toLowerCase().includes(query)) ||
        (s.duration && s.duration.toLowerCase().includes(query));

      const matchesCategory = categoryFilter === 'all' || s.category === categoryFilter;
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && s.is_active) ||
        (statusFilter === 'inactive' && !s.is_active);

      return matchesSearch && matchesCategory && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === 'price-asc') {
        return a.price - b.price;
      }
      if (sortBy === 'price-desc') {
        return b.price - a.price;
      }
      // 'newest' default
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  function handleOpenCreate() {
    setEditingService(null);
    setDialogOpen(true);
  }

  function handleOpenEdit(service: Service) {
    setEditingService(service);
    setDialogOpen(true);
  }

  function handleFormSuccess() {
    router.refresh();
  }

  function handleToggleStatus(id: string, currentStatus: boolean) {
    setTogglingId(id);
    // Optimistic local update
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, is_active: !currentStatus } : s))
    );

    startTransition(async () => {
      const res = await toggleServiceActiveAction(id, currentStatus);
      if (!res.success) {
        // Rollback if error
        setServices(initialServices);
      }
      setTogglingId(null);
      router.refresh();
    });
  }

  function confirmDelete() {
    if (!serviceToDelete) return;
    setIsDeleting(true);
    const targetId = serviceToDelete.id;

    // Optimistic local deletion
    setServices((prev) => prev.filter((s) => s.id !== targetId));

    startTransition(async () => {
      const res = await deleteServiceAction(targetId);
      if (!res.success) {
        setServices(initialServices);
      }
      setIsDeleting(false);
      setServiceToDelete(null);
      router.refresh();
    });
  }

  function resetFilters() {
    setSearch('');
    setCategoryFilter('all');
    setStatusFilter('all');
    setSortBy('newest');
  }

  return (
    <div>
      {/* Action Bar & Filter Controls */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-6">
        <div className="flex flex-1 flex-wrap items-center gap-3">
          {/* Live Search */}
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Cari nama, fasilitas, atau deskripsi..."
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

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-zinc-800 bg-zinc-900/90 px-3 py-2.5 text-xs text-zinc-300 focus:border-amber-500 focus:outline-none"
          >
            <option value="all">Semua Status</option>
            <option value="active">Aktif Saja</option>
            <option value="inactive">Nonaktif</option>
          </select>

          {/* Sort By */}
          <div className="flex items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900/90 px-2.5 py-1 text-xs text-zinc-400">
            <ArrowUpDown className="h-3.5 w-3.5 text-zinc-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="bg-transparent text-xs text-zinc-300 focus:outline-none py-1 cursor-pointer"
            >
              <option value="newest" className="bg-zinc-900 text-white">Terbaru</option>
              <option value="title" className="bg-zinc-900 text-white">Nama (A-Z)</option>
              <option value="price-asc" className="bg-zinc-900 text-white">Harga: Termurah</option>
              <option value="price-desc" className="bg-zinc-900 text-white">Harga: Termahal</option>
            </select>
          </div>
        </div>

        {/* Add Service Button */}
        <button
          onClick={handleOpenCreate}
          className="flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-xs font-bold text-black hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/20"
        >
          <Plus className="h-4 w-4" />
          <span>Tambah Layanan Baru</span>
        </button>
      </div>

      {/* Services Table */}
      <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="border-b border-zinc-800 bg-zinc-900/80 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
              <tr>
                <th className="px-5 py-4">Foto & Detail Layanan</th>
                <th className="px-5 py-4">Kategori</th>
                <th className="px-5 py-4">Harga / Satuan</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {filteredServices.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center">
                    <div className="max-w-sm mx-auto flex flex-col items-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-800/80 text-zinc-400 mb-3 border border-zinc-700/60">
                        <Sparkles className="h-6 w-6 text-amber-400" />
                      </div>
                      <h4 className="text-sm font-bold text-white mb-1">
                        Tidak Ada Layanan Ditemukan
                      </h4>
                      <p className="text-xs text-zinc-400 mb-4">
                        {search || categoryFilter !== 'all' || statusFilter !== 'all'
                          ? 'Tidak ada data layanan yang cocok dengan filter atau kata kunci pencarian Anda.'
                          : 'Belum ada data layanan di katalog Doamandeh. Mulai tambahkan layanan pertama Anda.'}
                      </p>
                      {search || categoryFilter !== 'all' || statusFilter !== 'all' ? (
                        <button
                          onClick={resetFilters}
                          className="px-4 py-2 rounded-xl border border-zinc-700 bg-zinc-800 text-xs font-semibold text-zinc-200 hover:bg-zinc-700 transition-colors"
                        >
                          Reset Semua Filter
                        </button>
                      ) : (
                        <button
                          onClick={handleOpenCreate}
                          className="flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-black hover:bg-amber-400 transition-colors"
                        >
                          <Plus className="h-4 w-4" />
                          <span>Tambah Layanan Sekarang</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredServices.map((service) => {
                  const cat = CATEGORY_MAP[service.category] || {
                    label: service.category,
                    icon: Compass,
                  };
                  const CatIcon = cat.icon;
                  const isTogglingThis = togglingId === service.id;

                  return (
                    <tr
                      key={service.id}
                      className="hover:bg-zinc-800/30 transition-colors group"
                    >
                      {/* Photo Thumbnail + Title & Description */}
                      <td className="px-5 py-4 max-w-md">
                        <div className="flex items-center gap-3.5">
                          {/* Image Thumbnail with crisp styling */}
                          {service.image_url ? (
                            <div className="relative h-14 w-16 sm:h-16 sm:w-20 rounded-xl overflow-hidden bg-zinc-950 shrink-0 border border-zinc-700/80 shadow-md">
                              <img
                                src={service.image_url}
                                alt={service.title}
                                className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
                              />
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(service)}
                              title="Klik untuk menambahkan foto layanan"
                              className="flex h-14 w-16 sm:h-16 sm:w-20 flex-col items-center justify-center rounded-xl bg-zinc-800/60 border border-dashed border-zinc-700/80 text-zinc-500 hover:border-amber-500/60 hover:text-amber-400 transition-colors shrink-0 group/img"
                            >
                              <ImageIcon className="h-5 w-5 mb-0.5 group-hover/img:scale-110 transition-transform" />
                              <span className="text-[9px] font-medium">+ Foto</span>
                            </button>
                          )}

                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-white group-hover:text-amber-400 transition-colors truncate text-xs sm:text-sm">
                              {service.title}
                            </p>
                            <p className="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">
                              {service.description || 'Tidak ada deskripsi tambahan.'}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category Badge */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-zinc-800 text-zinc-300 border border-zinc-700/60">
                          <CatIcon className="h-3 w-3 text-amber-400" />
                          {cat.label}
                        </span>
                      </td>

                      {/* Price & Unit */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <p className="font-bold text-white text-xs sm:text-sm">
                          {formatRupiah(service.price)}
                        </p>
                        <p className="text-[10px] text-zinc-400 mt-0.5">
                          {service.unit ? `/${service.unit.replace(/^per\s+/i, '')}` : '-'}
                          {service.duration ? ` • ${service.duration}` : ''}
                        </p>
                      </td>

                      {/* Status Toggle Switch */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleStatus(service.id, service.is_active)}
                          disabled={isPending || isTogglingThis}
                          title="Klik untuk mengubah status ketersediaan layanan"
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all ${
                            service.is_active
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/25'
                              : 'bg-zinc-800 text-zinc-400 border border-zinc-700 hover:bg-zinc-700'
                          }`}
                        >
                          {isTogglingThis ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : service.is_active ? (
                            <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                          ) : (
                            <XCircle className="h-3 w-3 text-zinc-500" />
                          )}
                          <span>{service.is_active ? 'Aktif' : 'Nonaktif'}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(service)}
                            className="rounded-xl p-2 text-zinc-400 hover:bg-zinc-800 hover:text-amber-400 transition-colors"
                            title="Edit Layanan & Foto"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setServiceToDelete(service)}
                            className="rounded-xl p-2 text-zinc-400 hover:bg-red-950/40 hover:text-red-400 transition-colors"
                            title="Hapus Layanan"
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

      {/* Service Modal Dialog (Create / Edit with Image Upload) */}
      <ServiceFormDialog
        isOpen={dialogOpen}
        service={editingService}
        onClose={() => setDialogOpen(false)}
        onSuccess={handleFormSuccess}
      />

      {/* Custom Delete Confirmation Dialog */}
      {serviceToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-6 text-white shadow-2xl shadow-black">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-400 border border-red-500/20">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Hapus Layanan?</h3>
                <p className="text-xs text-zinc-400">Tindakan ini tidak dapat dibatalkan.</p>
              </div>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-950 p-3 rounded-xl border border-zinc-800/80 mb-6">
              Apakah Anda yakin ingin menghapus layanan{' '}
              <strong className="text-amber-400">{serviceToDelete.title}</strong>? Data booking
              terkait mungkin terdampak jika layanan ini dihapus permanen.
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setServiceToDelete(null)}
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
                <span>{isDeleting ? 'Menghapus...' : 'Ya, Hapus Layanan'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
