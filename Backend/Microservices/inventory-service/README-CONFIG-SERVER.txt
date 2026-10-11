INVENTORY-SERVICE - CLIENTE DE CONFIG SERVER
===============================================

CAMBIOS REALIZADOS
------------------
1. Se agrego la dependencia:
   org.springframework.cloud:spring-cloud-starter-config

2. application.properties local queda solo con:
   spring.application.name=inventory-service
   spring.config.import=optional:configserver:http://localhost:8888

3. La configuracion operativa se obtiene desde Config Server:
   http://localhost:8888/inventory-service/default

4. Se eliminaron del ZIP:
   .idea/
   target/

VARIABLES DE ENTORNO QUE DEBES CONSERVAR
----------------------------------------
DB_PASSWORD=<tu clave local>

ORDEN DE ARRANQUE RECOMENDADO
-----------------------------
1. MySQL
2. Eureka Server
3. Config Server
4. Catalog Service
5. Inventory Service

PRUEBAS
-------
1. Maven Reload/Sync
2. Maven compile
3. Ejecutar InventoryServiceApplication
4. Probar directo:
   GET http://localhost:8083/api/inventarios

5. Verificar que Inventory siga consultando Catalog por OpenFeign.

6. Probar via Gateway con JWT:
   GET http://localhost:8080/inventory-service/api/inventarios

NOTA
----
No se modifico la logica Java del Inventory Service.
