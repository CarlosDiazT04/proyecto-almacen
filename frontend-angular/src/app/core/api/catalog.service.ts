import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Categoria, CategoriaRequest, Producto, ProductoRequest } from '../models/catalog.model';

@Injectable({ providedIn: 'root' })
export class CatalogService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiBaseUrl}/catalog-service/api`;

  productos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.base}/productos`);
  }
  crearProducto(data: ProductoRequest): Observable<Producto> {
    return this.http.post<Producto>(`${this.base}/productos`, data);
  }
  actualizarProducto(id: number, data: ProductoRequest): Observable<Producto> {
    return this.http.put<Producto>(`${this.base}/productos/${id}`, data);
  }

  categorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(`${this.base}/categorias`);
  }
  crearCategoria(data: CategoriaRequest): Observable<Categoria> {
    return this.http.post<Categoria>(`${this.base}/categorias`, data);
  }
  actualizarCategoria(id: number, data: CategoriaRequest): Observable<Categoria> {
    return this.http.put<Categoria>(`${this.base}/categorias/${id}`, data);
  }
}
