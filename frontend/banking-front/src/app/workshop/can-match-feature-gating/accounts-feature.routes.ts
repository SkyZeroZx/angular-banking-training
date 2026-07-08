import { Injectable, inject, signal } from '@angular/core';
import { CanMatchFn, Route } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class WorkshopFeatureFlags {
  readonly newAccountsEnabled = signal(false);

  enabled(flag: string): boolean {
    return flag === 'new-accounts' && this.newAccountsEnabled();
  }
}

export const accountsCanMatch: CanMatchFn = () => {
  const flags = inject(WorkshopFeatureFlags);

  return flags.enabled('new-accounts');
};

export const accountRoutes: Route[] = [
  { path: '', redirectTo: 'cuentas', pathMatch: 'full' },
  {
    path: 'cuentas',
    canMatch: [accountsCanMatch],
    loadComponent: () =>
      import('./new-accounts.component').then((m) => m.NewAccountsComponent),
  },
  {
    path: 'cuentas',
    loadComponent: () =>
      import('./legacy-accounts.component').then(
        (m) => m.LegacyAccountsComponent,
      ),
  },
];
