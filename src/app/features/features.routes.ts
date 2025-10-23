import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'quotes',
    pathMatch: 'full',
  },
  {
    path: 'quotes',
    loadChildren: () => import('./quotes/quotes.routes').then((m) => m.routes),
  },
];
