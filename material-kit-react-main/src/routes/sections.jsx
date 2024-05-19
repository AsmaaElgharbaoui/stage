import { lazy, Suspense } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';

import DashboardLayout from 'src/layouts/dashboard';

export const IndexPage = lazy(() => import('src/pages/user'));
export const BlogPage = lazy(() => import('src/pages/blog'));
export const UserPage = lazy(() => import('src/pages/app'));
export const LoginPage = lazy(() => import('src/sections/login/login-view'));
export const ProductsPage = lazy(() => import('src/pages/products'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));

// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      path: '/', // Parent route (root path)
      element: <LoginPage />, // Display LoginPage by default
    },
   
     
        { path: '/user',
         element:  (
          <DashboardLayout>
            <Suspense fallback={<div>Loading...</div>}>
            <UserPage /> 
            </Suspense>
          </DashboardLayout>
        ), },
        {
          path: '/app', // Dashboard route
          element: (
            <DashboardLayout>
              <Suspense fallback={<div>Loading...</div>}>
                <IndexPage />
              </Suspense>
            </DashboardLayout>
          ),
        },
        { path: '/products', element:
         (
          <DashboardLayout>
            <Suspense fallback={<div>Loading...</div>}>
            <ProductsPage />  
            </Suspense>
          </DashboardLayout>
        ), },
        { path: '/blog', element:
          (
          <DashboardLayout>
            <Suspense fallback={<div>Loading...</div>}>
            <BlogPage />
            </Suspense>
          </DashboardLayout>
        ),  },
      
   
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '*', // Catch all other paths
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
