import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { errorMessage } from '../../core/api-error';
import { CatalogService } from '../../core/api/catalog.service';
import { AuthService } from '../../core/auth.service';
import { Categoria, CategoriaRequest } from '../../core/models/catalog.model';
import { ModalComponent } from '../../shared/modal/modal.component';
import { PageHeaderComponent } from '../../shared/page-header/page-header.component';
import { EmptyComponent, ErrorBoxComponent, LoadingComponent } from '../../shared/state/state.component';
import { ToastService } from '../../shared/toast/toast.service';

@Component({
  selector: 'app-categorias',
  imports: [
    ReactiveFormsModule,
    PageHeaderComponent,
    ModalComponent,
    LoadingComponent,
    EmptyComponent,
    ErrorBoxComponent,
  ],
  templateUrl: './categorias.component.html',
})
export class CategoriasComponent implements OnInit {
  private readonly api = inject(CatalogService);
  private readonly toast = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly fb = inject(FormBuilder).nonNullable;

  protected readonly canWrite = inject(AuthService).hasRole('ADMIN', 'SUPERVISOR');

  protected readonly items = signal<Categoria[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal('');
  protected readonly search = signal('');
  protected readonly modalOpen = signal(false);
  protected readonly editing = signal<Categoria | null>(null);
  protected readonly saving = signal(false);

  protected readonly filtered = computed(() => {
    const q = this.search().toLowerCase();
    return this.items().filter((c) => `${c.nombre} ${c.descripcion ?? ''}`.toLowerCase().includes(q));
  });

  protected readonly form = this.fb.group({
    nombre: ['', Validators.required],
    descripcion: [''],
    activo: [true],
  });

  ngOnInit(): void {
    this.load();
  }

  protected load(): void {
    this.loading.set(true);
    this.error.set('');
    this.api
      .categorias()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (items) => {
          this.items.set(items);
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
    this.form.reset({ nombre: '', descripcion: '', activo: true });
    this.modalOpen.set(true);
  }

  protected openEdit(c: Categoria): void {
    this.editing.set(c);
    this.form.reset({ nombre: c.nombre, descripcion: c.descripcion ?? '', activo: c.activo });
    this.modalOpen.set(true);
  }

  protected save(): void {
    if (this.form.invalid || this.saving()) {
      this.form.markAllAsTouched();
      return;
    }
    const payload: CategoriaRequest = this.form.getRawValue();
    const editing = this.editing();
    this.saving.set(true);
    (editing ? this.api.actualizarCategoria(editing.id, payload) : this.api.crearCategoria(payload))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toast.show(editing ? 'Categoría actualizada.' : 'Categoría creada.');
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
