import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { finalize, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoginRequest, LoginResponse, Rol } from './models/auth.model';

const TOKEN_KEY = 'almacen_token';
const USER_KEY = 'almacen_user';
const operatorKey = (username: string) => `almacen_operator_id:${username}`;

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  readonly user = signal<LoginResponse | null>(this.readUser());
  readonly roles = computed<Rol[]>(() => this.user()?.roles ?? []);
  readonly loading = signal(false);
  /** Aviso a mostrar en /login (p. ej. sesión vencida). */
  readonly notice = signal('');

  get token(): string | null {
    try {
      return sessionStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  }

  hasRole(...allowed: Rol[]): boolean {
    return this.roles().some((r) => allowed.includes(r));
  }

  login(username: string, password: string): Observable<LoginResponse> {
    const body: LoginRequest = { username, password };
    this.loading.set(true);
    this.notice.set('');
    return this.http
      .post<LoginResponse>(`${environment.apiBaseUrl}/auth-service/api/auth/login`, body)
      .pipe(
        tap((data) => {
          try {
            sessionStorage.setItem(TOKEN_KEY, data.token);
            sessionStorage.setItem(USER_KEY, JSON.stringify(data));
          } catch {
            /* sessionStorage no disponible: la sesión vive solo en memoria */
          }
          this.user.set(data);
        }),
        finalize(() => this.loading.set(false)),
      );
  }

  logout(): void {
    this.clearSession();
    void this.router.navigate(['/login']);
  }

  /** Limpia la sesión sin navegar (lo usa el interceptor ante un 401). */
  clearSession(): void {
    try {
      sessionStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(USER_KEY);
    } catch {
      /* ignorar */
    }
    this.user.set(null);
  }

  /** Id del responsable: el del login si existe; si no, el recordado en sessionStorage. */
  operatorId(): number | null {
    const id = this.user()?.id;
    if (id) return id;
    try {
      const saved = Number(sessionStorage.getItem(operatorKey(this.user()?.username ?? '')));
      return saved >= 1 ? saved : null;
    } catch {
      return null;
    }
  }

  rememberOperatorId(id: number): void {
    try {
      sessionStorage.setItem(operatorKey(this.user()?.username ?? ''), String(id));
    } catch {
      /* ignorar */
    }
  }

  private readUser(): LoginResponse | null {
    try {
      const raw = sessionStorage.getItem(USER_KEY);
      return raw ? (JSON.parse(raw) as LoginResponse) : null;
    } catch {
      return null;
    }
  }
}
