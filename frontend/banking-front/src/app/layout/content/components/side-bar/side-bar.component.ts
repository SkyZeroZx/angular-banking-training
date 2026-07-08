import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-side-bar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideBarComponent {
  readonly links = [
    { path: '/clientes', label: 'Clientes' },
    { path: '/workshop/change-detection', label: 'Change detection' },
    { path: '/workshop/routing', label: 'Routing lab' },
    { path: '/workshop/router-features', label: 'Router features' },
    { path: '/workshop/can-match', label: 'CanMatch' },
    { path: '/workshop/lifecycle', label: 'Lifecycle' },
    { path: '/workshop/resolver-redirect', label: 'Resolver redirect' },
  ];
}
