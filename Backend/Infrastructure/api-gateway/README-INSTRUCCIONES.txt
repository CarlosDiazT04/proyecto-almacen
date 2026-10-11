SECURITY - ACTUALIZACION SOLO API-GATEWAY
==========================================

OBJETIVO
--------
El API Gateway valida el JWT generado por auth-service y aplica autorizacion por roles.

ROLES
-----
ADMIN
SUPERVISOR
ALMACENERO
CONSULTA

REGLAS PRINCIPALES
------------------
PUBLICO:
- POST /auth-service/api/auth/login
- GET /actuator/health
- GET /actuator/info

AUTENTICADOS:
- Consultas de Catalog
- Consultas de Inventory
- Consultas de Movement
- Consultas de Alert

ADMIN / SUPERVISOR:
- Crear/modificar Catalog

ADMIN:
- Eliminar Catalog

ADMIN / SUPERVISOR / ALMACENERO:
- Registrar movimientos
- Atender alertas

ARCHIVOS NUEVOS
---------------
src/main/java/com/proyectoalmacen/gateway/security/JwtService.java
src/main/java/com/proyectoalmacen/gateway/security/JwtAuthenticationFilter.java
src/main/java/com/proyectoalmacen/gateway/security/SecurityConfig.java

ARCHIVOS MODIFICADOS
--------------------
pom.xml
src/main/resources/application.properties

PASOS
-----
1. Detener api-gateway.
2. Copiar la carpeta api-gateway del ZIP sobre el api-gateway actual.
3. Aceptar reemplazo de pom.xml y application.properties.
4. Maven Reload/Sync.
5. Maven compile.
6. Configurar en Run Configuration de api-gateway:
   JWT_SECRET=<EL MISMO VALOR QUE USA auth-service>
7. Arrancar api-gateway.
8. Probar:
   a) POST /auth-service/api/auth/login SIN token -> debe funcionar.
   b) GET /catalog-service/api/productos SIN token -> 401.
   c) GET /catalog-service/api/productos CON Bearer token -> 200.

IMPORTANTE
----------
- JWT_SECRET debe ser exactamente el mismo en auth-service y api-gateway.
- No guardar el secreto real dentro de application.properties.
- Las llamadas internas entre microservicios siguen funcionando porque la validacion externa se realiza en el Gateway.
- Para una arquitectura productiva, los puertos 8081-8085 no deberian exponerse directamente al exterior.
