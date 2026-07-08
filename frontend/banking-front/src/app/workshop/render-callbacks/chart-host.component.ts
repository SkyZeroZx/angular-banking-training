import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  afterNextRender,
  afterRenderEffect,
  input,
  viewChild,
} from '@angular/core';

type ChartData = {
  labels: string[];
  values: number[];
};

type ChartHandle = {
  update(data: ChartData): void;
};

function createChart(canvas: HTMLCanvasElement, data: ChartData): ChartHandle {
  const context = canvas.getContext('2d');
  context?.fillText(data.labels.join(', '), 8, 16);

  return {
    update(nextData) {
      context?.clearRect(0, 0, canvas.width, canvas.height);
      context?.fillText(nextData.values.join(', '), 8, 16);
    },
  };
}

@Component({
  selector: 'app-chart-host',
  template: `
    <article class="chart-host">
      <h2>afterRenderEffect</h2>
      <canvas #chart width="320" height="160"></canvas>
    </article>
  `,
  styleUrl: './chart-host.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartHostComponent {
  readonly data = input.required<ChartData>();
  readonly canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('chart');

  private chart: ChartHandle | null = null;

  constructor() {
    afterNextRender({
      write: () => {
        this.chart = createChart(this.canvas().nativeElement, this.data());
      },
    });

    afterRenderEffect(() => {
      this.chart?.update(this.data());
    });
  }
}
