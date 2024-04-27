import MainLayout from '@/layouts';
import { HomePage, ReportPage } from '@/pages';

import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';

const routes = (
  <Route path={'/'} element={<MainLayout />}>
    <Route index element={<HomePage />} />
    <Route path={'/report'} element={<ReportPage />} />
  </Route>
);

const router = createBrowserRouter(createRoutesFromElements(routes));

export default router;
