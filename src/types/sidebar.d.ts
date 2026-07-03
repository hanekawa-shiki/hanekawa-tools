/**
 * NavMain 菜单项接口
 */
interface NavMainItem {
  /** 菜单标题 */
  title: string;
  /** 菜单链接 URL */
  url: string;
  /** 菜单图标（可选） */
  icon?: import('react').ReactNode;
  /** 是否默认展开 */
  isActive?: boolean;
  /** 子菜单项 */
  items?: NavMainSubItem[];
}

/**
 * NavMain 子菜单项接口
 */
interface NavMainSubItem {
  /** 子菜单标题 */
  title: string;
  /** 子菜单链接 URL */
  url: string;
  /** 子菜单图标（可选） */
  icon?: import('react').ReactNode;
}

/**
 * Sidebar 数据接口
 */
interface SidebarData {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
  navMain: NavMainItem[];
  navSecondary: NavMainSubItem[];
  projects: {
    name: string;
    url: string;
    icon: import('react').ReactNode;
  }[];
}
