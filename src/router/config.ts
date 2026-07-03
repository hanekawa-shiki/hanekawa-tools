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
    '/query/calendar': {
      title: '日历',
      icon: 'Calendar',
      description: '提供公历、农历日期查询。',
    },
    '/transform/torrent2magnet': {
      title: '种子转磁力链',
      icon: 'Magnet',
      description:
        '将 Torrent 种子文件快速转换为磁力链接，方便直接下载。支持批量转换及 Magnet 导出到文件',
    },
  },

  // 目录级（父级）菜单配置（key 为 pages/ 下的目录名）
  dirMeta: {
    transform: {
      title: '转换',
      icon: 'ArrowLeftRight',
      isActive: true,
    },
    query: {
      title: '查询',
      icon: 'Binoculars',
      isActive: true,
    },
  },

  // 自定义路由（优先级高于自动生成的路由）
  customRoutes: [] as RouteObject[],
};

export default config;
