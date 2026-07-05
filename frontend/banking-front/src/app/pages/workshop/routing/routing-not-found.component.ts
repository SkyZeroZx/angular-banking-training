import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-routing-not-found',
  imports: [RouterLink],
  template: `
    <article class="routing-card">
      <h2>Wildcard local</h2>
      <p>
        La ruta hija <code>**</code> atrapa URLs desconocidas dentro del lab,
        sin romper el wildcard global de la app.
      </p>
      <a routerLink="../overview">Volver a overview</a>
    </article>
  `,
  styleUrl: './routing-lab.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoutingNotFoundComponent {}
