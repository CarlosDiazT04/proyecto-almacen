import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { errorMessage } from '../../core/api-error';
import { CatalogService } from '../../core/api/catalog.service';
import { AuthService } from '../../core/auth.service';
import { Categoria, Producto, ProductoRequest } from '../../core/models/catalog.model';
import { ModalComponent } from '../../shared/modal/modal.component';
import { PageHeaderComponent } from '../../shared/page-header/page-header.component';
import { MoneyPipe } from '../../shared/pipes/format.pipes';
import { EmptyComponent, ErrorBoxComponent, LoadingComponent } from '../../shared/state/state.component';
import { ToastService } from '../../shared/toast/toast.service';

@Component({
  selector: 'app-productos',
  imports: [
    ReactiveFormsModule,
    PageHeaderComponent,
    ModalComponent,
    LoadingComponent,
    EmptyComponent,
    ErrorBoxComponent,
    MoneyPipe,
  ],
  templateUrl: './productos.component.html',
})
export class ProductosComponent implements OnInit {
  private readonly api = inject(CatalogService);
  private readonly toast = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly fb = inject(FormBuilder).nonNullable;

  protected readonly canWrite = inject(AuthService).hasRole('ADMIN', 'SUPERVISOR');

  protected readonly productos = signal<Producto[]>([]);
  protected readonly categorias = signal<Categoria[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal('');
  protected readonly search = signal('');
  protected readonly modalOpen = signal(false);
  protected readonly editing = signal<Producto | null>(null);
  protected readonly saving = signal(false);

  protected readonly activeCategorias = computed(() => this.categorias().filter((c) => c.activo));
  protected readonly filtered = computed(() => {
    const q = this.search().toLowerCase();
    return this.productos().filter((p) => `${p.sku} ${p.nombre} ${p.categoria}`.toLowerCase().includes(q));
  });

  protected readonly form = this.fb.group({
    sku: ['', [Validators.required, Validators.maxLength(50)]],
    nombre: ['', [Validators.required, Validators.maxLength(150)]],
    descripcion: ['', Validators.maxLength(500)],
    precio: [null as number | null, [Validators.required, Validators.min(0)]],
    categoriaId: [null as number | null, Validators.required],
    activo: [true],
  });

  ngOnInit(): void {
    this.load();
  }

  protected load(): void {
    this.loading.set(true);
    this.error.set('');
    forkJoin({ productos: this.api.productos(), categorias: this.api.categorias() })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ productos, categorias }) => {
          this.productos.set(productos);
          this.categorias.set(categorias);
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
    this.form.reset({ sku: '', nombre: '', descripcion: '', precio: null, categoriaId: null, activo: true });
    this.modalOpen.set(true);
  }

  protected openEdit(p: Producto): void {
    this.editing.set(p);
    this.form.reset({
      sku: p.sku,
      nombre: p.nombre,
      descripcion: p.descripcion ?? '',
      precio: p.precio,
      categoriaId: p.categoriaId,
      activo: p.activo,
    });
    this.modalOpen.set(true);
  }

  protected save(): void {
    if (this.form.invalid || this.saving()) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    const payload: ProductoRequest = {
      sku: v.sku,
      nombre: v.nombre,
      descripcion: v.descripcion,
      precio: Number(v.precio),
      categoriaId: Number(v.categoriaId),
      activo: Boolean(v.activo),
    };
    const editing = this.editing();
    this.saving.set(true);
    (editing ? this.api.actualizarProducto(editing.id, payload) : this.api.crearProducto(payload))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toast.show(editing ? 'Producto actualizado.' : 'Producto creado.');
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
