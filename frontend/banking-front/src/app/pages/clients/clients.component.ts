import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  linkedSignal,
  signal,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import {
  startWith,
  switchMap,
  catchError,
  of,
  debounceTime,
  distinctUntilChanged,
} from 'rxjs';
import { ClientService } from '@core/services/client/client.service';
import { ClientResponse } from '@core/interface';

@Component({
  selector: 'app-clients',
  imports: [ReactiveFormsModule],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientsComponent {
  private readonly clientService = inject(ClientService);
  private readonly fb = inject(FormBuilder);

  readonly pageSize = 10;
  readonly search = this.fb.nonNullable.control('');

  private readonly searchTerm = toSignal(
    this.search.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
    ),
    { initialValue: '' },
  );

  readonly page = linkedSignal(() => (this.searchTerm(), 1));
  private readonly refreshTick = signal(0);

  private readonly loadTrigger = computed(() => ({
    page: this.page(),
    search: this.searchTerm(),
    _: this.refreshTick(),
  }));

  readonly data = toSignal(
    toObservable(this.loadTrigger).pipe(
      switchMap(({ page, search }) =>
        this.clientService
          .getAll({
            page,
            size: this.pageSize,
            search: search || undefined,
          })
          .pipe(catchError(() => of(null))),
      ),
    ),
    { initialValue: undefined },
  );

  readonly filteredRows = computed(
    (): ClientResponse[] => this.data()?.content ?? [],
  );

  readonly totalElements = computed(() => this.data()?.totalElements ?? 0);
}
