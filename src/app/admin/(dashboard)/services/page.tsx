import { createClient } from '@/lib/supabase/server';
import { Service } from '@/types/database';
import { ServicesTable } from '@/components/admin/services-table';
import { AlertCircle } from 'lucide-react';

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
      {/* Operations Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-stone-900">
          Katalog Layanan Wisata
        </h1>
        <p className="text-xs text-stone-500 mt-0.5">
          Manajemen paket travel, sewa kendaraan, studio tato, villa, dan kursus surfing.
        </p>
      </div>

      {errorMessage && (
        <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-2.5 text-xs">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-rose-900">Gagal Mengambil Data Layanan</p>
            <p className="text-rose-700 mt-0.5">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Services Table Component */}
      <ServicesTable initialServices={services} />
    </div>
  );
}
