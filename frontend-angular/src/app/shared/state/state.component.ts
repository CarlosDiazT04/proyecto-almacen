import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-loading',
  template: `<div class="state-box"><div class="spinner"></div><span>{{ text() }}</span></div>`,
  styleUrl: './state.component.scss',
})
export class LoadingComponent {
  readonly text = input('Cargando información...');
}

@Component({
  selector: 'app-empty',
  template: `<div class="state-box empty">{{ text() }}</div>`,
  styleUrl: './state.component.scss',
})
export class EmptyComponent {
  readonly text = input('No hay información para mostrar.');
}

@Component({
  selector: 'app-error-box',
  template: `
    <div class="error-box">
      <strong>No se pudo cargar la información.</strong>
      <span>{{ message() }}</span>
      <button type="button" class="btn secondary" (click)="retry.emit()">Reintentar</button>
    </div>
  `,
  styleUrl: './state.component.scss',
})
export class ErrorBoxComponent {
  readonly message = input('');
  readonly retry = output<void>();
}
