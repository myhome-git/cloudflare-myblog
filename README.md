# Vue 3 Blog Management System (Vue 3 博客管理系统)

### 重要说明
### 1、如果想快速部署的话，直接下载dist文件夹，压缩后上传到cloudflare的pages就行（推荐）
### 2、上传dist后绑定自己的域名，用自己的域名访问，例如：blog.baidu.com
### 3、进入自己的域名菜单，找到workers路由，添加一条规则，例如：blog.baidu.com/api/*，选择自己的worker-myblog，这里应该首先部署api，链接地址：https://github.com/myhome-git/cloudflare-myblog-api

## 简介

这是一个基于 Vue 3、Vite 和 Bun 构建的现代化博客管理系统。系统采用前后端分离架构，具有博客文章管理、用户认证、分类管理、友链管理等功能。

## Features / 功能特性

- **Admin Dashboard**: 后台管理面板
  - User authentication (用户认证)
  - Blog post management (博客文章管理)
  - Category management (分类管理)
  - Notepad/Notes management (日常记事管理)
  - Friendly links management (友情链接管理)
  - User account management (用户账户管理)
  
- **Frontend**: 前台展示
  - Blog listing with search functionality (博客列表及搜索)
  - Blog post detail view (博客详情查看)
  - Category navigation (分类导航)
  - Responsive design (响应式设计)

- **Technical Stack**: 技术栈
  - Vue 3 with Composition API
  - Vite for fast development
  - Bun for package management and runtime
  - Ant Design Vue for UI components
  - TypeScript support
  - Markdown editor (Cherry Markdown)
  - ECharts for data visualization

## Recommended IDE Setup / 推荐 IDE 设置

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS / TypeScript 支持

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration / 自定义配置

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup / 项目设置

```sh
bun install
```

### Compile and Hot-Reload for Development / 编译和热重载开发

```sh
bun dev
```

### Type-Check, Compile and Minify for Production / 类型检查、编译和生产构建

```sh
bun run build
```

### Environment Information / 环境说明

Version / 版本:
```
bun     1.2.4
npm     10.9.2
node    v22.14.0
vite    v6.2.0
```

## Project Structure / 项目结构

```
src/
├── assets/           # Static assets (静态资源)
├── components/       # Reusable components (可复用组件)
├── router/           # Router configuration (路由配置)
├── utils/            # Utility functions (工具函数)
├── views/            # Page components (页面组件)
│   ├── admin/        # Admin dashboard (后台管理)
│   └── app/          # Frontend pages (前台页面)
└── App.vue          # Root component (根组件)
```

## Key Components / 主要组件

- **Admin Panel**: 后台管理面板
  - Dashboard with statistics charts (统计图表仪表板)
  - Blog post CRUD operations (博客文章增删改查)
  - Category management (分类管理)
  - User management (用户管理)
  
- **Frontend**: 前台展示
  - Blog listing with pagination (分页博客列表)
  - Blog detail view with Markdown rendering (Markdown 渲染的博客详情)
  - Category-based navigation (基于分类的导航)
  - Search functionality (搜索功能)

## Development Notes / 开发说明

- The project uses Ant Design Vue for UI components (项目使用 Ant Design Vue 作为 UI 组件库)
- Markdown editor is implemented with Cherry Markdown (使用 Cherry Markdown 实现 Markdown 编辑器)
- Routing is configured with Vue Router (使用 Vue Router 进行路由配置)
- API requests are handled with Axios (使用 Axios 处理 API 请求)
- State management is handled with Vue's reactivity system (使用 Vue 的响应式系统进行状态管理)
