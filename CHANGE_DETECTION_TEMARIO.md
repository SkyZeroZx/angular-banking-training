# Temario Extra - Change Detection, ZoneJS y Zoneless

Aplica solo al Workshop 01. Son ejemplos aislados para explicar conceptos; no se integran a la app bancaria.

## Base oficial

- Runtime performance: https://angular.dev/best-practices/runtime-performance
- Zoneless: https://angular.dev/guide/zoneless
- `provideZonelessChangeDetection`: https://angular.dev/api/core/provideZonelessChangeDetection
- Zone pollution: https://angular.dev/best-practices/zone-pollution
- Skipping subtrees: https://angular.dev/best-practices/skipping-subtrees

## Temario

1. Que es change detection: Angular revisa estado y actualiza DOM.
2. Como era antes con ZoneJS: async events, timers, XHR y listeners disparaban checks.
3. Problema tipico: zone pollution por tareas que no cambian UI.
4. Angular 21 en este repo: zoneless por defecto, sin `provideZoneChangeDetection`.
5. Notificaciones zoneless: signals leidas en template, listeners, `markForCheck`, `setInput`.
6. Patron recomendado: estado explicito con signals y componentes compatibles con `OnPush`.

## Ejemplo 1 - Signal actualiza vista

```ts
import { Component, computed, signal } from '@angular/core';

@Component({
  selector: 'app-counter-example',
  template: `
    <button type="button" (click)="increment()">+</button>
    <p>Total: {{ total() }}</p>
  `,
})
export class CounterExampleComponent {
  private readonly count = signal(0);
  readonly total = computed(() => this.count() * 2);

  increment() {
    this.count.update((value) => value + 1);
  }
}
```

Idea: si template lee signal, actualizar signal notifica a Angular.

## Ejemplo 2 - Modo ZoneJS legacy

```ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideZoneChangeDetection } from '@angular/core';
import { App } from './app/app';

bootstrapApplication(App, {
  providers: [provideZoneChangeDetection({ eventCoalescing: true })],
});
```

Idea: ZoneJS observa async work y agenda change detection. Esto sirve para explicar el modelo anterior, no para cambiar esta rama.

## Ejemplo 3 - Zoneless en Angular 21

```ts
import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';

bootstrapApplication(App);
```

Idea: Angular 21 ya arranca zoneless por defecto. En Angular 20 se usaba `provideZonelessChangeDetection()`.

## Ejemplo 4 - Callback externo

```ts
import { ChangeDetectorRef, Component, inject } from '@angular/core';

@Component({
  selector: 'app-third-party-example',
  template: `<p>{{ status }}</p>`,
})
export class ThirdPartyExampleComponent {
  private readonly cdr = inject(ChangeDetectorRef);
  status = 'idle';

  connect(widget: { onReady(callback: () => void): void }) {
    widget.onReady(() => {
      this.status = 'ready';
      this.cdr.markForCheck();
    });
  }
}
```

Idea: si callback externo no usa API Angular, avisar con `markForCheck`.

## Ejemplo 5 - Zone pollution legacy

```ts
import { Component, NgZone, inject } from '@angular/core';

@Component({ selector: 'app-poll-example', template: '' })
export class PollExampleComponent {
  private readonly zone = inject(NgZone);

  startLegacyPolling() {
    this.zone.runOutsideAngular(() => {
      setInterval(() => {
        console.log('poll without UI change');
      }, 1000);
    });
  }
}
```

Idea: en apps con ZoneJS, sacar tareas ruidosas fuera de Angular evita checks innecesarios.
