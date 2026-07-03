import { ChevronRightIcon } from 'lucide-react';
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
  useSidebar,
} from '@/components/ui/sidebar';

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
  const isParent = !!(item.items && item.items.length > 0);

  // 父菜单项不因子项激活而高亮
  const isActive = !isParent && location.pathname === item.url;

  const toggleCollapse = () => {
    triggerRef.current?.click();
  };

  // 移动端点击导航后自动隐藏侧边栏
  const closeMobileSidebar = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <Collapsible asChild defaultOpen={item.isActive || isActive}>
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
            <CollapsibleTrigger ref={triggerRef} asChild>
              <SidebarMenuAction className="data-[state=open]:rotate-90">
                <ChevronRightIcon />
                <span className="sr-only">Toggle</span>
              </SidebarMenuAction>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                {item.items!.map((subItem) => (
                  <SidebarMenuSubItem key={subItem.title}>
                    <SidebarMenuSubButton
                      asChild
                      isActive={location.pathname === subItem.url}
                      onClick={closeMobileSidebar}
                    >
                      <NavLink
                        to={subItem.url}
                        className={({ isActive: active }) =>
                          active ? 'bg-sidebar-accent text-sidebar-accent-foreground' : ''
                        }
                      >
                        {subItem.icon}
                        <span>{subItem.title}</span>
                      </NavLink>
                    </SidebarMenuSubButton>
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

/**
 * 菜单按钮：
 * - 无子菜单 → NavLink 正常跳转
 * - 有子菜单 + 无 url → 按钮展开/折叠，不跳转
 * - 有子菜单 + 有 url → NavLink 跳转
 */
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
      <SidebarMenuButton asChild={false} tooltip={item.title} onClick={onClick} isActive={isActive}>
        {item.icon}
        {item.title}
      </SidebarMenuButton>
    );
  }

  return (
    <SidebarMenuButton asChild tooltip={item.title} isActive={isActive} onClick={onNavigate}>
      <NavLink
        to={item.url}
        className={({ isActive: active }) =>
          active ? 'bg-sidebar-accent text-sidebar-accent-foreground' : ''
        }
      >
        {item.icon}
        {item.title}
      </NavLink>
    </SidebarMenuButton>
  );
}
