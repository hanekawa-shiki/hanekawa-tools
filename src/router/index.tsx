import type { RouteObject } from 'react-router';
import { lazy, Suspense } from 'react';
import { Navigate, Outlet } from 'react-router';
import Layout from '@/layout/index';
import { getAutoRouteMetas } from './auto-routes';
import config from './config';
import NotFound from './not-found';

function buildRoutes(): RouteObject[] {
  const metas = getAutoRouteMetas();

  const autoRoutes: RouteObject[] = metas.map((meta) => {
    const LazyComponent = lazy(meta.loader);
    return {
      path: meta.path,
      element: (
        <Suspense>
          <LazyComponent />
        </Suspense>
      ),
    };
  });

  const notFoundRoute: RouteObject = {
    path: '*',
    element: <NotFound />,
  };

  const rootRedirect: RouteObject = {
    path: '/',
    element: <Navigate to="/home" replace />,
  };

  const HomePage = lazy(async () => import('@/pages/index'));
  const homeRoute: RouteObject = {
    path: '/home',
    element: (
      <Suspense>
        <HomePage />
      </Suspense>
    ),
  };

  const childRoutes = [
    rootRedirect,
    homeRoute,
    ...autoRoutes,
    ...(config.customRoutes || []),
    notFoundRoute,
  ];

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
