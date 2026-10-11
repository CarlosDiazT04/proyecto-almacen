import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
  host: { '(document:keydown.escape)': 'open() && closed.emit()' },
})
export class ModalComponent {
  readonly open = input(false);
  readonly title = input.required<string>();
  readonly width = input(620);
  readonly closed = output<void>();
}
