import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { WorkshopFeatureFlags } from './accounts-feature.routes';

@Component({
  selector: 'app-can-match-lab',
  imports: [RouterOutlet],
  template: `
    <section class="workshop-page">
      <header class="workshop-page__header">
        <p class="workshop-page__eyebrow">Workshop 01</p>
        <h1>CanMatch feature gating</h1>
        <p>
          Ambos ejemplos navegan al mismo path hijo <code>cuentas</code>. El
          guard decide si entra la version nueva o si Angular cae al fallback.
        </p>
      </header>

      <article class="workshop-card">
        <h2>Flag actual: {{ flags.newAccountsEnabled() ? 'on' : 'off' }}</h2>
        <div class="workshop-actions">
          <button type="button" (click)="showLegacy()">Flag off</button>
          <button type="button" (click)="showNew()">Flag on</button>
        </div>
      </article>

      <router-outlet />
    </section>
  `,
  styleUrl: './can-match-lab.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CanMatchLabComponent {
  readonly flags = inject(WorkshopFeatureFlags);

  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  showLegacy(): void {
    this.flags.newAccountsEnabled.set(false);
    this.navigateToAccounts('off');
  }

  showNew(): void {
    this.flags.newAccountsEnabled.set(true);
    this.navigateToAccounts('on');
  }

  private navigateToAccounts(flag: 'off' | 'on'): void {
    void this.router.navigate(['cuentas'], {
      relativeTo: this.route,
      queryParams: { flag, run: Date.now() },
    });
  }
}
