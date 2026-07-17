# Hanekawa Tools

[![code style](https://antfu.me/badge-code-style.svg)](https://github.com/antfu/eslint-config)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

> 个人整理的实用工具集合网站，提供日常开发中常用的转换、查询工具。

## ✨ 功能特性

- **万年历** — 公历/农历日期查询，支持节假日显示、天干地支、生肖、节气
- **油价查询** — 查询全国各地最新 92#、95# 汽油及 0# 柴油价格
- **种子转磁力链** — 将 Torrent 文件转换为 Magnet 链接，支持批量转换及导出
- **暗色模式** — 支持深色/浅色/跟随系统主题切换
- **响应式设计** — 移动端/桌面端自适应布局
- **全局通知** — 操作成功/失败实时 Toast 提示

## 🛠️ 技术栈

| 分类    | 技术                            |
| ------- | ------------------------------- |
| 框架    | React 19 + TypeScript 6         |
| 构建    | Vite 8                          |
| 样式    | Tailwind CSS 4                  |
| UI 组件 | Base UI + shadcn/ui (base-maia) |
| 图标    | Hugeicons                       |
| 路由    | react-router 8                  |
| HTTP    | axios                           |
| 提示框  | sonner                          |
| 日期    | dayjs + lunisolar               |

## 🚀 快速开始

### 环境要求

- Node.js >= 24
- pnpm 10.34.4

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
│   ├── data/             # 数据层（节假日等）
│   ├── hooks/            # 自定义 Hooks
│   ├── layout/           # 布局组件
│   ├── lib/              # 工具函数
│   ├── pages/            # 页面组件（自动生成路由）
│   │   ├── query/        # 查询类工具（日历、油价）
│   │   └── transform/    # 转换类工具（种子转磁力链）
│   ├── router/           # 路由配置
│   └── types/            # 全局类型声明
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
- **字体**：LXGW WenKai（CDN）+ Inter Variable + Figtree Variable
- **深色模式**：通过 CSS 变量自动切换
- **圆角**：4xl（`rounded-4xl`）
- **动画**：使用 `tw-animate-css` 提供的过渡效果

## 📝 许可证

MIT License © [hanekawa-shiki]
