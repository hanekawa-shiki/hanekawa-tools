import type { RouteObject } from 'react-router';

const config: RouterConfig = {
  // 扫描的页面目录
  pagesDir: 'pages',

  // 排除的文件/文件夹模式
  excludes: [
    '**/_*',
    '**/*.test.*',
    '**/*.spec.*',
    '**/*.d.ts',
    '**/components/**',
    '**/utils/**',
    '**/hooks/**',
    '404.tsx',
  ],

  // 默认布局组件
  layoutPath: 'layout',

  // 页面级菜单配置（key 为路由路径，如 '/calendar'）
  pageMeta: {
    '/home': {
      title: '首页',
      icon: 'Home',
      hidden: true,
    },
    '/calendar': {
      title: '万年历',
      icon: 'Calendar',
      description: '功能丰富的在线万年历工具，支持公历、农历日期查询与转换。',
    },
    '/transform/torrent2magnet': {
      title: '种子转磁力链',
      icon: 'Magnet',
      description: '将 Torrent 种子文件快速转换为磁力链接，方便直接下载。',
    },
  },

  // 目录级（父级）菜单配置（key 为 pages/ 下的目录名）
  dirMeta: {
    transform: {
      title: '开发工具',
      icon: 'Wrench',
      isActive: true,
    },
  },

  // 自定义路由（优先级高于自动生成的路由）
  customRoutes: [] as RouteObject[],
};

export default config;
