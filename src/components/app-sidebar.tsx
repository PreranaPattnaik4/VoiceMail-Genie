'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarGroup,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import {
  BotMessageSquare,
  Languages,
  PenSquare,
  Settings,
  Mic,
  Smile,
} from 'lucide-react';
import { Button } from './ui/button';

export function AppSidebar() {
  const { isMobile } = useSidebar();
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <BotMessageSquare className="w-8 h-8 text-primary" />
          <h2 className="text-xl font-semibold font-headline">
            VoiceMail Genie
          </h2>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarGroup>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    tooltip="AI-Powered Email Generation"
                    isActive
                  >
                    <PenSquare />
                    <span>AI Email Generation</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Multi-language Support">
                    <Languages />
                    <span>Multi-language</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Tone Adjustment">
                    <Smile />
                    <span>Tone Adjustment</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Voice Input">
                    <Mic />
                    <span>Voice Input</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="flex items-center gap-2">
        <Avatar>
          <AvatarImage
            src="https://picsum.photos/seed/1/40/40"
            alt="User"
          />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <div
          className={`flex flex-col overflow-hidden transition-all duration-200 ${
            isMobile ? 'w-full' : 'w-full group-data-[collapsible=icon]:w-0'
          }`}
        >
          <p className="font-semibold text-sm">User</p>
          <p className="text-xs text-muted-foreground">user@example.com</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto"
          aria-label="Settings"
        >
          <Settings className="w-5 h-5" />
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
