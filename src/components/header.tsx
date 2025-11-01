'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from './ui/button';
import { BotMessageSquare } from 'lucide-react';

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-20 flex items-center h-20 px-4 bg-gradient-to-b from-background/50 to-transparent">
      <SidebarTrigger />
      <div className="flex-1" />
      <Button
          variant="ghost"
          size="icon"
          aria-label="Chatbot"
        >
          <BotMessageSquare className="w-6 h-6" />
        </Button>
    </header>
  );
}
