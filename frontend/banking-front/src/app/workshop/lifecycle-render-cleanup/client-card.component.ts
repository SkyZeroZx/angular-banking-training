import {
  ChangeDetectionStrategy,
  Component,
  OnChanges,
  OnInit,
  SimpleChanges,
  computed,
  input,
} from '@angular/core';

@Component({
  selector: 'app-client-card',
  template: `
    <article class="client-card">
      <h2>{{ title() }}</h2>
      <p>
        <code>ngOnChanges</code> y <code>ngOnInit</code> escriben en consola.
      </p>
    </article>
  `,
  styleUrl: './client-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientCardComponent implements OnChanges, OnInit {
  readonly id = input.required<string>();
  readonly title = computed(() => `Cliente ${this.id()}`);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['id']?.firstChange) {
      console.log('input inicial', changes['id'].currentValue);
    }
  }

  ngOnInit(): void {
    console.log('inputs disponibles', this.id());
  }
}
