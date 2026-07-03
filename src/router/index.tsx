import type { RouteObject } from 'react-router';
import { lazy, Suspense } from 'react';
import { Navigate, Outlet } from 'react-router';
import Layout from '@/layout/index';
import { getAutoRouteMetas } from './auto-routes';
import config from './config';
import NotFound from './not-found';

/**
 * 根据配置和 pages 目录自动生成路由表
 */
function buildRoutes(): RouteObject[] {
  const metas = getAutoRouteMetas();

  // 将自动生成的路由元数据转为 RouteObject，使用 lazy 加载
  const autoRoutes: RouteObject[] = metas.map((meta) => {
    const LazyComponent = lazy(meta.loader);
    return {
      path: meta.path,
      element: <LazyComponent />,
    };
  });

  // 404 catch-all 路由（必须放在最后）
  const notFoundRoute: RouteObject = {
    path: '*',
    element: <NotFound />,
  };

  // 根路径重定向到 /home
  const rootRedirect: RouteObject = {
    path: '/',
    element: <Navigate to="/home" replace />,
  };

  // 首页路由（lazy 加载）
  const HomePage = lazy(async () => import('@/pages/index'));
  const homeRoute: RouteObject = {
    path: '/home',
    element: (
      <Suspense>
        <HomePage />
      </Suspense>
    ),
  };

  // 合并首页路由 + 重定向 + 自定义路由 + 404 兜底
  const childRoutes = [
    rootRedirect,
    homeRoute,
    ...autoRoutes,
    ...(config.customRoutes || []),
    notFoundRoute,
  ];

  // 如果配置了布局组件，将所有路由作为布局的子路由
  if (config.layoutPath != null && config.layoutPath !== '') {
    return [
      {
        path: '/',
        element: (
          <Layout>
            <Outlet />
          </Layout>
        ),
        children: childRoutes,
      },
    ];
  }

  return childRoutes;
}

export const routes: RouteObject[] = buildRoutes();
