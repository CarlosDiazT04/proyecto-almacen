AUTH-SERVICE - CLIENTE DE CONFIG SERVER
========================================

CAMBIOS
-------
- Se agrego spring-cloud-starter-config.
- application.properties local queda solo con spring.application.name y spring.config.import.
- La configuracion se obtiene desde http://localhost:8888/auth-service/default

VARIABLES DE ENTORNO QUE DEBES CONSERVAR EN AUTH-SERVICE
--------------------------------------------------------
DB_PASSWORD=<tu clave local>
JWT_SECRET=<tu secreto JWT>
APP_ADMIN_PASSWORD=<tu clave admin>

Opcionales si deseas sobrescribir defaults:
APP_ADMIN_USERNAME
APP_ADMIN_NAME
APP_ADMIN_EMAIL
JWT_EXPIRATION_MS

IMPORTANTE
----------
- JWT_SECRET debe seguir siendo exactamente el mismo que usa api-gateway.
- No guardes secretos reales en Config Server ni en application.properties.

ORDEN DE ARRANQUE
-----------------
1. MySQL
2. Eureka Server
3. Config Server
4. Auth Service

PRUEBAS
-------
1. Maven Reload/Sync
2. Maven compile
3. Ejecutar AuthServiceApplication
4. POST http://localhost:8081/api/auth/login
5. Probar tambien por Gateway: POST http://localhost:8080/auth-service/api/auth/login
