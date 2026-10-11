export type TipoMovimiento = 'ENTRADA' | 'SALIDA';

export interface Movimiento {
  id: number;
  productoId: number;
  sku: string;
  producto: string;
  tipo: TipoMovimiento;
  cantidad: number;
  motivo: string | null;
  referencia: string | null;
  usuarioId: number | null;
  estado: 'PROCESADO' | string;
  fechaMovimiento: string;
}

/** cantidad ≥1 */
export interface MovimientoRequest {
  productoId: number;
  tipo: TipoMovimiento;
  cantidad: number;
  motivo: string | null;
  referencia: string | null;
  usuarioId: number | null;
}
