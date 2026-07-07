import config from './config';
import { resolveIcon } from './icon-map';

function filePathToRoutePath(filePath: string): string {
  let relative = filePath.replace(/^.*\/pages\//, '').replace(/\.(?:tsx|ts|jsx|js)$/, '');

  relative = relative.replace(/\/index$/, '');
  if (relative === 'index') {
    relative = '';
  }

  relative = relative.replace(/\[([^\]]+)\]/g, (_m: string, param: string | undefined) => {
    if (param === undefined || param === '') {
      return _m;
    }
    if (param.startsWith('...')) {
      return '*';
    }
    return `:${param}`;
  });

  return `/${relative}`;
}

function deriveTitleFromFilePath(filePath: string): string {
  const match = filePath.match(/\/pages\/(.+)\.[^.]+$/);
  const name = match ? match[1] : filePath;
  const dirMatch = name.match(/(.+)\/index$/);
  const raw = dirMatch ? dirMatch[1] : name;
  return raw.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function deriveTitleFromDirName(dirName: string): string {
  return dirName.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function isExcluded(filePath: string, excludes: string[]): boolean {
  const relative = filePath.replace(/^.*\/pages\//, '');
  return excludes.some((pattern) => {
    const regex = globToRegex(pattern);
    return regex.test(relative) || regex.test(filePath);
  });
}

function globToRegex(pattern: string): RegExp {
  const regexStr = pattern
    .replace(/\./g, '\\.')
    .replace(/\*\*/g, '{{GLOBSTAR}}')
    .replace(/\*/g, '[^/]*')
    .replace(/\{\{GLOBSTAR\}\}/g, '.*')
    .replace(/\?/g, '[^/]');
  return new RegExp(`^${regexStr}$`);
}

function isIndexFile(filePath: string): boolean {
  return /\/pages\/.*\/index\.[^.]+$/.test(filePath) || /\/pages\/index\.[^.]+$/.test(filePath);
}

function getFirstLevelDir(filePath: string): string | null {
  const relative = filePath.replace(/^.*\/pages\//, '');
  const segments = relative.split('/');
  if (segments.length <= 1) {
    return null;
  }
  return segments[0];
}

function getPageMetaByPath(routePath: string): PageMetaConfig | undefined {
  return config.pageMeta?.[routePath];
}

// 页面组件（懒加载）- 只匹配 .tsx/.jsx
const pageModules = import.meta.glob<PageModule>('../pages/**/*.{tsx,jsx}', { eager: false });

export function getAutoRouteMetas(): AutoRouteMeta[] {
  const { excludes } = config;

  const metas: AutoRouteMeta[] = [];

  for (const [filePath, importFn] of Object.entries(pageModules)) {
    if (isExcluded(filePath, excludes)) {
      continue;
    }
    if (isIndexFile(filePath)) {
      continue;
    }

    const routePath = filePathToRoutePath(filePath);
    const pageMeta = getPageMetaByPath(routePath);

    metas.push({
      filePath,
      path: routePath,
      title: deriveTitleFromFilePath(filePath),
      pageMeta,
      loader: importFn,
    });
  }

  metas.sort((a, b) => {
    const pathA = a.path;
    const pathB = b.path;
    if (pathA.includes('*')) {
      return 1;
    }
    if (pathB.includes('*')) {
      return -1;
    }
    const segmentsA = pathA.split('/').length;
    const segmentsB = pathB.split('/').length;
    if (segmentsA !== segmentsB) {
      return segmentsA - segmentsB;
    }
    return pathA.localeCompare(pathB);
  });

  return metas;
}

export function getRouteMenuItems(): NavMainItem[] {
  const metas = getAutoRouteMetas();

  const topLevelFiles: AutoRouteMeta[] = [];
  const groupedByDir = new Map<string, AutoRouteMeta[]>();

  for (const meta of metas) {
    const dirName = getFirstLevelDir(meta.filePath);
    if (dirName === null) {
      topLevelFiles.push(meta);
    } else {
      const existing = groupedByDir.get(dirName) || [];
      existing.push(meta);
      groupedByDir.set(dirName, existing);
    }
  }

  const items: NavMainItem[] = [];

  for (const meta of topLevelFiles) {
    if (meta.pageMeta?.hidden) {
      continue;
    }
    const resolvedTitle = meta.pageMeta?.title ?? meta.title;
    items.push({
      title: resolvedTitle,
      url: meta.path,
      icon: meta.pageMeta?.icon !== undefined ? resolveIcon(meta.pageMeta.icon) : undefined,
      isActive: meta.pageMeta?.isActive,
    });
  }

  for (const [dirName, dirMetas] of groupedByDir) {
    const dirConfig = config.dirMeta?.[dirName];
    if (dirConfig?.hidden) {
      continue;
    }

    const subItems: NavMainSubItem[] = [];

    for (const meta of dirMetas) {
      if (meta.pageMeta?.hidden) {
        continue;
      }
      const resolvedTitle = meta.pageMeta?.title ?? meta.title;
      subItems.push({
        title: resolvedTitle,
        url: meta.path,
        icon: meta.pageMeta?.icon !== undefined ? resolveIcon(meta.pageMeta.icon) : undefined,
      });
    }

    if (subItems.length === 0) {
      continue;
    }

    const dirTitle = dirConfig?.title ?? deriveTitleFromDirName(dirName);
    items.push({
      title: dirTitle,
      url: '',
      icon: dirConfig?.icon !== undefined ? resolveIcon(dirConfig.icon) : undefined,
      isActive: dirConfig?.isActive,
      items: subItems,
    });
  }

  return items;
}
