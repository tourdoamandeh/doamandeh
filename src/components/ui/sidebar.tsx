'use client';

import * as React from 'react';
import { PanelLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

const SIDEBAR_COOKIE_NAME = 'sidebar_state';
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_KEYBOARD_SHORTCUT = 'b';

interface SidebarContextValue {
  state: 'expanded' | 'collapsed';
  open: boolean;
  setOpen: (open: boolean | ((value: boolean) => boolean)) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean | ((value: boolean) => boolean)) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
}

const SidebarContext = React.createContext<SidebarContextValue | null>(null);

export function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider.');
  }
  return context;
}

export const SidebarProvider = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'> & {
    defaultOpen?: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
  }
>(
  (
    {
      defaultOpen = true,
      open: openProp,
      onOpenChange: setOpenProp,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const [isMobile, setIsMobile] = React.useState(false);
    const [openMobile, setOpenMobile] = React.useState(false);

    const [_open, _setOpen] = React.useState(defaultOpen);
    const open = openProp ?? _open;
    const setOpen = React.useCallback(
      (value: boolean | ((value: boolean) => boolean)) => {
        const openState = typeof value === 'function' ? value(open) : value;
        if (setOpenProp) {
          setOpenProp(openState);
        } else {
          _setOpen(openState);
        }
        document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
      },
      [setOpenProp, open]
    );

    React.useEffect(() => {
      const checkMobile = () => {
        setIsMobile(window.innerWidth < 768);
      };
      checkMobile();
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const toggleSidebar = React.useCallback(() => {
      return isMobile ? setOpenMobile((prev) => !prev) : setOpen((prev) => !prev);
    }, [isMobile, setOpen, setOpenMobile]);

    React.useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (
          event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
          (event.metaKey || event.ctrlKey)
        ) {
          event.preventDefault();
          toggleSidebar();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }, [toggleSidebar]);

    const state = open ? 'expanded' : 'collapsed';

    const contextValue = React.useMemo<SidebarContextValue>(
      () => ({
        state,
        open,
        setOpen,
        isMobile,
        openMobile,
        setOpenMobile,
        toggleSidebar,
      }),
      [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar]
    );

    return (
      <SidebarContext.Provider value={contextValue}>
        <div
          className={cn(
            'flex min-h-screen w-full bg-[#FAFAF9] text-[#171717]',
            className
          )}
          ref={ref}
          {...props}
        >
          {children}
        </div>
      </SidebarContext.Provider>
    );
  }
);
SidebarProvider.displayName = 'SidebarProvider';

export const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'> & {
    side?: 'left' | 'right';
    variant?: 'sidebar' | 'floating' | 'inset';
    collapsible?: 'offcanvas' | 'icon' | 'none';
  }
>(
  (
    {
      side = 'left',
      variant = 'sidebar',
      collapsible = 'icon',
      className,
      children,
      ...props
    },
    ref
  ) => {
    const { isMobile, state, openMobile, setOpenMobile } = useSidebar();

    // Mobile sheet sidebar
    if (isMobile) {
      return (
        <>
          {openMobile && (
            <div
              onClick={() => setOpenMobile(false)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity"
            />
          )}
          <aside
            ref={ref}
            data-mobile="true"
            data-state={openMobile ? 'open' : 'closed'}
            className={cn(
              'fixed inset-y-0 left-0 z-50 flex h-full w-64 flex-col border-r border-stone-800 bg-[#101010] p-3 text-[#A3A3A3] shadow-2xl transition-transform duration-200 ease-in-out',
              openMobile ? 'translate-x-0' : '-translate-x-full',
              className
            )}
            {...props}
          >
            {children}
          </aside>
        </>
      );
    }

    // Desktop collapsible sidebar
    const widthClass = state === 'expanded' ? 'w-60' : 'w-14';

    return (
      <div
        ref={ref}
        data-state={state}
        data-collapsible={state === 'collapsed' ? collapsible : ''}
        data-variant={variant}
        data-side={side}
        className={cn(
          'group/sidebar relative hidden shrink-0 md:block transition-[width] duration-200 ease-linear',
          widthClass,
          className
        )}
      >
        {/* Fixed content inside the width-constrained container */}
        <aside
          className={cn(
            'fixed inset-y-0 left-0 z-20 flex h-screen flex-col justify-between border-r border-stone-800 bg-[#101010] p-3 text-[#A3A3A3] transition-[width] duration-200 ease-linear overflow-x-hidden',
            widthClass
          )}
          {...props}
        >
          {children}
        </aside>
      </div>
    );
  }
);
Sidebar.displayName = 'Sidebar';

export const SidebarTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<'button'>
>(({ className, onClick, ...props }, ref) => {
  const { toggleSidebar } = useSidebar();

  return (
    <button
      ref={ref}
      data-slot="sidebar-trigger"
      type="button"
      onClick={(event) => {
        onClick?.(event);
        toggleSidebar();
      }}
      className={cn(
        'inline-flex h-8 w-8 items-center justify-center rounded-md text-stone-500 hover:bg-stone-100 hover:text-stone-900 transition-colors cursor-pointer',
        className
      )}
      {...props}
    >
      <PanelLeft className="h-4 w-4" />
      <span className="sr-only">Toggle Sidebar</span>
    </button>
  );
});
SidebarTrigger.displayName = 'SidebarTrigger';

export const SidebarRail = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<'button'>
>(({ className, ...props }, ref) => {
  const { toggleSidebar } = useSidebar();

  return (
    <button
      ref={ref}
      data-slot="sidebar-rail"
      aria-label="Toggle Sidebar"
      tabIndex={-1}
      onClick={toggleSidebar}
      title="Toggle Sidebar"
      className={cn(
        'absolute inset-y-0 -right-2 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] hover:after:bg-stone-700 sm:flex cursor-w-resize',
        className
      )}
      {...props}
    />
  );
});
SidebarRail.displayName = 'SidebarRail';

export const SidebarInset = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'main'>
>(({ className, ...props }, ref) => {
  return (
    <main
      ref={ref}
      data-slot="sidebar-inset"
      className={cn(
        'relative flex min-h-screen flex-1 min-w-0 flex-col bg-[#FAFAF9] overflow-x-hidden',
        className
      )}
      {...props}
    />
  );
});
SidebarInset.displayName = 'SidebarInset';

export const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-slot="sidebar-header"
      className={cn('flex flex-col gap-2 pb-3 border-b border-stone-800/80 shrink-0', className)}
      {...props}
    />
  );
});
SidebarHeader.displayName = 'SidebarHeader';

export const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-slot="sidebar-footer"
      className={cn('flex flex-col gap-2 pt-3 border-t border-stone-800/80 shrink-0', className)}
      {...props}
    />
  );
});
SidebarFooter.displayName = 'SidebarFooter';

export const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-slot="sidebar-content"
      className={cn(
        'flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto overflow-x-hidden py-2',
        className
      )}
      {...props}
    />
  );
});
SidebarContent.displayName = 'SidebarContent';

export const SidebarGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-slot="sidebar-group"
      className={cn('relative flex w-full min-w-0 flex-col py-1', className)}
      {...props}
    />
  );
});
SidebarGroup.displayName = 'SidebarGroup';

export const SidebarGroupLabel = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'> & { asChild?: boolean }
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-slot="sidebar-group-label"
      className={cn(
        'flex h-7 shrink-0 items-center rounded-md px-2 text-[10px] font-mono font-medium uppercase tracking-wider text-stone-500 outline-none transition-[opacity] duration-200 group-data-[state=collapsed]/sidebar:opacity-0',
        className
      )}
      {...props}
    />
  );
});
SidebarGroupLabel.displayName = 'SidebarGroupLabel';

export const SidebarGroupContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="sidebar-group-content"
    className={cn('w-full text-xs space-y-1', className)}
    {...props}
  />
));
SidebarGroupContent.displayName = 'SidebarGroupContent';

export const SidebarMenu = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<'ul'>
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    data-slot="sidebar-menu"
    className={cn('flex w-full min-w-0 flex-col gap-1', className)}
    {...props}
  />
));
SidebarMenu.displayName = 'SidebarMenu';

export const SidebarMenuItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<'li'>
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    data-slot="sidebar-menu-item"
    className={cn('group/menu-item relative', className)}
    {...props}
  />
));
SidebarMenuItem.displayName = 'SidebarMenuItem';

export const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<'button'> & {
    isActive?: boolean;
    tooltip?: string;
  }
>(
  (
    {
      isActive = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        data-slot="sidebar-menu-button"
        data-active={isActive}
        className={cn(
          'flex h-8 w-full items-center gap-2.5 rounded-lg px-2.5 text-xs font-medium text-[#A3A3A3] transition-colors hover:bg-stone-900 hover:text-white group-data-[state=collapsed]/sidebar:justify-center group-data-[state=collapsed]/sidebar:px-2',
          isActive && 'bg-stone-800 text-white font-semibold',
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
SidebarMenuButton.displayName = 'SidebarMenuButton';
