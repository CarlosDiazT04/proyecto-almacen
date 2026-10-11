# Backend - Proyecto Almacen

Backend de microservicios para el Sistema de Almacen.

## Stack
- Java 21
- Spring Boot 3.3.4
- Spring Cloud 2023.0.3
- MySQL
- Eureka Service Discovery
- Spring Cloud Config Server
- Spring Cloud Gateway
- Spring Security + JWT
- OpenFeign
- RabbitMQ
- Apache Kafka
- Resilience4j / Circuit Breaker

## Infraestructura y puertos
- Eureka Server: `8761`
- Config Server: `8888`
- API Gateway: `8080`
- Auth Service: `8081`
- Catalog Service: `8082`
- Inventory Service: `8083`
- Movement Service: `8084`
- Alert Service: `8085`
- RabbitMQ AMQP: `5672`
- RabbitMQ Management: `15672`
- Kafka: `9092`

## Bases de datos
- `almacen_auth`
- `almacen_catalog`
- `almacen_inventory`
- `almacen_movement`
- `almacen_alert`

## Arquitectura funcional
- El API Gateway es el punto de entrada externo y valida JWT.
- Auth Service emite JWT y maneja usuarios/roles.
- Inventory consulta Catalog mediante OpenFeign.
- Movement consulta/actualiza Inventory mediante OpenFeign protegido con Circuit Breaker.
- Movement publica eventos operativos en RabbitMQ para Alert Service.
- Movement publica eventos de auditoria en Kafka (`almacen.inventory.events`).
- Alert Service consume RabbitMQ y genera alertas de stock bajo.
- La configuracion compartida y por servicio se entrega desde Config Server.

## Variables de entorno
No guardar secretos reales en Git. Configurar en IntelliJ Run Configuration:
- `DB_PASSWORD` en los servicios con MySQL.
- `JWT_SECRET` en Auth Service y API Gateway, con exactamente el mismo valor.
- `APP_ADMIN_PASSWORD` en Auth Service si se desea crear el admin inicial.

Ver `.env.example` para placeholders.

## Orden recomendado de arranque local
1. MySQL
2. RabbitMQ
3. Kafka
4. Eureka Server
5. Config Server
6. API Gateway
7. Auth Service
8. Catalog Service
9. Inventory Service
10. Movement Service
11. Alert Service

> Para probar llamadas entre servicios, Catalog e Inventory deben estar arriba antes de Movement y Alert.

## Seguridad
Roles disponibles:
- `ADMIN`
- `SUPERVISOR`
- `ALMACENERO`
- `CONSULTA`

Comportamiento validado:
- Login publico por Gateway.
- Rutas privadas sin token: `401 Unauthorized`.
- Token valido: acceso segun rol.
- Rol sin permiso de escritura: `403 Forbidden`.

## Mensajeria
### RabbitMQ
- Exchange: `almacen.exchange`
- Queue: `almacen.movement.queue`
- Routing key: `almacen.movement.processed`

### Kafka
- Topic: `almacen.inventory.events`
- Movement Service publica eventos `MOVEMENT_PROCESSED`.

## Circuit Breaker
`Movement Service -> Inventory Service` esta protegido con Resilience4j.
- Si Inventory no responde, Movement devuelve error controlado.
- Tras el tiempo de espera, el circuito permite una prueba HALF_OPEN y vuelve a CLOSED si Inventory se recupera.

## Eureka local
Para evitar problemas de DNS de Windows (`*.mshome.net`), los clientes se registran con:
- `127.0.0.1`
- `eureka.instance.instance-id=${spring.application.name}:${server.port}`

Estas propiedades estan centralizadas en Config Server. Reinicia todos los clientes despues de actualizar Config Server para que Eureka refleje el cambio.

## Git
El repositorio ignora `target/`, `.idea/`, archivos `.env`, logs y temporales.
