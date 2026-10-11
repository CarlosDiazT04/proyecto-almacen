CATALOG-SERVICE - CLIENTE DE CONFIG SERVER
=============================================

CAMBIOS REALIZADOS
------------------
1. Se agrego la dependencia:
   org.springframework.cloud:spring-cloud-starter-config

2. application.properties local queda solo con:
   spring.application.name=catalog-service
   spring.config.import=optional:configserver:http://localhost:8888

3. La configuracion operativa se obtiene ahora desde Config Server:
   http://localhost:8888/catalog-service/default

4. Se eliminaron del ZIP:
   .idea/
   target/

ORDEN DE ARRANQUE
-----------------
1. MySQL
2. Eureka Server
3. Config Server
4. Catalog Service

VARIABLES DE ENTORNO QUE DEBES CONSERVAR EN CATALOG-SERVICE
-----------------------------------------------------------
DB_PASSWORD=<tu clave local>

La URL, usuario de BD, puerto, JPA, Eureka y Actuator se obtienen
desde Config Server.

PRUEBA
------
1. Maven Reload/Sync
2. Maven compile
3. Ejecutar CatalogServiceApplication
4. Revisar en consola que Config Server sea consultado.
5. Probar:
   GET http://localhost:8082/api/productos

Y via Gateway con JWT:
   GET http://localhost:8080/catalog-service/api/productos

NOTA
----
No se modifico la logica Java del Catalog Service.
