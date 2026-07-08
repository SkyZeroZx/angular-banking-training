import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  afterNextRender,
  inject,
  signal,
} from '@angular/core';

@Component({
  selector: 'app-search-box',
  template: `
    <article class="search-box">
      <label>
        Search box
        <input type="search" />
      </label>
      <p>Ancho medido post-render: {{ width() }}px</p>
    </article>
  `,
  styleUrl: './search-box.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBoxComponent {
  private readonly host = inject(ElementRef<HTMLElement>);
  readonly width = signal(0);

  constructor() {
    afterNextRender({
      write: () => {
        this.host.nativeElement.classList.add('ready');
        return true;
      },
      read: (didWrite) => {
        if (didWrite) {
          this.width.set(
            Math.round(this.host.nativeElement.getBoundingClientRect().width),
          );
        }
      },
    });
  }
}
