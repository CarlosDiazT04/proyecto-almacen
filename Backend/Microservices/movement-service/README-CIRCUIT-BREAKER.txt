MOVEMENT-SERVICE - CIRCUIT BREAKER / RESILIENCE4J
====================================================

OBJETIVO
--------
Proteger las llamadas:
Movement Service -> Inventory Service

Se mantiene intacto:
- Config Server
- Eureka
- OpenFeign
- RabbitMQ
- Kafka
- MySQL

CAMBIOS
-------
1. Dependencia nueva:
   spring-cloud-starter-circuitbreaker-resilience4j

2. Clase nueva:
   InventoryCircuitBreakerService.java

3. Excepcion nueva:
   InventoryUnavailableException.java

4. MovimientoService ahora utiliza InventoryCircuitBreakerService.

5. GlobalExceptionHandler responde 503 Service Unavailable cuando
   Inventory no esta disponible.

6. Configuracion del Circuit Breaker:
   - slidingWindowSize = 4
   - minimumNumberOfCalls = 2
   - failureRateThreshold = 50
   - waitDurationInOpenState = 10 segundos
   - half-open = 1 llamada

PRUEBA NORMAL
-------------
Servicios encendidos:
- Eureka
- Config Server
- Inventory
- Movement
- RabbitMQ
- Kafka

POST directo:
http://localhost:8084/api/movimientos

Body:
{
  "productoId": 1,
  "tipo": "ENTRADA",
  "cantidad": 1,
  "motivo": "Prueba Circuit Breaker normal",
  "referencia": "CB-NORMAL-001",
  "usuarioId": 1
}

Esperado:
201 Created / estado PROCESADO.

PRUEBA DE FALLA
---------------
1. Detener SOLO inventory-service.
2. Mantener movement-service encendido.
3. Ejecutar dos veces el POST:

http://localhost:8084/api/movimientos

Body:
{
  "productoId": 1,
  "tipo": "ENTRADA",
  "cantidad": 1,
  "motivo": "Prueba Circuit Breaker falla",
  "referencia": "CB-FALLA-001",
  "usuarioId": 1
}

Esperado:
503 Service Unavailable

Mensaje esperado:
inventory-service no esta disponible para consultar el inventario del producto 1

Despues de las fallas, el Circuit Breaker se abre y las siguientes llamadas
fallan rapidamente sin insistir continuamente contra Inventory.

RECUPERACION
------------
1. Volver a arrancar inventory-service.
2. Esperar al menos 10 segundos.
3. Ejecutar nuevamente el POST.
4. El Circuit Breaker pasa por HALF_OPEN y, si Inventory responde,
   vuelve a CLOSED.
5. Esperado: 201 Created / PROCESADO.

PRUEBA POR GATEWAY
------------------
POST:
http://localhost:8080/movement-service/api/movimientos

Authorization:
Bearer Token de ADMIN, SUPERVISOR o ALMACENERO.

Body: usar los mismos JSON anteriores.

NOTA
----
Para una demostracion academica se usa una ventana pequena para que el
Circuit Breaker pueda abrirse con pocas llamadas. En produccion se usarian
umbrales mayores y monitoreo con Actuator/Micrometer.
