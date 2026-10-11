MOVEMENT-SERVICE - CLIENTE DE CONFIG SERVER
=============================================

CAMBIOS REALIZADOS
------------------
1. Se agrego spring-cloud-starter-config.
2. application.properties local queda solo con:
   spring.application.name=movement-service
   spring.config.import=optional:configserver:http://localhost:8888
3. Puerto, MySQL, Eureka, Actuator, RabbitMQ y Kafka deben llegar desde Config Server.
4. Se eliminaron .idea/ y target/.

VARIABLES DE ENTORNO QUE DEBES CONSERVAR
----------------------------------------
DB_PASSWORD=<tu clave local>

ORDEN DE ARRANQUE RECOMENDADO
-----------------------------
1. MySQL
2. RabbitMQ
3. Kafka
4. Eureka Server
5. Config Server
6. Catalog Service
7. Inventory Service
8. Movement Service

PRUEBAS
-------
1. Maven Reload/Sync
2. Maven compile
3. Ejecutar MovementServiceApplication
4. Probar un movimiento directo o via Gateway con JWT.
5. Verificar que RabbitMQ siga recibiendo eventos.
6. Verificar que Kafka siga publicando en almacen.inventory.events.

NOTA
----
No se modifico la logica Java de Movement Service.
