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
    <div className="space-y-6 font-sans">
      {/* Editorial Header */}
      <div className="pb-2 border-b-2 border-brown/20">
        <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-brown/70">
          // KATALOG LAYANAN &amp; AKTIVITAS
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight uppercase text-brown mt-0.5">
          Manajemen Katalog Layanan
        </h1>
        <p className="text-xs text-brown/80 mt-1 font-light">
          Kelola paket travel, sewa motor &amp; mobil, studio tato, villa, dan kelas selancar Bali.
        </p>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-none bg-softyellow border-2 border-brown text-brown flex items-start gap-3 text-xs">
          <AlertCircle className="w-5 h-5 text-brown shrink-0 mt-0.5" />
          <div>
            <p className="font-bold uppercase tracking-wider">Gagal Mengambil Data Layanan</p>
            <p className="mt-0.5">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Services Table Component */}
      <ServicesTable initialServices={services} />
    </div>
  );
}
