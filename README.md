# Hanekawa Tools

[![code style](https://antfu.me/badge-code-style.svg)](https://github.com/antfu/eslint-config)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

> 我不是无所不知，只是刚好知道而已。

## ✨ 功能特性

- **万年历** — 公历/农历日期查询，支持节假日显示、天干地支、生肖、节气
- **油价查询** — 查询全国各地最新 92#、95# 汽油及 0# 柴油价格
- **种子转磁力链** — 将 Torrent 文件转换为 Magnet 链接，支持批量转换及导出
- **发票合并** — 多张发票 PDF 合并到 A4 页面，支持 @dnd-kit 拖拽排序、2/4 张布局、导出打印
- **暗色模式** — 支持深色/浅色/跟随系统主题切换
- **响应式设计** — 移动端/桌面端自适应布局
- **全局通知** — 操作成功/失败实时 Toast 提示
- **PWA 支持** — 可安装为本地应用，支持离线访问与新版本更新提示
- **代码分割** — 按路由懒加载 + 第三方库分 chunk，优化首屏加载

## 🛠️ 技术栈

| 分类     | 技术                             |
| -------- | -------------------------------- |
| 框架     | React 19 + TypeScript 6          |
| 构建     | Vite 8                           |
| 样式     | Tailwind CSS 4                   |
| UI 组件  | Base UI + shadcn/ui (base-maia)  |
| 图标     | Hugeicons                        |
| 路由     | react-router 8                   |
| HTTP     | axios                            |
| 提示框   | sonner                           |
| 日期     | dayjs + lunisolar                |
| PDF 合并 | pdf-lib                          |
| 拖拽排序 | @dnd-kit/react                   |
| PWA      | vite-plugin-pwa + workbox-window |

## 🚀 快速开始

### 环境要求

- Node.js >= 24
- pnpm 10.34.5

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm start
```

### 构建部署

```bash
# Cloudflare Workers 构建
pnpm build:cf

# GitHub Pages 构建
pnpm build:gh
```

## 📁 项目结构

```
hanekawa-tools/
├── env/                  # 多环境配置
├── src/
│   ├── api/              # API 接口层
│   ├── components/       # 公共组件 + shadcn/ui
│   │   └── sw-update-toast.tsx  # PWA 版本更新提示
│   ├── data/             # 数据层（节假日等）
│   ├── hooks/            # 自定义 Hooks
│   ├── layout/           # 布局组件
│   ├── lib/              # 工具函数
│   ├── pages/            # 页面组件（自动生成路由）
│   │   ├── query/        # 查询类工具（日历、油价）
│   │   └── transform/    # 转换类工具（种子转磁力链、发票合并）
│   ├── router/           # 路由配置（自动路由 + 代码分割）
│   └── types/            # 全局类型声明
├── vite-plugins/         # 自定义 Vite 插件
│   ├── fontSwitch.ts     # 字体切换（dev 本地 / prod CDN）
│   └── htmlBuildTime.ts  # 构建时间注入
├── vite.config.ts
└── package.json
```

## 🔧 开发指南

### 新增工具页面

1. 在 `src/pages/` 下创建 `.tsx` 文件
2. 路由和菜单自动生成，无需手动配置
3. 在 `src/router/config.ts` 的 `pageMeta` 中添加标题、图标等配置

### 添加新图标

在 `src/router/icon-map.tsx` 中注册 Hugeicons 图标：

```tsx
import { NewIcon } from '@hugeicons/core-free-icons';

const iconMap = {
  // ... 其他图标
  NewIcon,
};
```

### API 接口开发

```typescript
// src/api/index.ts
export const newApi = createApi<ResponseType>({
  method: 'POST',
  url: '/new-endpoint',
});
```

## 📦 环境变量

| 变量                | 说明         | 示例值                              |
| ------------------- | ------------ | ----------------------------------- |
| `VITE_API_BASE_URL` | API 基础路径 | `/api` 或 `https://api.example.com` |
| `VITE_BASE_PATH`    | 部署基础路径 | `/`                                 |
| `VITE_OUT_DIR`      | 输出目录     | `dist`                              |

## 🎨 设计规范

- **颜色主题**：基于 shadcn/ui 的 olive 配色方案
- **字体**：LXGW WenKai（开发环境本地包，生产环境 CDN）+ Inter Variable + Figtree Variable
- **深色模式**：通过 CSS 变量自动切换
- **动画**：使用 `tw-animate-css` 提供的过渡效果

## ⚡ 性能优化

- **路由懒加载**：所有页面组件通过 `React.lazy` + `Suspense` 按需加载
- **代码分割**：Vite `manualChunks` 将第三方库拆分为独立 chunk（react、pdf-lib、dnd-kit、icons 等）
- **Brotli 压缩**：构建产物使用 Brotli 级别 11 压缩
- **PWA 离线缓存**：Workbox 预缓存静态资源 + API 响应 NetworkFirst 策略
- **节假日数据缓存**：内存 Map 缓存，避免重复请求

## 📝 许可证

MIT License © [hanekawa-shiki]
