import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { map } from 'rxjs';

@Component({
  selector: 'app-router-features',
  imports: [RouterLink],
  template: `
    <section class="workshop-page">
      <header class="workshop-page__header">
        <p class="workshop-page__eyebrow">Workshop 01</p>
        <h1>Router features</h1>
        <p>
          Esta pantalla valida la configuracion global puesta en
          <code>app.config.ts</code>: merge por defecto de query params, URL
          eager, preloading y scroll con anchors.
        </p>
      </header>

      <article class="workshop-card">
        <h2>defaultQueryParamsHandling: merge</h2>
        <p>
          Query params actuales:
          <code>{{ queryParams() || 'sin query params' }}</code>
        </p>
        <div class="workshop-actions">
          <button type="button" (click)="setSearch()">Set search</button>
          <button type="button" (click)="setPage()">Set page</button>
          <button type="button" (click)="setSort()">Set sort</button>
          <button type="button" (click)="clearQuery()">Limpiar</button>
        </div>
      </article>

      <article class="workshop-card">
        <h2>withPreloading(PreloadAllModules)</h2>
        <p>
          El bootstrap principal activa preloading. Las rutas lazy con
          <code>loadChildren</code> quedan candidatas para precarga despues de
          la navegacion inicial.
        </p>
      </article>

      <article class="workshop-card" id="scroll-demo">
        <h2>withInMemoryScrolling</h2>
        <p>
          <a [routerLink]="[]" fragment="anchor-target">Ir al anchor</a>
          conserva el comportamiento de scroll configurado globalmente.
        </p>
      </article>

      <div class="workshop-spacer"></div>

      <article class="workshop-card workshop-card--target" id="anchor-target">
        <h2>Anchor target</h2>
        <p>Destino visible para probar <code>anchorScrolling</code>.</p>
      </article>
    </section>
  `,
  styleUrl: './router-features.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RouterFeaturesComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly queryParams = toSignal(
    this.route.queryParamMap.pipe(
      map((params) =>
        params.keys.map((key) => `${key}=${params.get(key)}`).join('&'),
      ),
    ),
    { initialValue: '' },
  );

  setSearch(): void {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { search: 'maria' },
    });
  }

  setPage(): void {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: 2 },
    });
  }

  setSort(): void {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { sort: 'nombre,asc' },
    });
  }

  clearQuery(): void {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {},
      queryParamsHandling: 'replace',
    });
  }
}
