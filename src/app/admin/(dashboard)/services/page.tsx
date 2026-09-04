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
      {/* Page Header */}
      <div className="pb-6 border-b border-border">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Services
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Kelola katalog paket travel, sewa motor &amp; mobil, studio tato, villa, dan surfing lesson.
        </p>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive flex items-start gap-3 text-xs">
          <AlertCircle className="size-4 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Gagal Mengambil Data Layanan</p>
            <p className="mt-0.5">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Services Table Component */}
      <ServicesTable initialServices={services} />
    </div>
  );
}
