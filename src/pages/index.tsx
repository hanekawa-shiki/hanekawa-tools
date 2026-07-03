import { Link } from 'react-router';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import config from '@/router/config';
import { resolveIcon } from '@/router/icon-map';

interface ToolItem {
  title: string;
  description: string;
  icon?: React.ReactNode;
  url: string;
}

function getAllTools(): ToolItem[] {
  const tools: ToolItem[] = [];
  const { pageMeta } = config;

  if (!pageMeta) {
    return tools;
  }

  for (const [path, meta] of Object.entries(pageMeta)) {
    // 跳过首页自身
    if (path === '/') {
      continue;
    }
    // 跳过隐藏的页面
    if (meta.hidden) {
      continue;
    }

    tools.push({
      title: meta.title ?? path,
      description: meta.description ?? '',
      icon: meta.icon !== undefined ? resolveIcon(meta.icon) : undefined,
      url: path,
    });
  }

  return tools;
}

export default function HomePage() {
  const tools = getAllTools();

  return (
    <div className="flex flex-1 flex-col gap-6 pt-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">工具集合</h1>
        <p className="text-sm text-muted-foreground">请选择要使用的工具</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <Link key={tool.url} to={tool.url} className="block">
            <Card className="transition-colors hover:bg-accent/50">
              <CardHeader className="flex flex-row items-center gap-3 space-y-0">
                {tool.icon != null && <div className="text-muted-foreground">{tool.icon}</div>}
                <div className="flex-1 space-y-1">
                  <CardTitle className="text-base">{tool.title}</CardTitle>
                  {tool.description && <CardDescription>{tool.description}</CardDescription>}
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
