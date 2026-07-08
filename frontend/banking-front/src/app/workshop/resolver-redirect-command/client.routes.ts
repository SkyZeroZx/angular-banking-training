import { Route } from '@angular/router';
import { clientResolver } from './client.resolver';

export const clientRoutes: Route[] = [
  { path: '', redirectTo: 'detalle/client-001', pathMatch: 'full' },
  {
    path: 'detalle/:clienteId',
    resolve: { client: clientResolver },
    loadComponent: () =>
      import('./client-detail.component').then((m) => m.ClientDetailComponent),
  },
  {
    path: 'no-encontrado',
    loadComponent: () =>
      import('./resolver-not-found.component').then(
        (m) => m.ResolverNotFoundComponent,
      ),
  },
];
