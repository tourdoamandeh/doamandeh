import { Info } from 'lucide-react';

interface ConnectionBannerProps {
  errorMessage?: string | null;
  isPlaceholderUrl?: boolean;
}

export function ConnectionBanner({
  errorMessage,
  isPlaceholderUrl,
}: ConnectionBannerProps) {
  if (!errorMessage && !isPlaceholderUrl) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
      <div className="p-6 rounded-none bg-sun border border-line text-ink flex items-start gap-4 shadow-none">
        <Info className="w-5 h-5 text-ink shrink-0 mt-0.5" strokeWidth={1.5} />
        <div className="space-y-1">
          <h3 className="text-base font-sans font-medium text-ink">
            Koneksi Supabase Belum Dikonfigurasi
          </h3>
          <p className="text-xs text-black/80 leading-relaxed font-sans">
            {isPlaceholderUrl
              ? 'File `.env.local` saat ini masih menggunakan URL placeholder. Silakan isi `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY` dengan kredensial asli dari Supabase Dashboard Anda.'
              : errorMessage}
          </p>
        </div>
      </div>
    </div>
  );
}
