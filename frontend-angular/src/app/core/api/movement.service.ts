import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Movimiento, MovimientoRequest } from '../models/movement.model';

@Injectable({ providedIn: 'root' })
export class MovementService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiBaseUrl}/movement-service/api/movimientos`;

  movimientos(): Observable<Movimiento[]> {
    return this.http.get<Movimiento[]>(this.base);
  }
  crear(data: MovimientoRequest): Observable<Movimiento> {
    return this.http.post<Movimiento>(this.base, data);
  }
}
