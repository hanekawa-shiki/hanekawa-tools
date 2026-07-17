'use client';

import type * as React from 'react';
import avatarImg from '@/assest/avatar.jpeg';
import { NavMain } from '@/components/nav-main';

import { Sidebar, SidebarContent, SidebarFooter } from '@/components/ui/sidebar';

import { getRouteMenuItems } from '@/router/auto-routes';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const routeMenuItems = getRouteMenuItems();

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarContent>
        <NavMain items={routeMenuItems} />
      </SidebarContent>
      <SidebarFooter>
        <div className="flex flex-col items-center gap-3 px-2 py-4">
          <img
            src={avatarImg}
            alt="avatar"
            className="aspect-square w-full rounded-full object-cover shadow-md"
          />
          <div className="flex flex-col items-center text-center leading-tight">
            <span className="text-sm font-semibold">Hanekawa Tools</span>
            <span
              className="mt-0.5 text-xs text-muted-foreground"
              title="何でもは知らないわよ。知ってることだけ"
            >
              我不是无所不知，只是刚好知道而已。
            </span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
