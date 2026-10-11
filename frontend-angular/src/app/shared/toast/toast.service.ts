import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error';
export interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
}

const DURATION_MS = 3500;

@Injectable({ providedIn: 'root' })
export class ToastService {
  private nextId = 0;
  readonly items = signal<ToastItem[]>([]);

  show(message: string, type: ToastType = 'success'): void {
    const id = this.nextId++;
    this.items.update((list) => [...list, { id, message, type }]);
    setTimeout(() => this.items.update((list) => list.filter((t) => t.id !== id)), DURATION_MS);
  }
}
