# Proyecto Almacén

Sistema web para la gestión de productos, inventario, movimientos y alertas de stock, desarrollado con una arquitectura de microservicios.

El proyecto permite registrar entradas y salidas de inventario, consultar el stock disponible, administrar productos y categorías, generar alertas por stock bajo y controlar el acceso de los usuarios mediante roles.

## Funcionalidades principales

- Inicio de sesión con autenticación JWT.
- Control de acceso por roles.
- Gestión de productos y categorías.
- Consulta y administración del inventario.
- Registro de movimientos de entrada y salida.
- Actualización automática del stock.
- Alertas de stock bajo.
- Comunicación entre microservicios mediante OpenFeign.
- Registro y descubrimiento de servicios con Eureka.
- Configuración centralizada mediante Spring Cloud Config.
- API Gateway como punto de entrada al backend.
- Mensajería asíncrona con RabbitMQ.
- Publicación de eventos mediante Kafka.
- Circuit Breaker con Resilience4j para manejar fallos entre servicios.

## Arquitectura

El backend está dividido en servicios independientes:

| Servicio | Puerto | Descripción |
|---|---:|---|
| Eureka Server | 8761 | Registro y descubrimiento de servicios |
| Config Server | 8888 | Configuración centralizada |
| API Gateway | 8080 | Punto de entrada y control de seguridad |
| Auth Service | 8081 | Autenticación y gestión de JWT |
| Catalog Service | 8082 | Productos y categorías |
| Inventory Service | 8083 | Control de stock |
| Movement Service | 8084 | Entradas y salidas de inventario |
| Alert Service | 8085 | Gestión de alertas de stock |

Flujo general:

```text
Frontend
   |
   v
API Gateway
   |
   +--> Auth Service
   +--> Catalog Service
   +--> Inventory Service
   +--> Movement Service
   +--> Alert Service

Todos los servicios se registran en Eureka y obtienen su configuración desde Config Server.
```

## Tecnologías utilizadas

### Backend

- Java 21
- Spring Boot 3
- Spring Cloud
- Spring Security
- JWT
- Eureka Server
- Spring Cloud Config
- Spring Cloud Gateway
- OpenFeign
- Resilience4j
- RabbitMQ
- Apache Kafka
- MySQL
- Maven

### Frontend

- React
- Vite
- JavaScript
- CSS

## Base de datos

El proyecto utiliza una base de datos independiente por microservicio:

```text
almacen_auth
almacen_catalog
almacen_inventory
almacen_movement
almacen_alert
```

Los scripts SQL se encuentran en la carpeta correspondiente del proyecto.

## Roles

El sistema contempla los siguientes perfiles:

- `ADMIN`: acceso completo.
- `SUPERVISOR`: operaciones de supervisión y gestión.
- `ALMACENERO`: registro de movimientos y atención de alertas.
- `CONSULTA`: acceso de solo lectura.

## Estructura del proyecto

```text
Proyecto Almacen/
├── Backend/
│   ├── Infrastructure/
│   │   ├── eureka-server/
│   │   ├── config-server/
│   │   └── api-gateway/
│   └── Microservices/
│       ├── auth-service/
│       ├── catalog-service/
│       ├── inventory-service/
│       ├── movement-service/
│       └── alert-service/
├── Frontend/
├── DataBase/
├── Docs/
└── README.md
```

## Requisitos

Para ejecutar el proyecto en local se necesita:

- Java 21
- Maven
- Node.js y npm
- MySQL
- RabbitMQ
- Apache Kafka

## Variables de entorno

Por seguridad, las credenciales no se guardan directamente en el repositorio.

Cada servicio debe configurar las variables que correspondan, por ejemplo:

```text
DB_PASSWORD
JWT_SECRET
APP_ADMIN_PASSWORD
```

Se recomienda usar los archivos `.env.example` como referencia y no subir archivos `.env` con credenciales reales.

## Orden recomendado de inicio

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
12. Frontend

## Ejecución del frontend

Desde la carpeta `Frontend`:

```bash
npm install
npm run dev
```

La aplicación se abrirá normalmente en:

```text
http://localhost:5173
```

## Ejecución de los servicios

Cada módulo Spring Boot puede ejecutarse desde IntelliJ IDEA o mediante Maven.

Ejemplo:

```bash
mvn spring-boot:run
```

Antes de iniciar un microservicio, verificar que MySQL, Eureka y Config Server estén disponibles.

## Seguridad

El acceso externo se realiza a través del API Gateway.

El flujo de autenticación es:

```text
Usuario
  -> Login
  -> Auth Service
  -> JWT
  -> API Gateway
  -> Validación de token y rol
  -> Microservicio solicitado
```

Las rutas protegidas requieren un token Bearer válido.

## Mensajería

El proyecto utiliza dos mecanismos de mensajería:

- **RabbitMQ:** utilizado para el procesamiento asíncrono relacionado con movimientos y alertas.
- **Kafka:** utilizado para publicar eventos de movimientos de inventario.

## Tolerancia a fallos

`Movement Service` utiliza Resilience4j para proteger la comunicación con `Inventory Service`.

Si Inventory no está disponible, el sistema responde de forma controlada en lugar de provocar un fallo general. Al recuperarse el servicio, el Circuit Breaker permite restablecer automáticamente la comunicación.

## Estado actual

Actualmente se encuentran implementados y funcionando:

- Backend basado en microservicios.
- Registro de servicios con Eureka.
- Configuración centralizada.
- API Gateway.
- Seguridad JWT y autorización por roles.
- Catálogo.
- Inventario.
- Movimientos.
- Alertas.
- RabbitMQ.
- Kafka.
- Circuit Breaker.
- Frontend web integrado con el backend.

## Próximas mejoras

Como mejoras futuras se consideran:

- Gestión de usuarios desde el frontend.
- Contenerización con Docker.
- Automatización del despliegue.
- Mayor cobertura de pruebas.
- Monitoreo y métricas.

## Autor

Grupo 5
