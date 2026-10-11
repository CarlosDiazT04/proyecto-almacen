export interface Inventario {
  id: number;
  productoId: number;
  sku: string;
  producto: string;
  stockActual: number;
  stockReservado: number;
  stockDisponible: number;
  stockMinimo: number;
  activo: boolean;
  stockBajo: boolean;
}

/** Enteros ≥0 */
export interface InventarioRequest {
  productoId: number;
  stockActual: number;
  stockReservado: number;
  stockMinimo: number;
  activo: boolean;
}
