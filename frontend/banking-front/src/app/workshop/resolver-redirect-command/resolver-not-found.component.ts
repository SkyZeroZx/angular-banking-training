import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-resolver-not-found',
  template: `
    <article class="resolver-result resolver-result--error">
      <h2>Cliente no encontrado</h2>
      <p>El resolver devolvio <code>RedirectCommand</code>.</p>
    </article>
  `,
  styleUrl: './resolver-not-found.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResolverNotFoundComponent {}
