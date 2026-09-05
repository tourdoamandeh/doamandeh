'use client';

import * as React from 'react';
import { Sun, Moon, Monitor, Check } from 'lucide-react';
import { useAdminTheme } from './admin-theme';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function AdminThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useAdminTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="size-8 text-muted-foreground hover:text-foreground"
            aria-label="Pilih tema tampilan admin"
          >
            {mounted ? (
              resolvedTheme === 'dark' ? (
                <Moon className="size-4 transition-transform duration-200" />
              ) : (
                <Sun className="size-4 transition-transform duration-200" />
              )
            ) : (
              <span className="size-4" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
        }
      />
      <DropdownMenuContent align="end" className="w-36">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-xs text-muted-foreground">
            Tema Tampilan
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setTheme('light')}
            className="flex items-center justify-between cursor-pointer py-1.5"
          >
            <div className="flex items-center gap-2">
              <Sun className="size-4 text-muted-foreground" />
              <span className="text-xs">Terang</span>
            </div>
            {mounted && theme === 'light' && (
              <Check className="size-3.5 text-primary" />
            )}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setTheme('dark')}
            className="flex items-center justify-between cursor-pointer py-1.5"
          >
            <div className="flex items-center gap-2">
              <Moon className="size-4 text-muted-foreground" />
              <span className="text-xs">Gelap</span>
            </div>
            {mounted && theme === 'dark' && (
              <Check className="size-3.5 text-primary" />
            )}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setTheme('system')}
            className="flex items-center justify-between cursor-pointer py-1.5"
          >
            <div className="flex items-center gap-2">
              <Monitor className="size-4 text-muted-foreground" />
              <span className="text-xs">Sistem</span>
            </div>
            {mounted && theme === 'system' && (
              <Check className="size-3.5 text-primary" />
            )}
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
