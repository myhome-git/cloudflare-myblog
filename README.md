# Vue 3 Blog Management System (Vue 3 博客管理系统)

- 如果遇到问题需要可以入群1020935359，管理员有时间会在第一时间解答
- 前端比后台部署是非常简单的
- 这个只是前端页面，配套后台在下方的地址
- 选择前后端分离的原因是前台可以部署在任何地方，然后调用我们线上的接口和数据库，比如你搭建在自己的路由器上，可以达到最快的访问速度
### 预览地址
https://blog.myhome1985.dpdns.org

### 重要说明
- 应该首先部署api，链接地址：https://github.com/myhome-git/cloudflare-myblog-api
- 如果想快速部署的话，直接下载dist内的压缩包，上传到cloudflare的pages就行（推荐），具体：首页->计算(workers)->workers和pages->创建->pages->使用直接上传->开始使用->创建项目（名称为pages-myblog）->部署站点
- 上传dist后绑定自己的域名，用自己的域名访问，例如：blog.xxx.com，具体：首页->计算(workers)->workers和pages->pages-myblog->自定义域->设置自定义域
- 进入自己的域名菜单，找到workers路由，添加一条规则，例如：blog.xxx.com/api/*，选择自己的worker-myblog，这里应该首先部署api，链接地址：https://github.com/myhome-git/cloudflare-myblog-api


## 其它说明

MIT License - 免责声明
---------------------------
本项目（或称“本软件”）以 MIT 许可证发布。根据 MIT 许可证的条款，对于因使用本软件而引起的任何后果，项目作者和贡献者不承担任何责任。
**重要提示：请在使用本软件前仔细阅读本免责声明和 MIT 许可证全文。**
**免责声明：**
1.  **无担保性质：** 本软件“按原样”提供，不提供任何明示或暗示的担保，包括但不限于适销性、特定用途的适用性以及不侵权的隐含担保。在任何情况下，项目作者或贡献者均不对任何索赔、损害或其他责任负责，无论是合同诉讼、侵权诉讼还是其他诉讼，无论是因本软件或本软件的使用或其他交易而引起的、导致的或与之相关的。
2.  **使用者责任：** 阁下自行承担使用本软件的全部风险。阁下有责任在使用本软件之前充分测试其功能和安全性，并确保其符合阁下的特定需求和法律法规要求。
3.  **无承诺支持：** 本项目作者和贡献者没有义务提供技术支持、更新、修复 Bug 或进行维护。尽管我们可能会根据自身意愿提供，但这并非一项承诺。
4.  **第三方组件：** 本软件可能包含或依赖第三方库、组件或服务，这些组件可能拥有其独立的许可证和免责条款。使用者有责任查阅并遵守所有相关第三方许可证的规定。对于第三方组件的缺陷、安全漏洞或任何后果，本项目作者和贡献者不承担任何责任。
5.  **不适用于高风险应用：** 本软件不适用于生命支持系统、核设施、航空导航或通信系统、空中交通管制以及其他任何可能导致死亡、人身伤害、环境破坏或重大财产损失的“高风险应用”。将本软件用于此类目的，使用者自行承担所有风险。
6.  **代码质量与安全性：** 我们尽力确保代码质量，但不能保证本软件完全没有错误、缺陷、安全漏洞或不中断运行。我们建议使用者在使用前自行进行代码审查和安全审计。
7.  **许可变更：** 本项目所使用的 MIT 许可证可能会在未来被新的版本或不同的许可证所替代。任何此类变更将通过项目的官方发布渠道进行通知。阁下应始终参照项目根目录下的 `LICENSE` 文件（或类似文件）获取最准确的许可信息。
通过使用、复制、修改、合并、发布、分发、再许可和/或销售本软件的副本，即表示您已阅读、理解并同意本免责声明和 MIT 许可证的所有条款。

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
