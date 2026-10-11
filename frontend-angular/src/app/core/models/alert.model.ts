export interface Alerta {
  id: number;
  productoId: number;
  sku: string;
  producto: string;
  tipo: string;
  mensaje: string;
  stockActual: number;
  stockMinimo: number;
  estado: 'PENDIENTE' | 'ATENDIDA';
  fechaAlerta: string;
  fechaAtencion: string | null;
  atendidaPor: number | null;
}
