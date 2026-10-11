export interface Categoria {
  id: number;
  nombre: string;
  descripcion: string | null;
  activo: boolean;
}
export type CategoriaRequest = Omit<Categoria, 'id'>;

export interface Producto {
  id: number;
  sku: string;
  nombre: string;
  descripcion: string | null;
  precio: number;
  categoriaId: number;
  categoria: string;
  activo: boolean;
}

/** sku ≤50, nombre ≤150, descripcion ≤500, precio ≥0 */
export interface ProductoRequest {
  sku: string;
  nombre: string;
  descripcion: string;
  precio: number;
  categoriaId: number;
  activo: boolean;
}
