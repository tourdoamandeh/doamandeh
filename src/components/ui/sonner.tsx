'use client';

import { Toaster as Sonner, ToasterProps } from 'sonner';

export function Toaster({ ...props }: ToasterProps) {
  return (
    <Sonner
      theme="light"
      richColors
      className="toaster group font-sans text-xs"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:shadow-lg group-[.toaster]:rounded-lg group-[.toaster]:font-sans group-[.toaster]:text-xs group-[.toaster]:border group-[.toaster]:py-3 group-[.toaster]:px-4 group-[.toaster]:gap-2.5',
          title: 'group-[.toast]:font-semibold group-[.toast]:text-xs',
          description: 'group-[.toast]:text-xs opacity-90',
          actionButton:
            'group-[.toast]:bg-stone-900 group-[.toast]:text-white group-[.toast]:rounded-md group-[.toast]:text-xs group-[.toast]:px-2.5 group-[.toast]:py-1 font-medium',
          cancelButton:
            'group-[.toast]:bg-stone-100 group-[.toast]:text-stone-700 group-[.toast]:rounded-md group-[.toast]:text-xs group-[.toast]:px-2.5 group-[.toast]:py-1 font-medium',
          success:
            '!bg-emerald-50 !text-emerald-950 !border-emerald-300 [&_[data-icon]]:!text-emerald-600',
          error:
            '!bg-rose-50 !text-rose-950 !border-rose-300 [&_[data-icon]]:!text-rose-600',
          warning:
            '!bg-amber-50 !text-amber-950 !border-amber-300 [&_[data-icon]]:!text-amber-600',
          info:
            '!bg-teal-50 !text-teal-950 !border-teal-300 [&_[data-icon]]:!text-teal-700',
          loading:
            '!bg-stone-50 !text-stone-900 !border-stone-300 [&_[data-icon]]:!text-stone-600',
        },
      }}
      {...props}
    />
  );
}
