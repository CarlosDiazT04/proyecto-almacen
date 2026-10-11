// Producción: reemplazar <TU-GATEWAY> por la URL pública del API Gateway (ej. https://almacen.midominio.com).
// El backend no tiene CORS: el frontend debe servirse bajo el mismo dominio (reverse proxy)
// o habilitar CORS en el gateway.
export const environment = {
  production: true,
  apiBaseUrl: 'https://<TU-GATEWAY>',
};
