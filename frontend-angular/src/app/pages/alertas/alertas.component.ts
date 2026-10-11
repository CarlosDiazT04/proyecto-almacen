import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { errorMessage } from '../../core/api-error';
import { AlertService } from '../../core/api/alert.service';
import { AuthService } from '../../core/auth.service';
import { Alerta } from '../../core/models/alert.model';
import { ModalComponent } from '../../shared/modal/modal.component';
import { PageHeaderComponent } from '../../shared/page-header/page-header.component';
import { DateTimePipe } from '../../shared/pipes/format.pipes';
import { EmptyComponent, ErrorBoxComponent, LoadingComponent } from '../../shared/state/state.component';
import { ToastService } from '../../shared/toast/toast.service';

type Filtro = 'TODAS' | 'PENDIENTE' | 'ATENDIDA';

@Component({
  selector: 'app-alertas',
  imports: [
    ReactiveFormsModule,
    PageHeaderComponent,
    ModalComponent,
    LoadingComponent,
    EmptyComponent,
    ErrorBoxComponent,
    DateTimePipe,
  ],
  templateUrl: './alertas.component.html',
  styleUrl: './alertas.component.scss',
})
export class AlertasComponent implements OnInit {
  private readonly api = inject(AlertService);
  private readonly auth = inject(AuthService);
  private readonly toast = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly fb = inject(FormBuilder).nonNullable;

  protected readonly canAttend = this.auth.hasRole('ADMIN', 'SUPERVISOR', 'ALMACENERO');
  /** El login actual no devuelve id: si falta, se pide el identificador del responsable. */
  protected readonly needsOperatorId = !this.auth.user()?.id;
  protected readonly filtros: { value: Filtro; label: string }[] = [
    { value: 'TODAS', label: 'Todas' },
    { value: 'PENDIENTE', label: 'Pendientes' },
    { value: 'ATENDIDA', label: 'Atendidas' },
  ];

  protected readonly items = signal<Alerta[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal('');
  protected readonly filter = signal<Filtro>('TODAS');
  protected readonly selected = signal<Alerta | null>(null);
  protected readonly saving = signal(false);

  protected readonly filtered = computed(() => {
    const f = this.filter();
    return f === 'TODAS' ? this.items() : this.items().filter((a) => a.estado === f);
  });

  protected readonly form = this.fb.group({
    usuarioId: [this.auth.operatorId(), [Validators.required, Validators.min(1)]],
  });

  ngOnInit(): void {
    this.load();
  }

  protected load(): void {
    this.loading.set(true);
    this.error.set('');
    this.api
      .alertas()
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

  protected attend(): void {
    const alerta = this.selected();
    if (!alerta || this.saving()) return;

    const responsibleId = this.auth.user()?.id ?? Number(this.form.controls.usuarioId.value);
    if (!responsibleId || responsibleId < 1) {
      this.form.markAllAsTouched();
      this.toast.show('Ingresa el identificador del responsable.', 'error');
      return;
    }

    this.saving.set(true);
    this.api
      .atender(alerta.id, responsibleId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          if (this.needsOperatorId) this.auth.rememberOperatorId(responsibleId);
          this.toast.show('Alerta atendida correctamente.');
          this.saving.set(false);
          this.selected.set(null);
          this.load();
        },
        error: (e: unknown) => {
          this.toast.show(errorMessage(e), 'error');
          this.saving.set(false);
        },
      });
  }
}
