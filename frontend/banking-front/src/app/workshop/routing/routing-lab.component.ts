import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-routing-lab',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './routing-lab.component.html',
  styleUrl: './routing-lab.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoutingLabComponent {
  readonly outletData = {
    source: 'routerOutletData desde RoutingLabComponent',
  };
}
