import type { Plugin } from 'vite';

/**
 * Vite 插件：开发环境用本地 lxgw-wenkai-webfont 包，
 * 生产环境使用 index.html 中的 CDN 链接。
 *
 * 开发模式：在 DEV_FONT 标记之间插入本地 CSS 链接，删除 CDN link
 * 生产模式：删除 DEV_FONT 标记和 CDN link，保留空位（CDN link 在 prod 由构建注入）
 */
export function fontSwitch(mode: string): Plugin {
  const isDev = mode !== 'cf' && mode !== 'gh';

  return {
    name: 'font-switch',
    enforce: 'post',
    transformIndexHtml(html) {
      const devFontLink =
        '  <link rel="stylesheet" href="/node_modules/lxgw-wenkai-webfont/style.css" />';

      // 匹配多行 CDN link
      const cdnPattern =
        /<link\s+rel="stylesheet"\s+href="https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/lxgw-wenkai-webfont\/[^"]*"[\s\S]*?\/>/;

      // 匹配 DEV_FONT 标记之间的内容（包含换行）
      const devFontPattern = /<!-- DEV_FONT_START -->[\s\S]*?<!-- DEV_FONT_END -->/;

      let result = html;

      if (isDev) {
        // 开发模式：在 DEV_FONT 标记之间插入本地 CSS，删除 CDN link
        result = result.replace(
          devFontPattern,
          `<!-- DEV_FONT_START -->\n${devFontLink}\n<!-- DEV_FONT_END -->`
        );
        result = result.replace(cdnPattern, '');
      }
      // 生产模式不做任何替换，保留 CDN link

      return result;
    },
  };
}
