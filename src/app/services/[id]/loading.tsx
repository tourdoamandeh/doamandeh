import { PublicHeader } from '@/components/public/public-header';
import { PublicFooter } from '@/components/public/public-footer';

export default function ServiceDetailLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100 selection:bg-amber-500 selection:text-black">
      <PublicHeader />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 animate-pulse">
        {/* Breadcrumb Skeleton */}
        <div className="flex items-center gap-2 mb-8">
          <div className="h-4 w-28 bg-zinc-800/70 rounded-md" />
          <div className="h-4 w-4 bg-zinc-800/40 rounded-md" />
          <div className="h-4 w-24 bg-zinc-800/70 rounded-md" />
          <div className="h-4 w-4 bg-zinc-800/40 rounded-md" />
          <div className="h-4 w-36 bg-zinc-800/50 rounded-md" />
        </div>

        {/* 2 Column Layout Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column Skeleton */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              {/* Badges */}
              <div className="flex items-center gap-2 mb-4">
                <div className="h-6 w-28 bg-zinc-800 rounded-xl" />
                <div className="h-6 w-20 bg-zinc-800 rounded-xl" />
                <div className="h-6 w-24 bg-zinc-800 rounded-xl" />
              </div>

              {/* Title */}
              <div className="h-10 w-3/4 bg-zinc-800 rounded-2xl mb-4" />
              <div className="h-10 w-1/2 bg-zinc-800/60 rounded-2xl mb-6" />

              {/* Price Banner */}
              <div className="h-16 w-64 bg-zinc-900 rounded-2xl border border-zinc-800/80 mb-6" />
            </div>

            {/* Description Card Skeleton */}
            <div className="rounded-3xl border border-zinc-800 bg-zinc-900/50 p-6 sm:p-8 space-y-4">
              <div className="h-5 w-48 bg-zinc-800 rounded-lg mb-4" />
              <div className="h-4 w-full bg-zinc-800/60 rounded-md" />
              <div className="h-4 w-5/6 bg-zinc-800/60 rounded-md" />
              <div className="h-4 w-4/6 bg-zinc-800/60 rounded-md" />

              <div className="pt-6 border-t border-zinc-800 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="h-4 w-40 bg-zinc-800/50 rounded-md" />
                <div className="h-4 w-40 bg-zinc-800/50 rounded-md" />
                <div className="h-4 w-40 bg-zinc-800/50 rounded-md" />
                <div className="h-4 w-40 bg-zinc-800/50 rounded-md" />
              </div>
            </div>

            {/* Banner skeleton */}
            <div className="h-24 w-full bg-zinc-900/40 rounded-3xl border border-zinc-800" />
          </div>

          {/* Right Column (Form Skeleton) */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl border border-zinc-800 bg-zinc-900/80 p-6 sm:p-8 space-y-6">
              <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
                <div className="space-y-1.5">
                  <div className="h-5 w-40 bg-zinc-800 rounded-lg" />
                  <div className="h-3 w-48 bg-zinc-800/60 rounded-md" />
                </div>
                <div className="h-7 w-20 bg-zinc-800 rounded-lg" />
              </div>

              <div className="space-y-4">
                <div className="h-10 w-full bg-zinc-950 rounded-xl border border-zinc-800/80" />
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-10 w-full bg-zinc-950 rounded-xl border border-zinc-800/80" />
                  <div className="h-10 w-full bg-zinc-950 rounded-xl border border-zinc-800/80" />
                </div>
                <div className="h-10 w-full bg-zinc-950 rounded-xl border border-zinc-800/80" />
                <div className="h-20 w-full bg-zinc-950 rounded-xl border border-zinc-800/80" />
                <div className="h-12 w-full bg-amber-500/20 rounded-2xl border border-amber-500/30" />
              </div>
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
