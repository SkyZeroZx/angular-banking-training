import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-new-accounts',
  template: `
    <article class="match-result match-result--new">
      <h2>New accounts</h2>
      <p>
        Esta ruta aparece cuando <code>canMatch</code> devuelve
        <code>true</code>. La ruta fallback ya no participa.
      </p>
    </article>
  `,
  styleUrl: './new-accounts.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewAccountsComponent {}
