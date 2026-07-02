import { Route } from '@angular/router';
import { authGuard, publicGuard } from '@core/guards/auth.guard';

export const appRoutes: Route[] = [
  {
    path: 'login',
    canActivate: [publicGuard],
    title: 'Banking Frontend | Login',
    loadComponent: () =>
      import('@app/pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('@app/layout/content/content.component').then(
        (m) => m.ContentComponent,
      ),
    children: [
      { path: '', redirectTo: 'clientes', pathMatch: 'full' },
      {
        path: 'clientes',
        title: 'Banking Frontend | Clientes',
        loadComponent: () =>
          import('@app/pages/clients/clients.component').then(
            (m) => m.ClientsComponent,
          ),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
