'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-10 flex items-center h-16 px-4 bg-transparent">
      <SidebarTrigger />
    </header>
  );
}
