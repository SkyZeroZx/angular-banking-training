import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';
import { ChartHostComponent } from '../render-callbacks/chart-host.component';
import { ClientCardComponent } from './client-card.component';
import { NotificationsPanelComponent } from './notifications-panel.component';
import { SearchBoxComponent } from './search-box.component';

@Component({
  selector: 'app-lifecycle-lab',
  imports: [
    ChartHostComponent,
    ClientCardComponent,
    NotificationsPanelComponent,
    SearchBoxComponent,
  ],
  template: `
    <section class="workshop-page">
      <header class="workshop-page__header">
        <p class="workshop-page__eyebrow">Workshop 01</p>
        <h1>Lifecycle, render callbacks y cleanup</h1>
      </header>

      <article class="workshop-card">
        <h2>Hooks clasicos con inputs</h2>
        <button type="button" (click)="nextClient()">Cambiar cliente</button>
        <app-client-card [id]="clientId()" />
      </article>

      <app-search-box />
      <app-chart-host [data]="chartData()" />
      <app-notifications-panel />
    </section>
  `,
  styleUrl: './lifecycle-lab.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LifecycleLabComponent {
  readonly selectedIndex = signal(1);
  readonly clientId = computed(() => `client-${this.selectedIndex()}`);
  readonly chartData = computed(() => ({
    labels: ['hooks', 'render', 'cleanup'],
    values: [this.selectedIndex(), this.selectedIndex() + 2, 4],
  }));

  nextClient(): void {
    this.selectedIndex.update((value) => (value === 3 ? 1 : value + 1));
  }
}
