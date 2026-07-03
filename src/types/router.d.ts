/**
 * 单个页面的菜单配置（按路由路径 key）
 */
interface PageMetaConfig {
  /** 显示在侧边栏的标题 */
  title?: string;
  /** 侧边栏图标名（字符串，从 icon-map.tsx 解析） */
  icon?: string;
  /** 工具描述（用于首页展示） */
  description?: string;
  /** 是否默认展开子菜单 */
  isActive?: boolean;
  /** 是否在侧边栏中隐藏此页面 */
  hidden?: boolean;
}

/**
 * 目录级（父级）菜单配置（按目录名 key）
 * 例如 pages/dev/ 目录下有子页面时，配置 'dev' 来定义父级菜单
 */
interface DirMetaConfig {
  /** 目录在侧边栏显示的标题 */
  title?: string;
  /** 目录在侧边栏显示的图标名 */
  icon?: string;
  /** 是否默认展开子菜单 */
  isActive?: boolean;
  /** 是否在侧边栏中隐藏此目录组 */
  hidden?: boolean;
}

/**
 * 路由配置接口
 */
interface RouterConfig {
  /**
   * 排除的文件/文件夹模式（glob 模式）
   * 默认排除以 _ 开头的文件和文件夹
   */
  excludes: string[];

  /**
   * 页面目录路径（相对于 src）
   */
  pagesDir: string;

  /**
   * 默认布局组件路径（相对于 src）
   * 设置后所有页面路由将作为该布局的子路由
   */
  layoutPath?: string;

  /**
   * 自定义路由配置，会与自动生成的路由合并
   */
  customRoutes?: import('react-router').RouteObject[];

  /**
   * 页面级菜单配置（key 为路由路径，如 '/calendar'）
   * 用于统一管理 title、icon、isActive、hidden 等菜单属性
   */
  pageMeta?: Record<string, PageMetaConfig>;

  /**
   * 目录级（父级）菜单配置（key 为 pages/ 下的目录名，如 'dev'）
   * 用于配置文件夹分组的父级菜单项（标题、图标、是否展开等）
   */
  dirMeta?: Record<string, DirMetaConfig>;
}

/**
 * 页面模块的默认导出类型
 */
interface PageModule {
  default: import('react').ComponentType;
}

/**
 * 自动生成的路由元数据
 */
interface AutoRouteMeta {
  /** 文件原始路径（如 ../pages/home.tsx） */
  filePath: string;
  /** 路由路径（如 /home） */
  path: string;
  /** 从文件名派生的标题（如 Home） */
  title: string;
  /** 页面元数据（可选，来自 pageMeta 配置） */
  pageMeta?: PageMetaConfig;
  /** 动态导入函数 */
  loader: () => Promise<PageModule>;
}
