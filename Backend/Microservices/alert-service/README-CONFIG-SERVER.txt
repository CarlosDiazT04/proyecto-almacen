ALERT-SERVICE - CLIENTE DE CONFIG SERVER
===========================================

CAMBIOS REALIZADOS
------------------
1. Se agrego spring-cloud-starter-config.
2. application.properties local queda solo con:
   spring.application.name=alert-service
   spring.config.import=optional:configserver:http://localhost:8888
3. Configuracion operativa desde:
   http://localhost:8888/alert-service/default
4. Se eliminaron .idea/ y target/.

VARIABLES DE ENTORNO
--------------------
DB_PASSWORD=<tu clave local>

ORDEN RECOMENDADO
-----------------
1. MySQL
2. Eureka Server
3. Config Server
4. Catalog Service
5. Inventory Service
6. Movement Service
7. Alert Service

PRUEBAS
-------
1. Maven Reload/Sync
2. Maven compile
3. Ejecutar AlertServiceApplication
4. GET http://localhost:8085/api/alertas
5. Via Gateway con JWT:
   GET http://localhost:8080/alert-service/api/alertas
6. Validar que RabbitMQ siga consumiendo almacen.movement.queue.

NOTA
----
No se modifico la logica Java ni el consumidor RabbitMQ.
