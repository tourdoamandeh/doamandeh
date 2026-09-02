'use client';

import * as React from 'react';
import { Tooltip as TooltipPrimitive } from '@base-ui/react/tooltip';
import { cn } from '@/lib/utils';

export function TooltipProvider({
  children,
  delay = 100,
  ...props
}: TooltipPrimitive.Provider.Props & { delay?: number }) {
  return (
    <TooltipPrimitive.Provider delay={delay} {...props}>
      {children}
    </TooltipPrimitive.Provider>
  );
}

export function Tooltip({
  children,
  ...props
}: TooltipPrimitive.Root.Props) {
  return <TooltipPrimitive.Root {...props}>{children}</TooltipPrimitive.Root>;
}

export function TooltipTrigger({
  className,
  children,
  ...props
}: TooltipPrimitive.Trigger.Props) {
  return (
    <TooltipPrimitive.Trigger className={className} {...props}>
      {children}
    </TooltipPrimitive.Trigger>
  );
}

export const TooltipContent = React.forwardRef<
  HTMLDivElement,
  TooltipPrimitive.Popup.Props & {
    side?: 'top' | 'right' | 'bottom' | 'left';
    sideOffset?: number;
    align?: 'start' | 'center' | 'end';
  }
>(({ className, side = 'right', sideOffset = 8, align = 'center', children, ...props }, ref) => {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Positioner side={side} sideOffset={sideOffset} align={align}>
        <TooltipPrimitive.Popup
          ref={ref}
          className={cn(
            'z-50 overflow-hidden rounded-md bg-stone-900 px-2.5 py-1 text-xs font-medium text-white shadow-md animate-in fade-in-0 zoom-in-95 border border-stone-800',
            className
          )}
          {...props}
        >
          {children}
        </TooltipPrimitive.Popup>
      </TooltipPrimitive.Positioner>
    </TooltipPrimitive.Portal>
  );
});
TooltipContent.displayName = 'TooltipContent';
