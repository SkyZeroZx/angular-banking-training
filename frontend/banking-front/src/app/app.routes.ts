import { Route } from '@angular/router';
import { authGuard, publicGuard } from '@core/guards/auth.guard';
import { accountRoutes } from '@app/workshop/can-match-feature-gating/accounts-feature.routes';
import { clientRoutes } from '@app/workshop/resolver-redirect-command/client.routes';
import { routingDemoNameResolver } from '@app/workshop/routing/routing-demo.resolver';
import {
  ROUTING_DEMO_DEFAULT_ID,
  routingDemoRedirect,
} from '@app/workshop/routing/routing-demo.redirect';

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
      {
        path: 'workshop/change-detection',
        title: 'Workshop 01 | Change Detection',
        loadComponent: () =>
          import('@app/workshop/change-detection/change-detection-lab.component').then(
            (m) => m.ChangeDetectionLabComponent,
          ),
      },
      {
        path: 'workshop/router-features',
        title: 'Workshop 01 | Router Features',
        loadComponent: () =>
          import('@app/workshop/router-config/router-features.component').then(
            (m) => m.RouterFeaturesComponent,
          ),
      },
      {
        path: 'workshop/can-match',
        title: 'Workshop 01 | CanMatch',
        loadComponent: () =>
          import('@app/workshop/can-match-feature-gating/can-match-lab.component').then(
            (m) => m.CanMatchLabComponent,
          ),
        children: accountRoutes,
      },
      {
        path: 'workshop/lifecycle',
        title: 'Workshop 01 | Lifecycle',
        loadComponent: () =>
          import('@app/workshop/lifecycle-render-cleanup/lifecycle-lab.component').then(
            (m) => m.LifecycleLabComponent,
          ),
      },
      {
        path: 'workshop/resolver-redirect',
        title: 'Workshop 01 | Resolver Redirect',
        loadComponent: () =>
          import('@app/workshop/resolver-redirect-command/resolver-lab.component').then(
            (m) => m.ResolverLabComponent,
          ),
        children: clientRoutes,
      },
      {
        path: 'workshop/routing',
        title: 'Workshop 01 | Routing Lab',
        providers: [{ provide: ROUTING_DEMO_DEFAULT_ID, useValue: '42' }],
        loadComponent: () =>
          import('@app/workshop/routing/routing-lab.component').then(
            (m) => m.RoutingLabComponent,
          ),
        children: [
          { path: '', redirectTo: 'overview', pathMatch: 'full' },
          {
            path: 'overview',
            title: 'Workshop 01 | Routing Overview',
            loadComponent: () =>
              import('@app/workshop/routing/routing-overview.component').then(
                (m) => m.RoutingOverviewComponent,
              ),
          },
          { path: 'redirect', redirectTo: 'overview', pathMatch: 'full' },
          {
            path: 'redirect-fn',
            redirectTo: routingDemoRedirect,
            pathMatch: 'full',
          },
          {
            path: 'detalle/:id',
            title: 'Workshop 01 | Route Inputs',
            data: { topic: 'Route data + resolver + component inputs' },
            resolve: { resolvedName: routingDemoNameResolver },
            loadComponent: () =>
              import('@app/workshop/routing/routing-detail.component').then(
                (m) => m.RoutingDetailComponent,
              ),
          },
          {
            path: '**',
            title: 'Workshop 01 | Routing Not Found',
            loadComponent: () =>
              import('@app/workshop/routing/routing-not-found.component').then(
                (m) => m.RoutingNotFoundComponent,
              ),
          },
        ],
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
