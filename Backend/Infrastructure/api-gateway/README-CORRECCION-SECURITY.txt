API GATEWAY - CORRECCION SECURITY/JWT
=====================================

Correcciones realizadas:
- JwtService usa exactamente la misma estrategia de clave que auth-service:
  primero intenta BASE64 y, si no corresponde, usa UTF-8.
- Se conserva validacion de roles ADMIN, SUPERVISOR, ALMACENERO y CONSULTA.
- Se conserva login publico por /auth-service/api/auth/login.
- Se conserva Eureka con 127.0.0.1.

IMPORTANTE:
- Configurar JWT_SECRET en Run Configuration del api-gateway.
- Debe ser EXACTAMENTE el mismo valor configurado en auth-service.
- Generar un token NUEVO despues de reiniciar auth-service/api-gateway.

Pruebas esperadas:
1) POST http://localhost:8080/auth-service/api/auth/login -> 200 sin token.
2) GET http://localhost:8080/catalog-service/api/productos -> 401 sin token.
3) GET http://localhost:8080/catalog-service/api/productos -> 200 con Bearer token valido.
