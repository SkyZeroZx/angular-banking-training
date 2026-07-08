import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-resolver-lab',
  imports: [RouterLink, RouterOutlet],
  template: `
    <section class="workshop-page">
      <header class="workshop-page__header">
        <p class="workshop-page__eyebrow">Workshop 01</p>
        <h1>Resolver + RedirectCommand</h1>
        <p>
          El resolver carga cliente antes de activar detalle. Si no encuentra
          dato critico, cancela activacion y redirige al fallback local.
        </p>
      </header>

      <nav class="workshop-actions" aria-label="Resolver demo">
        <a routerLink="detalle/client-001">Cliente valido</a>
        <a routerLink="detalle/missing">Cliente faltante</a>
      </nav>

      <router-outlet />
    </section>
  `,
  styleUrl: './resolver-lab.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResolverLabComponent {}
