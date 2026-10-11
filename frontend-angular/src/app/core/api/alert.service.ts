import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Alerta } from '../models/alert.model';

@Injectable({ providedIn: 'root' })
export class AlertService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiBaseUrl}/alert-service/api/alertas`;

  alertas(): Observable<Alerta[]> {
    return this.http.get<Alerta[]>(this.base);
  }
  atender(id: number, usuarioId: number): Observable<Alerta> {
    return this.http.put<Alerta>(`${this.base}/${id}/atender`, { usuarioId });
  }
}
