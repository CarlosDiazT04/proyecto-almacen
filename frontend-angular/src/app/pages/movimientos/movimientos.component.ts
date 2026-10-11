import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { errorMessage } from '../../core/api-error';
import { CatalogService } from '../../core/api/catalog.service';
import { MovementService } from '../../core/api/movement.service';
import { AuthService } from '../../core/auth.service';
import { Producto } from '../../core/models/catalog.model';
import { Movimiento, MovimientoRequest, TipoMovimiento } from '../../core/models/movement.model';
import { ModalComponent } from '../../shared/modal/modal.component';
import { PageHeaderComponent } from '../../shared/page-header/page-header.component';
import { DateTimePipe } from '../../shared/pipes/format.pipes';
import { EmptyComponent, ErrorBoxComponent, LoadingComponent } from '../../shared/state/state.component';
import { ToastService } from '../../shared/toast/toast.service';

@Component({
  selector: 'app-movimientos',
  imports: [
    ReactiveFormsModule,
    PageHeaderComponent,
    ModalComponent,
    LoadingComponent,
    EmptyComponent,
    ErrorBoxComponent,
    DateTimePipe,
  ],
  templateUrl: './movimientos.component.html',
})
export class MovimientosComponent implements OnInit {
  private readonly movement = inject(MovementService);
  private readonly catalog = inject(CatalogService);
  private readonly auth = inject(AuthService);
  private readonly toast = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly fb = inject(FormBuilder).nonNullable;

  protected readonly canWrite = this.auth.hasRole('ADMIN', 'SUPERVISOR', 'ALMACENERO');

  protected readonly items = signal<Movimiento[]>([]);
  protected readonly productos = signal<Producto[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal('');
  protected readonly search = signal('');
  protected readonly modalOpen = signal(false);
  protected readonly saving = signal(false);

  protected readonly activeProductos = computed(() => this.productos().filter((p) => p.activo));
  protected readonly filtered = computed(() => {
    const q = this.search().toLowerCase();
    return this.items().filter((m) =>
      `${m.sku ?? ''} ${m.producto ?? ''} ${m.tipo} ${m.referencia ?? ''}`.toLowerCase().includes(q),
    );
  });

  protected readonly form = this.fb.group({
    productoId: [null as number | null, Validators.required],
    tipo: ['ENTRADA' as TipoMovimiento],
    cantidad: [1, [Validators.required, Validators.min(1), Validators.pattern(/^\d+$/)]],
    motivo: [''],
    referencia: [''],
  });

  ngOnInit(): void {
    this.load();
  }

  protected load(): void {
    this.loading.set(true);
    this.error.set('');
    forkJoin({ items: this.movement.movimientos(), productos: this.catalog.productos() })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ items, productos }) => {
          this.items.set(items);
          this.productos.set(productos);
          this.loading.set(false);
        },
        error: (e: unknown) => {
          this.error.set(errorMessage(e));
          this.loading.set(false);
        },
      });
  }

  protected openNew(): void {
    this.form.reset({ productoId: null, tipo: 'ENTRADA', cantidad: 1, motivo: '', referencia: '' });
    this.modalOpen.set(true);
  }

  protected save(): void {
    if (this.form.invalid || this.saving()) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    const payload: MovimientoRequest = {
      productoId: Number(v.productoId),
      tipo: v.tipo,
      cantidad: Number(v.cantidad),
      motivo: v.motivo || null,
      referencia: v.referencia || null,
      usuarioId: this.auth.user()?.id ?? null,
    };
    this.saving.set(true);
    this.movement
      .crear(payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toast.show('Movimiento registrado y procesado.');
          this.saving.set(false);
          this.modalOpen.set(false);
          this.load();
        },
        error: (e: unknown) => {
          this.toast.show(errorMessage(e), 'error');
          this.saving.set(false);
        },
      });
  }
}
