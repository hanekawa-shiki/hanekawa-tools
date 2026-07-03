import type { Plugin } from 'vite';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);

export function htmlBuildTimePlugin(): Plugin {
  return {
    name: 'html-build-time-plugin',
    apply: 'build',
    transformIndexHtml(html) {
      const buildTime = dayjs().tz('Asia/Shanghai').format('YYYY-MM-DD HH:mm:ss');
      const metaTag = `\n    <meta name="build-time" content="${buildTime}">`;
      return html.replace('<head>', `<head>${metaTag}`);
    },
  };
}
