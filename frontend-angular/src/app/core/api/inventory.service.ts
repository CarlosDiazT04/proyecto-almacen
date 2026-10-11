import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Inventario, InventarioRequest } from '../models/inventory.model';

@Injectable({ providedIn: 'root' })
export class InventoryService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiBaseUrl}/inventory-service/api/inventarios`;

  inventarios(): Observable<Inventario[]> {
    return this.http.get<Inventario[]>(this.base);
  }
  crear(data: InventarioRequest): Observable<Inventario> {
    return this.http.post<Inventario>(this.base, data);
  }
  actualizar(id: number, data: InventarioRequest): Observable<Inventario> {
    return this.http.put<Inventario>(`${this.base}/${id}`, data);
  }
}
