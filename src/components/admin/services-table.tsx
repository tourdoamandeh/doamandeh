'use client';

import { useState, useTransition, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Service, ServiceCategory } from '@/types/database';
import { createClient } from '@/lib/supabase/client';
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
  Loader2,
  AlertTriangle,
  ArrowUpDown,
  X,
  ImageIcon,
  Package,
} from 'lucide-react';

interface ServicesTableProps {
  initialServices: Service[];
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

export function ServicesTable({ initialServices }: ServicesTableProps) {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>(initialServices);

  useEffect(() => {
    setServices(initialServices);
  }, [initialServices]);

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'title' | 'price-asc' | 'price-desc'>('newest');

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  // Delete Confirmation Modal
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

  async function handleFormSuccess() {
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from('services')
        .select('*')
        .order('created_at', { ascending: false });
      if (data) {
        setServices(data as Service[]);
      }
    } catch {
      // fallback
    }
    router.refresh();
  }

  function handleToggleStatus(id: string, currentStatus: boolean) {
    setTogglingId(id);
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, is_active: !currentStatus } : s))
    );

    startTransition(async () => {
      const res = await toggleServiceActiveAction(id, currentStatus);
      if (!res.success) {
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
    <div className="space-y-4">
      {/* Dense Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex flex-1 flex-wrap items-center gap-2.5">
          {/* Live Search */}
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400" />
            <input
              type="text"
              placeholder="Cari nama layanan, deskripsi..."
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

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-stone-200 bg-white px-2.5 py-1.5 text-xs text-stone-700 focus:border-teal-700 focus:outline-none"
          >
            <option value="all">Semua Status</option>
            <option value="active">Aktif Saja</option>
            <option value="inactive">Nonaktif</option>
          </select>

          {/* Sort By */}
          <div className="flex items-center gap-1 rounded-lg border border-stone-200 bg-white px-2 py-1 text-xs text-stone-600">
            <ArrowUpDown className="h-3 w-3 text-stone-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="bg-transparent text-xs text-stone-700 focus:outline-none cursor-pointer"
            >
              <option value="newest">Terbaru</option>
              <option value="title">Nama (A-Z)</option>
              <option value="price-asc">Harga Terendah</option>
              <option value="price-desc">Harga Tertinggi</option>
            </select>
          </div>
        </div>

        {/* Primary Action Button */}
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#0F766E] px-3.5 py-1.5 text-xs font-medium text-white hover:bg-[#115E59] transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Tambah Layanan</span>
        </button>
      </div>

      {/* Compact Table */}
      <div className="rounded-lg border border-stone-200 bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-700">
            <thead className="bg-stone-50 text-[11px] font-semibold text-stone-500 uppercase tracking-wider border-b border-stone-200">
              <tr>
                <th className="px-4 py-2.5">Foto & Layanan</th>
                <th className="px-4 py-2.5">Kategori</th>
                <th className="px-4 py-2.5">Harga / Satuan</th>
                <th className="px-4 py-2.5">Status</th>
                <th className="px-4 py-2.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredServices.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center">
                    <Package className="h-6 w-6 text-stone-400 mx-auto mb-2" />
                    <p className="text-xs font-medium text-stone-700 mb-1">
                      Tidak ada data layanan ditemukan.
                    </p>
                    <p className="text-[11px] text-stone-500 mb-3">
                      {search || categoryFilter !== 'all' || statusFilter !== 'all'
                        ? 'Coba ubah kata kunci atau reset filter pencarian.'
                        : 'Belum ada katalog layanan yang terdaftar.'}
                    </p>
                    {search || categoryFilter !== 'all' || statusFilter !== 'all' ? (
                      <button
                        onClick={resetFilters}
                        className="rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-50"
                      >
                        Reset Filter
                      </button>
                    ) : (
                      <button
                        onClick={handleOpenCreate}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-[#0F766E] px-3.5 py-1.5 text-xs font-medium text-white hover:bg-[#115E59]"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Tambah Layanan Sekarang</span>
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                filteredServices.map((service) => {
                  const isTogglingThis = togglingId === service.id;
                  const catLabel = CATEGORY_MAP[service.category] || service.category;

                  return (
                    <tr
                      key={service.id}
                      className="h-12 hover:bg-stone-50/70 transition-colors"
                    >
                      {/* Photo + Title */}
                      <td className="px-4 py-2 max-w-sm">
                        <div className="flex items-center gap-3">
                          {service.image_url ? (
                            <img
                              src={service.image_url}
                              alt={service.title}
                              className="h-8 w-11 rounded border border-stone-200 object-cover bg-stone-100 shrink-0"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(service)}
                              title="Tambah foto layanan"
                              className="flex h-8 w-11 flex-col items-center justify-center rounded border border-dashed border-stone-300 bg-stone-50 text-stone-400 hover:border-stone-400 hover:text-stone-600 transition-colors shrink-0"
                            >
                              <ImageIcon className="h-3.5 w-3.5" />
                            </button>
                          )}

                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-stone-900 truncate">
                              {service.title}
                            </p>
                            <p className="text-[11px] text-stone-500 line-clamp-1">
                              {service.description || 'Tanpa deskripsi'}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-4 py-2 whitespace-nowrap">
                        <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-stone-100 border border-stone-200 text-stone-700">
                          {catLabel}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="px-4 py-2 whitespace-nowrap">
                        <span className="font-mono text-xs font-semibold text-stone-900 tabular-nums">
                          {formatRupiah(service.price)}
                        </span>
                        <span className="text-[11px] text-stone-500 ml-1">
                          {service.unit ? `/${service.unit.replace(/^per\s+/i, '')}` : ''}
                        </span>
                      </td>

                      {/* Status: Dot + Text */}
                      <td className="px-4 py-2 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleStatus(service.id, service.is_active)}
                          disabled={isPending || isTogglingThis}
                          title="Klik untuk mengubah status aktif"
                          className="inline-flex items-center gap-1.5 text-xs font-medium hover:opacity-80 transition-opacity"
                        >
                          {isTogglingThis ? (
                            <Loader2 className="h-3 w-3 animate-spin text-stone-400" />
                          ) : service.is_active ? (
                            <span className="inline-flex items-center gap-1.5 text-emerald-700">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                              Aktif
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 text-stone-500">
                              <span className="h-1.5 w-1.5 rounded-full bg-stone-400" />
                              Nonaktif
                            </span>
                          )}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-2 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenEdit(service)}
                            className="p-1 rounded text-stone-500 hover:bg-stone-100 hover:text-stone-900 transition-colors"
                            title="Edit Layanan"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => setServiceToDelete(service)}
                            className="p-1 rounded text-stone-500 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                            title="Hapus Layanan"
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

      {/* Service Form Modal (Create / Edit) */}
      <ServiceFormDialog
        isOpen={dialogOpen}
        service={editingService}
        onClose={() => setDialogOpen(false)}
        onSuccess={handleFormSuccess}
      />

      {/* Delete Confirmation Modal */}
      {serviceToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-lg border border-stone-200 bg-white p-5 text-stone-900 shadow-xl">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-rose-50 text-rose-600 border border-rose-200">
                <AlertTriangle className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-stone-900">Hapus Layanan</h3>
                <p className="text-[11px] text-stone-500">Tindakan ini permanen.</p>
              </div>
            </div>

            <p className="text-xs text-stone-600 mb-5 leading-relaxed">
              Yakin ingin menghapus <strong className="text-stone-900">{serviceToDelete.title}</strong>? Data ini akan dihapus dari katalog.
            </p>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setServiceToDelete(null)}
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
