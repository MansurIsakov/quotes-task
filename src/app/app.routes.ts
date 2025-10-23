import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('@features/features.routes').then((m) => m.routes),
  },
  {
    path: 'page-not-found',
    loadComponent: () =>
      import('@shared/screens/page-not-found/page-not-found').then((c) => c.PageNotFoundComponent),
  },
  {
    path: '**',
    redirectTo: 'page-not-found',
  },
];
