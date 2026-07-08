import { ChangeDetectionStrategy, Component, input } from '@angular/core';

type Client = {
  clienteId: string;
  nombre: string;
};

@Component({
  selector: 'app-client-detail',
  template: `
    <article class="resolver-result">
      <h2>{{ client().nombre }}</h2>
      <p>{{ client().clienteId }}</p>
    </article>
  `,
  styleUrl: './client-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientDetailComponent {
  readonly client = input.required<Client>();
}
