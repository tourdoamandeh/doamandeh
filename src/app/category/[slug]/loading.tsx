import { PublicHeader } from '@/components/public/public-header';
import { PublicFooter } from '@/components/public/public-footer';

export default function CategoryLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100 selection:bg-amber-500 selection:text-black">
      <PublicHeader />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 animate-pulse">
        {/* Category Tabs Skeleton */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-10 w-36 shrink-0 bg-zinc-900 border border-zinc-800 rounded-2xl" />
          ))}
        </div>

        {/* Hero Banner Skeleton */}
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-8 sm:p-12 mb-12 space-y-4">
          <div className="h-6 w-32 bg-zinc-800 rounded-full" />
          <div className="h-10 w-2/3 bg-zinc-800 rounded-2xl" />
          <div className="h-4 w-1/2 bg-zinc-800/60 rounded-md" />

          <div className="pt-6 border-t border-zinc-800 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-4 w-28 bg-zinc-800/40 rounded-md" />
            ))}
          </div>
        </div>

        {/* Section Title */}
        <div className="flex justify-between items-center mb-8">
          <div className="space-y-2">
            <div className="h-6 w-48 bg-zinc-800 rounded-lg" />
            <div className="h-3.5 w-64 bg-zinc-800/60 rounded-md" />
          </div>
          <div className="h-8 w-28 bg-zinc-900 rounded-xl" />
        </div>

        {/* Cards Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-6 space-y-6"
            >
              <div className="space-y-3">
                <div className="flex justify-between">
                  <div className="h-4 w-20 bg-zinc-800/60 rounded-md" />
                  <div className="h-4 w-16 bg-zinc-800/60 rounded-md" />
                </div>
                <div className="h-6 w-3/4 bg-zinc-800 rounded-lg" />
                <div className="h-4 w-full bg-zinc-800/50 rounded-md" />
                <div className="h-4 w-4/5 bg-zinc-800/50 rounded-md" />
              </div>

              <div className="pt-4 border-t border-zinc-800/80 flex flex-col gap-4">
                <div className="h-6 w-28 bg-zinc-800 rounded-md" />
                <div className="h-11 w-full bg-amber-500/20 rounded-xl border border-amber-500/30" />
              </div>
            </div>
          ))}
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
