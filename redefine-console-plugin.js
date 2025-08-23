// Vite插件，用于在构建完成后向HTML中插入重新定义console的脚本
import fs from 'fs';
import path from 'path';

export default function redefineConsolePlugin() {
  return {
    name: 'redefine-console',
    transformIndexHtml(html) {
      // 只在生产环境（打包时）执行，开发环境不执行
      if (process.env.NODE_ENV === 'production') {       
        // 定义要插入的脚本内容
        return html.replace(
          '<script name="insert-before"></script>',
          `<script src="/web.loader.hook.insert.before.js"></script>`
        ).replace(
          '<script name="insert-after"></script>',
          `<script src="/web.loader.hook.insert.after.js"></script>`
        );
      }
      // 开发环境直接返回原始html
      return html;
    }
  };
}
