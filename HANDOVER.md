# 项目交接文档

> 最后更新：2026-07-15
> 最新 commit：`8d0a2498` (feat: torrent delete + toast colors)
> 仓库地址：git@github.com:hanekawa-shiki/hanekawa-tools.git

---

## 一、技术栈与核心依赖版本

| 分类         | 技术                                   | 版本    |
| ------------ | -------------------------------------- | ------- |
| 框架         | React                                  | 19.2.7  |
| 构建         | Vite                                   | 8.1.3   |
| 语言         | TypeScript                             | ~6.0.3  |
| 样式         | Tailwind CSS                           | 4.3.2   |
| UI 组件      | Base UI (@base-ui/react)               | 1.6.0   |
| 图标         | Hugeicons (@hugeicons/react)           | 1.1.9   |
| 路由         | react-router                           | 8.1.0   |
| HTTP         | axios                                  | 1.18.1  |
| 提示框       | sonner                                 | 2.0.7   |
| 日期         | dayjs                                  | 1.11.21 |
| 农历         | lunisolar                              | 2.6.0   |
| Torrent 解析 | parse-torrent                          | 11.0.21 |
| 包管理       | pnpm                                   | 10.34.4 |
| Node         | Node.js                                | >=24    |
| Lint         | @antfu/eslint-config                   | 9.1.0   |
| Formatter    | Prettier + prettier-plugin-tailwindcss | 3.9.4   |

**已移除**：`@radix-ui/*`（已迁移到 Base UI）、`lucide-react`（已迁移到 hugeicons）

---

## 二、项目目录结构

```
hanekawa-tools/
├── env/                           # 多环境配置
│   ├── .env                       # dev 默认（VITE_API_BASE_URL=/api）
│   ├── .env.cf                    # Cloudflare Workers 部署（VITE_API_BASE_URL=/api）
│   └── .env.gh                    # GitHub Pages 部署（VITE_API_BASE_URL=完整 worker URL）
├── src/
│   ├── api/                       # API 接口层
│   │   ├── request.ts             # createApi 泛型封装（method/url → 返回函数）
│   │   └── index.ts               # 接口列表（fetchHolidayApi、fetchOilPriceApi）
│   ├── assest/                    # 静态资源
│   │   └── avatar.jpeg            # 侧边栏头像图片
│   ├── components/
│   │   ├── app-sidebar.tsx        # 侧边栏：头像（SidebarFooter）+ 导航菜单
│   │   ├── nav-main.tsx           # 导航菜单（Base UI render 语法 + hugeicons）
│   │   ├── mode-toggle.tsx        # 深色/浅色/跟随系统切换
│   │   ├── page-header.tsx        # 页面标题组件
│   │   ├── theme-provider.tsx     # 主题上下文 Provider
│   │   └── ui/                    # shadcn/ui 基础组件（Base UI 版）
│   │       ├── button.tsx         # Button 组件（Base UI Button primitive）
│   │       ├── button-variants.ts # 按钮变体定义
│   │       ├── card.tsx           # Card 组件
│   │       ├── collapsible.tsx    # Collapsible 折叠面板
│   │       ├── dropdown-menu.tsx  # DropdownMenu 下拉菜单（HugeiconsIcon）
│   │       ├── input.tsx          # Input 输入框
│   │       ├── select.tsx         # Select 下拉选择
│   │       ├── separator.tsx      # Separator 分隔线
│   │       ├── sheet.tsx          # Sheet 抽屉组件
│   │       ├── sidebar.tsx        # 侧边栏核心组件（useRender + render prop）
│   │       ├── sidebar-context.ts # 侧边栏 Context
│   │       ├── skeleton.tsx       # Skeleton 骨架屏
│   │       ├── sonner.tsx         # Toast 通知（适配 useTheme + 按类型着色图标）
│   │       ├── table.tsx          # Table 表格组件
│   │       └── tooltip.tsx        # Tooltip 提示
│   ├── data/
│   │   └── holidays.ts            # 法定节假日（从 worker API 获取 + 内存缓存）
│   ├── hooks/
│   │   └── use-mobile.ts          # 移动端检测 Hook
│   ├── layout/
│   │   └── index.tsx              # 主布局：SidebarProvider + Header + 可滚动 children
│   ├── lib/
│   │   ├── request.ts             # axios 实例（baseURL 从 VITE_API_BASE_URL 读取）
│   │   └── utils.ts               # cn() 工具函数
│   ├── pages/
│   │   ├── 404.tsx                # 404 页面
│   │   ├── index.tsx              # 首页（工具卡片列表，读取 config.pageMeta）
│   │   ├── query/
│   │   │   ├── calendar.tsx       # 日历主页面（~100行，组合子组件）
│   │   │   ├── oil-prices.tsx     # 油价页面（全国各地油价查询，PC 双列/移动单列）
│   │   │   └── components/        # 日历子组件（被 excludes 排除，不生成路由菜单）
│   │   │       ├── calendar-utils.ts      # 工具函数 + CalendarCell 类型 + 常量
│   │   │       ├── CalendarDateDetail.tsx  # 右侧日期详情面板
│   │   │       ├── CalendarDayCell.tsx     # 单个日期格子
│   │   │       ├── CalendarLegend.tsx      # 图例
│   │   │       ├── CalendarMonthGrid.tsx   # 月历网格
│   │   │       └── CalendarNav.tsx         # 导航栏（年/月选择）
│   │   └── transform/
│   │       └── torrent2magnet.tsx  # 种子转磁力链工具（支持逐条删除 + 清除全部）
│   ├── router/
│   │   ├── auto-routes.ts         # import.meta.glob 自动路由生成
│   │   ├── config.ts              # 路由配置（pageMeta/dirMeta/icons/excludes）
│   │   ├── icon-map.tsx           # 字符串→hugeicons 图标映射表
│   │   ├── index.tsx              # 路由入口（Lazy + Layout 组装）
│   │   └── not-found.tsx          # 404 路由组件
│   └── types/                     # 全局类型声明（.d.ts，无需 import）
│       ├── globals.d.ts           # 主入口（引用其他 .d.ts）
│       ├── api.d.ts               # API 相关类型（ApiRequestConfig、HolidayApiResponse、OilPriceApiResponse 等）
│       ├── holidays.d.ts          # 节假日类型（Holiday 等）
│       ├── router.d.ts            # 路由类型（RouterConfig/AutoRouteMeta 等）
│       ├── sidebar.d.ts           # 侧边栏类型（NavMainItem 等）
│       ├── theme.d.ts             # 主题类型（Theme/ThemeProviderProps 等）
│       └── pages/
│           ├── calendar.d.ts      # 日历页面类型
│           └── torrent2magnet.d.ts# 种子转磁力链类型（TorrentInfo 等）
├── components.json                # shadcn 配置（base-maia 风格，hugeicons 图标库）
├── vite.config.ts                 # Vite 配置（env/ 目录 + API proxy + https-proxy-agent）
└── vite-plugins/
    └── htmlBuildTime.ts           # 构建时间注入到 HTML
```

---

## 三、核心架构说明

### 自动路由系统

- `src/router/auto-routes.ts` 使用 `import.meta.glob` 扫描 `src/pages/` 下所有 `.tsx` 文件自动生成路由
- 排除规则在 `config.ts` 的 `excludes` 数组中（如 `**/components/**`、`**/hooks/**`）
- 菜单配置在 `config.ts` 的 `pageMeta`（页面级：title/icon/isActive/hidden）和 `dirMeta`（目录级）中
- **新增页面**：只需在 `src/pages/` 下创建 `.tsx` 文件，路由和菜单自动生成

### API 层架构

```
src/lib/request.ts（axios 实例，baseURL 从 import.meta.env.VITE_API_BASE_URL 读取，带 toast 错误拦截）
    ↓
src/api/request.ts（createApi 泛型封装：method + url → 返回请求函数）
    ↓
src/api/index.ts（具体接口定义，如 fetchHolidayApi、fetchOilPriceApi）
    ↓
src/data/holidays.ts（节假日业务逻辑：缓存 + 数据转换 + getHolidayInfo）
```

### 多环境构建

| 环境 | 命令            | VITE_API_BASE_URL                                      | 输出目录 |
| ---- | --------------- | ------------------------------------------------------ | -------- |
| dev  | `pnpm start`    | `/api`（走 vite proxy 转发）                           | -        |
| CF   | `pnpm build:cf` | `/api`                                                 | dist-cf/ |
| GH   | `pnpm build:gh` | `https://holiday-cn-worker.angelbeast.workers.dev/api` | dist-gh/ |

### 日历组件拆分

calendar.tsx 原 500+ 行，已拆分为 7 个文件：

- `calendar-utils.ts`：工具函数（getDaysInMonth, getWeekdayNames, buildCalendarCells 等）、CalendarCell 类型、MONTH_NAMES 常量
- `CalendarDayCell.tsx`：单个日期格子（休/班标签、节假日背景色、农历/节气显示）
- `CalendarMonthGrid.tsx`：月历网格（星期头 + 日期格子 grid）
- `CalendarDateDetail.tsx`：右侧详情面板（公历、农历、天干地支、节气、节假日）
- `CalendarLegend.tsx`：图例（休/班/节气样式说明）
- `CalendarNav.tsx`：导航栏（年/月 Select 选择 + 一周起始日）
- `calendar.tsx`：主页面（状态管理 + useEffect 获取节假日 + 组合子组件）

### 图标系统

- 统一使用 `@hugeicons/core-free-icons` + `@hugeicons/react`（`HugeiconsIcon` 组件）
- 菜单图标通过字符串配置（如 `'CalendarIcon'`），`icon-map.tsx` 映射为 hugeicons 对象
- `resolveIcon(iconRef, className)` 函数接收字符串返回 React 节点

### 路由/组件目录排除规则

以下目录中的 `.tsx` 文件**不会**生成路由或菜单项：

- `**/components/**`（如 `src/pages/query/components/`）
- `**/hooks/**`
- `**/utils/**`
- `**/_*`（以下划线开头）
- `404.tsx`

---

## 四、当前进度总结

### ✅ 已完成的功能

| 功能            | 状态    | 关键文件                                                          |
| --------------- | ------- | ----------------------------------------------------------------- |
| 自动路由系统    | ✅ 完成 | `src/router/auto-routes.ts`, `config.ts`                          |
| 侧边栏导航      | ✅ 完成 | `src/components/nav-main.tsx`, `app-sidebar.tsx`                  |
| 头像区域        | ✅ 完成 | `src/components/app-sidebar.tsx`（头像在 SidebarFooter）          |
| 主题切换        | ✅ 完成 | `src/components/mode-toggle.tsx`, `theme-provider.tsx`            |
| 日历万年历      | ✅ 完成 | `src/pages/query/calendar.tsx` + 5个子组件（Calendar* 前缀）      |
| 日历节假日接口  | ✅ 完成 | `src/data/holidays.ts`（从 worker API 获取 + 内存缓存）           |
| 油价查询        | ✅ 完成 | `src/pages/query/oil-prices.tsx`（全国油价，PC 双列/移动单列）    |
| 种子转磁力链    | ✅ 完成 | `src/pages/transform/torrent2magnet.tsx`（含逐条删除 + 清除全部） |
| 404 页面        | ✅ 完成 | `src/pages/404.tsx`                                               |
| API 请求封装    | ✅ 完成 | `src/lib/request.ts`, `src/api/request.ts`, `src/api/index.ts`    |
| 全局 Toast 通知 | ✅ 完成 | `sonner`，按类型着色图标（success/info/warning/error）            |
| 多环境构建配置  | ✅ 完成 | `env/.env`, `env/.env.cf`, `env/.env.gh`                          |
| Base UI 迁移    | ✅ 完成 | 所有 `asChild` → `render` 语法已转换                              |
| hugeicons 迁移  | ✅ 完成 | 所有 `lucide-react` → `hugeicons` 已替换                          |
| radix-ui 移除   | ✅ 完成 | `pnpm remove radix-ui lucide-react`                               |

### 🟡 待完善 / 已知问题

1. **`icon-map.tsx` 类型问题**：`iconMap` 使用 `Record<string, unknown>` + `as typeof CalendarIcon` 断言，是因为 hugeicons 的 SVG 对象类型无法直接用 TypeScript 类型表达。暂用 `unknown` 存储，运行时正常。

2. **ESLint 类型安全警告**：在 `src/lib/request.ts` 和 `src/router/icon-map.tsx` 中，由于 `import.meta.env.VITE_API_BASE_URL` 和 hugeicons 类型定义，可能有 ESLint 类型安全警告，目前功能正常。

3. **`eslint.config.mjs` 中有自定义 `trim-classname-whitespace` 规则**：去除 className 中多余的空白字符。

4. **`src/pages/index.tsx` 首页**：工具卡片展示 `config.pageMeta` 中的工具，如果配置了 `description` 字段会显示描述。

5. **`vite.config.ts` 中有 `https-proxy-agent`**：本地 dev proxy 配置了代理服务器 `http://127.0.0.1:7897`，如果本地无代理服务会报错。

---

## 五、新对话启动 Prompt

请将以下内容直接粘贴给新的 AI 对话：

---

> 我正在维护一个名为 `hanekawa-tools` 的 React 工具集网站（GitHub 仓库：`hanekawa-shiki/hanekawa-tools`）。
>
> **技术栈**：React 19 + Vite 8 + TypeScript 6 + Tailwind CSS 4 + Base UI (shadcn base-maia) + Hugeicons + react-router 8 + axios + dayjs + lunisolar + sonner
>
> **关键约定**：
>
> - UI 组件使用 `render={...}` 语法（Base UI），不是 `asChild`（Radix）
> - 图标使用 `@hugeicons/core-free-icons` + `@hugeicons/react`（`HugeiconsIcon` 组件），不是 lucide-react
> - API 请求通过 `src/api/request.ts` 的 `createApi` 封装，接口在 `src/api/index.ts` 中定义
> - 自动路由：`src/pages/` 下的 `.tsx` 文件自动生成路由和菜单，`src/router/config.ts` 中的 `pageMeta` 和 `dirMeta` 管理菜单配置
> - `src/components/` 和 `src/pages/**/components/` 目录下的文件不会自动生成路由菜单（被 `excludes` 排除）
> - 多环境构建：dev 走 vite proxy，CF 走相对路径 `/api`，GH 走 worker 完整 URL
> - ESLint 配置在 `eslint.config.mjs`（@antfu/eslint-config），格式化用 Prettier
>
> 项目当前功能包含：自动路由系统、侧边栏导航、头像区域、主题切换、日历万年历（含节假日 API 接口）、油价查询（全国各地最新油价）、种子转磁力链（含逐条删除 + 清除全部）、404 页面、按类型着色的全局 Toast 通知。
>
> 请先阅读 `HANDOVER.md` 了解完整项目结构，然后告诉我你想做的下一步。

---
