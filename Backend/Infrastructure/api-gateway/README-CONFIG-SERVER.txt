API-GATEWAY - CLIENTE DE CONFIG SERVER
=======================================

CAMBIOS REALIZADOS
------------------
1. Se agrego spring-cloud-starter-config.
2. application.properties local queda minimo:
   spring.application.name=api-gateway
   spring.config.import=optional:configserver:http://localhost:8888
3. El puerto 8080, Eureka, discovery locator, Actuator y app.jwt.secret
   se obtienen desde Config Server.
4. JWT_SECRET sigue siendo variable de entorno local y debe tener exactamente
   el mismo valor que auth-service.
5. No se modifico la logica de seguridad ya validada.

ORDEN DE ARRANQUE
-----------------
1. Eureka Server
2. Config Server
3. Auth Service y microservicios
4. API Gateway

PRUEBAS
-------
A) Login publico:
   POST http://localhost:8080/auth-service/api/auth/login
   Authorization: No Auth
   Body JSON con username/password
   Resultado esperado: 200 OK

B) Ruta protegida sin token:
   GET http://localhost:8080/catalog-service/api/productos
   Resultado esperado: 401 Unauthorized

C) Ruta protegida con token ADMIN o CONSULTA:
   GET http://localhost:8080/catalog-service/api/productos
   Authorization: Bearer Token
   Resultado esperado: 200 OK

D) Rol CONSULTA intentando escribir:
   POST http://localhost:8080/catalog-service/api/categorias
   Authorization: Bearer Token del usuario CONSULTA
   Resultado esperado: 403 Forbidden
