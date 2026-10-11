# Pruebas finales del Backend

## 1. Config Server
`GET http://localhost:8888/catalog-service/default` -> debe listar propiedades de Catalog y comunes.

## 2. Login por Gateway
`POST http://localhost:8080/auth-service/api/auth/login`

Body:
```json
{
  "username": "admin",
  "password": "TU_PASSWORD_ADMIN"
}
```
Authorization: `No Auth`. Esperado: `200 OK` + JWT.

## 3. Seguridad
Sin token:
`GET http://localhost:8080/catalog-service/api/productos` -> `401`.

Con Bearer Token ADMIN o CONSULTA:
`GET http://localhost:8080/catalog-service/api/productos` -> `200`.

Con Bearer Token CONSULTA:
`POST http://localhost:8080/catalog-service/api/categorias` -> `403`.

## 4. Inventory + OpenFeign
`GET http://localhost:8080/inventory-service/api/inventarios` con Bearer Token -> `200` y datos enriquecidos de Catalog.

## 5. Movement + RabbitMQ + Kafka
`POST http://localhost:8080/movement-service/api/movimientos` con Bearer Token ADMIN/SUPERVISOR/ALMACENERO.

Body:
```json
{
  "productoId": 1,
  "tipo": "ENTRADA",
  "cantidad": 1,
  "motivo": "Prueba final",
  "referencia": "FINAL-001",
  "usuarioId": 1
}
```
Esperado: `201 Created`, `estado=PROCESADO`.

RabbitMQ: verificar flujo hacia `almacen.movement.queue`.
Kafka: verificar evento en `almacen.inventory.events`.

## 6. Alertas
`GET http://localhost:8080/alert-service/api/alertas` con Bearer Token -> `200`.

Para atender una alerta:
`PUT http://localhost:8080/alert-service/api/alertas/{id}/atender`

Body:
```json
{ "usuarioId": 1 }
```

## 7. Circuit Breaker
1. Con Inventory encendido, registrar movimiento -> `201`.
2. Detener solo Inventory.
3. Repetir movimiento -> error controlado (`503` esperado por el fallback; dependiendo de una llamada Feign fuera del circuito, revisar que no quede `502`).
4. Volver a levantar Inventory.
5. Esperar al menos 10 segundos.
6. Repetir movimiento -> `201`, demostrando recuperacion.

## 8. Eureka
Abrir `http://localhost:8761`.
Esperado tras reiniciar los clientes: instancias con IDs `servicio:puerto` y direccion local `127.0.0.1`, evitando `Carlos.mshome.net`.
