import { InjectionToken, inject } from '@angular/core';
import { RedirectFunction, Router } from '@angular/router';

export const ROUTING_DEMO_DEFAULT_ID = new InjectionToken<string>(
  'Routing demo default detail id',
);

export const routingDemoRedirect: RedirectFunction = (route) => {
  const router = inject(Router);
  const defaultId = inject(ROUTING_DEMO_DEFAULT_ID);
  const id = route.queryParams['id'] ?? defaultId;

  return router.createUrlTree(['/workshop/routing/detalle', id], {
    queryParams: { mode: 'redirect-function' },
  });
};
