import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { forkJoin } from 'rxjs';
import { errorMessage } from '../../core/api-error';
import { AlertService } from '../../core/api/alert.service';
import { CatalogService } from '../../core/api/catalog.service';
import { InventoryService } from '../../core/api/inventory.service';
import { MovementService } from '../../core/api/movement.service';
import { Alerta } from '../../core/models/alert.model';
import { Producto } from '../../core/models/catalog.model';
import { Inventario } from '../../core/models/inventory.model';
import { Movimiento } from '../../core/models/movement.model';
import { DateTimePipe, MoneyPipe } from '../../shared/pipes/format.pipes';
import { PageHeaderComponent } from '../../shared/page-header/page-header.component';
import { ErrorBoxComponent, LoadingComponent } from '../../shared/state/state.component';

interface DashboardData {
  productos: Producto[];
  inventarios: Inventario[];
  movimientos: Movimiento[];
  alertas: Alerta[];
}

@Component({
  selector: 'app-dashboard',
  imports: [PageHeaderComponent, LoadingComponent, ErrorBoxComponent, MoneyPipe, DateTimePipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  private readonly catalog = inject(CatalogService);
  private readonly inventory = inject(InventoryService);
  private readonly movement = inject(MovementService);
  private readonly alerts = inject(AlertService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly data = signal<DashboardData | null>(null);
  protected readonly error = signal('');

  protected readonly stats = computed(() => {
    const d = this.data();
    if (!d) return null;
    const value = d.productos.reduce((sum, p) => {
      const inv = d.inventarios.find((i) => i.productoId === p.id);
      return sum + Number(p.precio || 0) * Number(inv?.stockActual || 0);
    }, 0);
    return {
      activos: d.productos.filter((p) => p.activo).length,
      stock: d.inventarios.reduce((s, i) => s + (i.stockActual || 0), 0),
      low: d.inventarios.filter((i) => i.stockBajo).length,
      pending: d.alertas.filter((a) => a.estado === 'PENDIENTE').length,
      value,
    };
  });

  protected readonly stockRows = computed(() =>
    (this.data()?.inventarios ?? []).slice(0, 6).map((i) => {
      const max = Math.max((i.stockMinimo || 0) * 4, i.stockActual || 1);
      return { ...i, pct: Math.min(100, Math.round(((i.stockActual || 0) / max) * 100)) };
    }),
  );

  protected readonly recentMovements = computed(() => (this.data()?.movimientos ?? []).slice(0, 6));

  ngOnInit(): void {
    this.load();
  }

  protected load(): void {
    this.error.set('');
    forkJoin({
      productos: this.catalog.productos(),
      inventarios: this.inventory.inventarios(),
      movimientos: this.movement.movimientos(),
      alertas: this.alerts.alertas(),
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (d) => this.data.set(d),
        error: (e: unknown) => this.error.set(errorMessage(e)),
      });
  }
}
