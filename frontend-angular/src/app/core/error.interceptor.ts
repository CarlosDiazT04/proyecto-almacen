import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { ApiError } from './api-error';
import { AuthService } from './auth.service';

const SESSION_EXPIRED = 'Tu sesión venció. Inicia sesión nuevamente.';

/** Extrae el cuerpo del error: JSON (objeto) o texto plano, según Content-Type. */
function parseBody(err: HttpErrorResponse): unknown {
  const isJson = (err.headers?.get('content-type') ?? '').includes('application/json');
  if (typeof err.error === 'string' && isJson) {
    try {
      return JSON.parse(err.error);
    } catch {
      return err.error;
    }
  }
  return err.error;
}

function friendlyMessage(status: number, data: unknown): string {
  const obj = data && typeof data === 'object' ? (data as Record<string, unknown>) : null;
  const msg = typeof obj?.['message'] === 'string' ? (obj['message'] as string) : '';
  if (status === 0) return 'No se pudo conectar con el sistema. Verifica que los servicios estén disponibles.';
  if (status === 401) return SESSION_EXPIRED;
  if (status === 403) return 'No tienes permisos para realizar esta acción.';
  if (status === 404) return msg || 'No se encontró la información solicitada.';
  if (status === 502 || status === 503) {
    return 'El servicio no está disponible temporalmente. Intenta nuevamente en unos momentos.';
  }
  if (status >= 500) return 'Ocurrió un problema al procesar la solicitud. Intenta nuevamente.';
  if (typeof data === 'string') return data || `Error ${status}`;
  const error = typeof obj?.['error'] === 'string' ? (obj['error'] as string) : '';
  return msg || error || `Error ${status}`;
}

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((err: unknown) => {
      if (!(err instanceof HttpErrorResponse)) return throwError(() => err);

      const data = parseBody(err);
      const isLogin = req.url.endsWith('/auth-service/api/auth/login');

      if (err.status === 401 && !isLogin) {
        auth.clearSession();
        auth.notice.set(SESSION_EXPIRED);
        void router.navigate(['/login']);
      }

      const message =
        isLogin && (err.status === 401 || err.status === 403)
          ? 'Usuario o contraseña incorrectos.'
          : friendlyMessage(err.status, data);

      return throwError(() => new ApiError(message, err.status, data));
    }),
  );
};
