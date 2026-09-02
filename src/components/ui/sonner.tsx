'use client';

import { Toaster as Sonner, ToasterProps } from 'sonner';

export function Toaster({ ...props }: ToasterProps) {
  return (
    <Sonner
      theme="light"
      className="toaster group font-sans text-xs"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-white group-[.toaster]:text-stone-900 group-[.toaster]:border-stone-200 group-[.toaster]:shadow-lg group-[.toaster]:rounded-lg group-[.toaster]:font-sans group-[.toaster]:text-xs',
          description: 'group-[.toast]:text-stone-500 group-[.toast]:text-xs',
          actionButton:
            'group-[.toast]:bg-teal-700 group-[.toast]:text-white group-[.toast]:rounded-md',
          cancelButton:
            'group-[.toast]:bg-stone-100 group-[.toast]:text-stone-700 group-[.toast]:rounded-md',
        },
      }}
      {...props}
    />
  );
}
