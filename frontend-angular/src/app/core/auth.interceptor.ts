import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(AuthService).token;
  const headers: Record<string, string> = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (req.body !== null && req.body !== undefined) headers['Content-Type'] = 'application/json';
  return next(Object.keys(headers).length ? req.clone({ setHeaders: headers }) : req);
};
