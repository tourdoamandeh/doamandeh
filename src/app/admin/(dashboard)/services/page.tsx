import { createClient } from '@/lib/supabase/server';
import { Service } from '@/types/database';
import { ServicesTable } from '@/components/admin/services-table';
import { Package, AlertCircle } from 'lucide-react';

export default async function AdminServicesPage() {
  const supabase = await createClient();
  let services: Service[] = [];
  let errorMessage: string | null = null;

  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      errorMessage = error.message;
    } else {
      services = (data as Service[]) || [];
    }
  } catch (err) {
    errorMessage = err instanceof Error ? err.message : 'Gagal memuat data layanan.';
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-zinc-800 pb-5">
        <div className="flex items-center gap-2 mb-1">
          <Package className="h-4 w-4 text-amber-400" />
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
            Katalog & Manajemen
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Kelola Layanan Wisata
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 mt-1">
          Tambah, edit informasi, ubah harga, atau atur status ketersediaan layanan Doamandeh Tours & Travel.
        </p>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-950/40 border border-red-800/80 text-red-200 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-xs font-semibold text-red-300">Gagal Mengambil Data Layanan</h3>
            <p className="text-xs text-red-400/90 mt-0.5">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Services Interactive Table */}
      <ServicesTable initialServices={services} />
    </div>
  );
}
