import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';

@Component({
  selector: 'app-change-detection-lab',
  templateUrl: './change-detection-lab.component.html',
  styleUrl: './change-detection-lab.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangeDetectionLabComponent {
  private readonly cdr = inject(ChangeDetectorRef);
  private runId = 0;

  readonly signalCount = signal(0);
  readonly doubledSignalCount = computed(() => this.signalCount() * 2);
  readonly signalStatus = signal('Sin tarea');

  plainStatus = 'Sin tarea';
  notifiedStatus = 'Sin tarea';

  incrementSignal() {
    this.signalCount.update((value) => value + 1);
  }

  schedulePlainMutation() {
    this.plainStatus = 'Timer agendado. La mutacion asincrona no notificara.';
    const currentRun = ++this.runId;

    window.setTimeout(() => {
      this.plainStatus = `Timer completo #${currentRun}. Cambio hecho, vista aun no avisada.`;
    }, 700);
  }

  scheduleSignalMutation() {
    this.signalStatus.set('Timer agendado con signal.');
    const currentRun = ++this.runId;

    window.setTimeout(() => {
      this.signalStatus.set(`Timer completo #${currentRun}. Signal notifico.`);
    }, 700);
  }

  scheduleNotifiedMutation() {
    this.notifiedStatus = 'Timer agendado con markForCheck.';
    const currentRun = ++this.runId;

    window.setTimeout(() => {
      this.notifiedStatus = `Timer completo #${currentRun}. markForCheck notifico.`;
      this.cdr.markForCheck();
    }, 700);
  }

  forceLocalCheck() {
    this.cdr.detectChanges();
  }
}
