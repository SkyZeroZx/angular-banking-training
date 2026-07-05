import {
  ChangeDetectionStrategy,
  Component,
  Signal,
  inject,
  input,
} from '@angular/core';
import { ROUTER_OUTLET_DATA } from '@angular/router';

type RoutingOutletData = {
  source: string;
};

@Component({
  selector: 'app-routing-detail',
  template: `
    <article class="routing-card">
      <h2>Route inputs</h2>
      <p>Param <code>id</code>: {{ id() }}</p>
      <p>Query param <code>mode</code>: {{ mode() ?? 'sin query param' }}</p>
      <p>Route data <code>topic</code>: {{ topic() }}</p>
      <p>Resolver <code>resolvedName</code>: {{ resolvedName() }}</p>
      <p>Outlet data: {{ outletData().source }}</p>
    </article>
  `,
  styleUrl: './routing-lab.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoutingDetailComponent {
  readonly id = input.required<string>();
  readonly mode = input<string | undefined>();
  readonly topic = input.required<string>();
  readonly resolvedName = input.required<string>();
  readonly outletData = inject(ROUTER_OUTLET_DATA) as Signal<RoutingOutletData>;
}
