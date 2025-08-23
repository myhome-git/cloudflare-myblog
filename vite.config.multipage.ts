import { resolve, dirname } from 'path';
import { existsSync, mkdirSync, copyFileSync } from 'fs';
import { fileURLToPath } from 'url';

// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 引入路由文件
import { confRouterIntex } from './src/router/index';

// 在构建完成后复制index.html到各个目录
function copyHtmlFiles() {
  // 确保dist目录存在
  const distDir = resolve(__dirname, 'dist');
  if (!existsSync(distDir)) {
    console.error('[multi-page] Dist directory does not exist');
    return;
  }

  // 源文件路径
  const sourcePath = resolve(distDir, 'index.html');
  if (!existsSync(sourcePath)) {
    console.error('[multi-page] Dist index.html file does not exist');
    return;
  }

  // 复制HTML文件的函数
  function copyFiles(list: any, parentPath: string = '') {
    list.forEach((element: any) => {
      // 跳过通配符路由，不需要为它生成HTML文件
      if (element.path && element.path.includes(':pathMatch')) {
        return;
      }

      // 计算路由路径
      const routePath = `${parentPath}${element.path}`.replace(/\/+/g, '/');

      if (routePath !== '/') {
        // 为非根路径创建对应的目录
        const cleanPath = routePath.replace(/^\//, ''); // 移除开头的斜杠
        const dirPath = resolve(distDir, cleanPath);

        // 创建目录
        if (!existsSync(dirPath)) {
          mkdirSync(dirPath, { recursive: true });
        }

        // 复制HTML文件
        const htmlPath = resolve(dirPath, 'index.html');
        copyFileSync(sourcePath, htmlPath);
        // console.log(`[multi-page] Created file: ${htmlPath}`);
      }

      // 递归处理子路由
      if (element.children) {
        copyFiles(element.children, routePath === '/' ? '' : routePath);
      }
    });
  }

  // 为每个路由配置复制HTML文件
  copyFiles(confRouterIntex, '');
}

// 创建一个Vite插件来在构建完成后复制HTML文件
const multiPagePlugin = {
  name: 'vite-plugin-multi-page',
  closeBundle() {
    copyHtmlFiles();
  }
};

export { multiPagePlugin };
