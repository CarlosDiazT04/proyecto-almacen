CONFIG SERVER - PROYECTO ALMACEN
================================

Este directorio contiene la configuracion centralizada que Config Server publica a los clientes.

Archivos:
- application.properties              -> configuracion comun a todos los clientes
- auth-service.properties             -> Auth Service
- catalog-service.properties          -> Catalog Service
- inventory-service.properties        -> Inventory Service
- movement-service.properties         -> Movement Service
- alert-service.properties            -> Alert Service
- api-gateway.properties              -> API Gateway

IMPORTANTE
----------
1. Los secretos NO se guardan aqui. Se mantienen como variables de entorno:
   DB_PASSWORD
   JWT_SECRET
   APP_ADMIN_PASSWORD
   y otras variables equivalentes.

2. Cada cliente debe incluir Spring Cloud Config Client y usar:
   spring.config.import=optional:configserver:http://localhost:8888

3. Cada cliente debe conservar localmente, como minimo:
   spring.application.name=<nombre-del-servicio>
   spring.config.import=optional:configserver:http://localhost:8888

4. Orden de arranque recomendado:
   Eureka -> Config Server -> API Gateway -> microservicios.
