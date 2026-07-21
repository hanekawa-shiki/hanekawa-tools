import type { RouteObject } from 'react-router';

const config: RouterConfig = {
  pagesDir: 'pages',

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

  layoutPath: 'layout',

  pageMeta: {
    '/home': {
      title: '首页',
      icon: 'HomeIcon',
      hidden: true,
    },
    '/query/calendar': {
      title: '日历',
      icon: 'CalendarIcon',
      description: '提供公历、农历日期查询。',
    },
    '/query/oil-prices': {
      title: '油价',
      icon: 'FuelStationIcon',
      description: '查询全国各地最新汽油、柴油价格。',
    },
    '/transform/torrent2magnet': {
      title: '种子转磁力链',
      icon: 'MagnetIcon',
      description:
        '将 Torrent 种子文件快速转换为磁力链接，方便直接下载。支持批量转换及 Magnet 导出到文件',
    },
    '/transform/invoice-merge': {
      title: '发票合并',
      icon: 'Layers01Icon',
      description: '将多张发票 PDF 合并到 A4 页面上，支持 2 张或 4 张排列，拖拽排序后导出打印。',
    },
    '/transform/color-picker': {
      title: '取色器',
      icon: 'ColorPickerIcon',
      description: '在线取色器，支持 HEX、RGB、HSL、HSV、CMYK 等多种颜色格式一键复制。',
    },
    '/query/media-types': {
      title: 'Media Types',
      icon: 'FileTypeIcon',
      description: '查询全部 Media Type（MIME 类型），支持文件后缀和类型名模糊搜索。',
    },
  },

  dirMeta: {
    transform: {
      title: '转换',
      icon: 'ArrowLeftRightIcon',
      isActive: true,
    },
    query: {
      title: '查询',
      icon: 'BinocularsIcon',
      isActive: true,
    },
  },

  customRoutes: [] as RouteObject[],
};

export default config;
