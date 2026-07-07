import { ChevronRightIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useRef } from 'react';
import { NavLink, useLocation } from 'react-router';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { useSidebar } from '@/components/ui/sidebar-context';

export function NavMain({ items }: { items: NavMainItem[] }) {
  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => (
          <NavMenuItem key={item.title} item={item} />
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

function NavMenuItem({ item }: { item: NavMainItem }) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const location = useLocation();
  const { isMobile, setOpenMobile } = useSidebar();
  const isParent = item.items != null && item.items.length > 0;

  const isActive = !isParent && location.pathname === item.url;

  const toggleCollapse = () => {
    triggerRef.current?.click();
  };

  const closeMobileSidebar = () => {
    if (isMobile === true) {
      setOpenMobile(false);
    }
  };

  return (
    <Collapsible defaultOpen={item.isActive || isActive}>
      <SidebarMenuItem>
        <NavMenuButton
          item={item}
          isParent={isParent}
          isActive={isActive}
          onClick={isParent && !item.url ? toggleCollapse : undefined}
          onNavigate={closeMobileSidebar}
        />

        {isParent ? (
          <>
            <CollapsibleTrigger
              ref={triggerRef}
              render={<SidebarMenuAction className="data-[state=open]:rotate-90" />}
            >
              <HugeiconsIcon icon={ChevronRightIcon} size={16} />
              <span className="sr-only">Toggle</span>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                {item.items!.map((subItem) => (
                  <SidebarMenuSubItem key={subItem.title}>
                    <SidebarMenuSubButton
                      render={(props) => (
                        <NavLink
                          {...props}
                          to={subItem.url}
                          className={({ isActive: active }) =>
                            `${props.className ?? ''} ${active ? 'bg-sidebar-accent text-sidebar-accent-foreground' : ''}`
                          }
                        >
                          {subItem.icon}
                          <span>{subItem.title}</span>
                        </NavLink>
                      )}
                      isActive={location.pathname === subItem.url}
                      onClick={closeMobileSidebar}
                    />
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            </CollapsibleContent>
          </>
        ) : null}
      </SidebarMenuItem>
    </Collapsible>
  );
}

function NavMenuButton({
  item,
  isParent,
  isActive,
  onClick,
  onNavigate,
}: {
  item: NavMainItem;
  isParent: boolean;
  isActive: boolean;
  onClick?: () => void;
  onNavigate?: () => void;
}) {
  if (isParent && !item.url) {
    return (
      <SidebarMenuButton tooltip={item.title} onClick={onClick} isActive={isActive}>
        {item.icon}
        {item.title}
      </SidebarMenuButton>
    );
  }

  return (
    <SidebarMenuButton
      tooltip={item.title}
      isActive={isActive}
      onClick={onNavigate}
      render={(props) => (
        <NavLink
          {...props}
          to={item.url}
          className={({ isActive: active }) =>
            `${props.className ?? ''} ${active ? 'bg-sidebar-accent text-sidebar-accent-foreground' : ''}`
          }
        >
          {item.icon}
          {item.title}
        </NavLink>
      )}
    />
  );
}
