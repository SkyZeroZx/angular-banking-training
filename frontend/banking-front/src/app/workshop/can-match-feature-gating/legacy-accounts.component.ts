import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-legacy-accounts',
  template: `
    <article class="match-result match-result--legacy">
      <h2>Legacy accounts</h2>
      <p>
        Esta ruta aparece cuando <code>canMatch</code> devuelve
        <code>false</code>. Angular sigue buscando otra ruta con el mismo path.
      </p>
    </article>
  `,
  styleUrl: './legacy-accounts.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LegacyAccountsComponent {}
