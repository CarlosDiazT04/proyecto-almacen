export type Rol = 'CONSULTA' | 'ALMACENERO' | 'SUPERVISOR' | 'ADMIN';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  tipo: string;
  username: string;
  nombre: string;
  roles: Rol[];
  id?: number;
}
