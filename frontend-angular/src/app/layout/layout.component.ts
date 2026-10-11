import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../core/auth.service';

interface NavItem {
  to: string;
  icon: string;
  label: string;
}

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent {
  protected readonly auth = inject(AuthService);
  protected readonly collapsed = signal(false);

  protected readonly nav: NavItem[] = [
    { to: '/', icon: '⌂', label: 'Dashboard' },
    { to: '/productos', icon: '▦', label: 'Productos' },
    { to: '/categorias', icon: '◫', label: 'Categorías' },
    { to: '/inventario', icon: '▤', label: 'Inventario' },
    { to: '/movimientos', icon: '⇄', label: 'Movimientos' },
    { to: '/alertas', icon: '!', label: 'Alertas' },
  ];

  protected toggle(): void {
    this.collapsed.update((v) => !v);
  }
}
