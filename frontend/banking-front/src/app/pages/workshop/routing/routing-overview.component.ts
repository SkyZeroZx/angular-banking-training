import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-routing-overview',
  template: `
    <article class="routing-card">
      <h2>Orden y outlets</h2>
      <p>
        El router usa first-match wins. Por eso las rutas concretas van antes
        del wildcard <code>**</code>.
      </p>
      <ul>
        <li><code>workshop/routing</code> redirige a <code>overview</code>.</li>
        <li>Este contenido vive en un <code>router-outlet</code> hijo.</li>
        <li>El link wildcard prueba la ruta catch-all de este lab.</li>
      </ul>
    </article>
  `,
  styleUrl: './routing-lab.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoutingOverviewComponent {}
