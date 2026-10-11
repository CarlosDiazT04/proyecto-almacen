import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { errorMessage } from '../../core/api-error';
import { CatalogService } from '../../core/api/catalog.service';
import { InventoryService } from '../../core/api/inventory.service';
import { AuthService } from '../../core/auth.service';
import { Producto } from '../../core/models/catalog.model';
import { Inventario, InventarioRequest } from '../../core/models/inventory.model';
import { ModalComponent } from '../../shared/modal/modal.component';
import { PageHeaderComponent } from '../../shared/page-header/page-header.component';
import { EmptyComponent, ErrorBoxComponent, LoadingComponent } from '../../shared/state/state.component';
import { ToastService } from '../../shared/toast/toast.service';

const stockValidators = [Validators.required, Validators.min(0), Validators.pattern(/^\d+$/)];

@Component({
  selector: 'app-inventario',
  imports: [
    ReactiveFormsModule,
    PageHeaderComponent,
    ModalComponent,
    LoadingComponent,
    EmptyComponent,
    ErrorBoxComponent,
  ],
  templateUrl: './inventario.component.html',
})
export class InventarioComponent implements OnInit {
  private readonly inventory = inject(InventoryService);
  private readonly catalog = inject(CatalogService);
  private readonly toast = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly fb = inject(FormBuilder).nonNullable;

  protected readonly canWrite = inject(AuthService).hasRole('ADMIN', 'SUPERVISOR', 'ALMACENERO');

  protected readonly items = signal<Inventario[]>([]);
  protected readonly productos = signal<Producto[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal('');
  protected readonly search = signal('');
  protected readonly modalOpen = signal(false);
  protected readonly editing = signal<Inventario | null>(null);
  protected readonly saving = signal(false);

  protected readonly filtered = computed(() => {
    const q = this.search().toLowerCase();
    return this.items().filter((i) => `${i.sku} ${i.producto}`.toLowerCase().includes(q));
  });

  /** Al crear: solo productos sin inventario. Al editar: el propio producto. */
  protected readonly availableProducts = computed(() => {
    const editing = this.editing();
    if (editing) return this.productos().filter((p) => p.id === editing.productoId);
    const used = new Set(this.items().map((i) => i.productoId));
    return this.productos().filter((p) => !used.has(p.id));
  });

  protected readonly form = this.fb.group({
    productoId: [null as number | null, Validators.required],
    stockActual: [0, stockValidators],
    stockReservado: [0, stockValidators],
    stockMinimo: [0, stockValidators],
    activo: [true],
  });

  ngOnInit(): void {
    this.load();
  }

  protected load(): void {
    this.loading.set(true);
    this.error.set('');
    forkJoin({ items: this.inventory.inventarios(), productos: this.catalog.productos() })
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
    this.editing.set(null);
    this.form.reset({ productoId: null, stockActual: 0, stockReservado: 0, stockMinimo: 0, activo: true });
    this.form.controls.productoId.enable();
    this.modalOpen.set(true);
  }

  protected openEdit(i: Inventario): void {
    this.editing.set(i);
    this.form.reset({
      productoId: i.productoId,
      stockActual: i.stockActual,
      stockReservado: i.stockReservado,
      stockMinimo: i.stockMinimo,
      activo: i.activo,
    });
    this.form.controls.productoId.disable();
    this.modalOpen.set(true);
  }

  protected save(): void {
    if (this.form.invalid || this.saving()) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    const payload: InventarioRequest = {
      productoId: Number(v.productoId),
      stockActual: Number(v.stockActual),
      stockReservado: Number(v.stockReservado),
      stockMinimo: Number(v.stockMinimo),
      activo: Boolean(v.activo),
    };
    const editing = this.editing();
    this.saving.set(true);
    (editing ? this.inventory.actualizar(editing.id, payload) : this.inventory.crear(payload))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toast.show(editing ? 'Inventario actualizado.' : 'Inventario creado.');
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
