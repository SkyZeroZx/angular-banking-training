import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  Injectable,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, interval, map, take } from 'rxjs';

@Injectable()
class NotificationsService {
  stream(): Observable<string> {
    return interval(700).pipe(
      take(4),
      map((index) => `Notificacion ${index + 1}`),
    );
  }
}

@Component({
  selector: 'app-notifications-panel',
  providers: [NotificationsService],
  template: `
    <article class="notifications-panel">
      <h2>takeUntilDestroyed</h2>
      <button type="button" (click)="start()">Iniciar stream</button>
      <ul>
        @for (message of messages(); track message) {
          <li>{{ message }}</li>
        }
      </ul>
    </article>
  `,
  styleUrl: './notifications-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationsPanelComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly notifications = inject(NotificationsService);

  readonly messages = signal<string[]>([]);

  start(): void {
    this.messages.set([]);
    this.notifications
      .stream()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((message) =>
        this.messages.update((messages) => [...messages, message]),
      );
  }
}
