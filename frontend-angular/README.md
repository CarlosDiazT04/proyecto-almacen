# Proyecto Almacén – Frontend Angular

Migración del frontend React a Angular (standalone components, Signals, Reactive Forms, control flow `@if/@for`).
Consume el backend de microservicios **solo a través del API Gateway** (`:8080`).

## Requisitos

- Node.js 20+ (probado con 24) y npm
- Angular CLI (`npm i -g @angular/cli`) o usar `npx ng ...`
- API Gateway corriendo en `http://localhost:8080`

## Comandos

```bash
npm install
npm start          # = ng serve  → http://localhost:4200 (con proxy al gateway)
npm run build      # = ng build  → dist/frontend-angular (usa environment.prod.ts)
```

> El puerto del dev server es **4200** (el proyecto React usaba 5173).

## Environments y proxy

| Archivo | Uso | `apiBaseUrl` |
|---|---|---|
| `src/environments/environment.ts` | desarrollo | `''` (mismo origen → proxy) |
| `src/environments/environment.prod.ts` | `ng build` (producción) | `https://<TU-GATEWAY>` (reemplazar) |

Todas las llamadas se arman como `${environment.apiBaseUrl}/<servicio>/api/...`.

`proxy.conf.json` (registrado en `angular.json` → `serve.options.proxyConfig`) reenvía `/auth-service`,
`/catalog-service`, `/inventory-service`, `/movement-service`, `/alert-service` y `/actuator` a `http://localhost:8080`.

**CORS:** el backend no tiene CORS configurado. En desarrollo se evita con el proxy. En producción, sirve el
frontend bajo el mismo dominio (reverse proxy) o configura CORS en el gateway. No se modificó el backend.

## Credenciales

El usuario administrador lo crea el backend con `APP_ADMIN_USERNAME` / `APP_ADMIN_PASSWORD`
(ver `Backend/.env.example`). No están en este repositorio.

## Estructura

```
src/
├── styles.scss                 # punto de entrada de estilos globales
├── styles/                     # parciales SCSS compartidos
│   ├── _variables.scss         #   tokens (colores, breakpoints, mixin max())
│   ├── _base.scss  _brand.scss _buttons.scss _forms.scss
│   └── _cards.scss _tables.scss _badges.scss _toolbar.scss
├── environments/
└── app/
    ├── core/      auth.service, auth.guard, auth.interceptor, error.interceptor, api/*.service.ts, models/
    ├── shared/    modal, page-header, state (loading/empty/error-box), toast, pipes (money/dateTime/num)
    ├── layout/    sidebar colapsable + topbar + router-outlet
    └── pages/     login, dashboard, productos, categorias, inventario, movimientos, alertas
```

### Organización de estilos

- **Globales** (`src/styles/`): solo lo reutilizado por varias pantallas (botones, formularios, tablas, badges,
  tarjetas, toolbar, marca). Los tokens y el mixin responsive están en `_variables.scss`.
- **Por componente** (`*.component.scss`, encapsulados): lo propio de cada pieza, incluidas sus `@media`
  (layout, modal, toast, page-header, state, login, dashboard, alertas).

## Matriz de permisos (UI)

| Acción | Roles |
|---|---|
| Crear/editar productos y categorías | ADMIN, SUPERVISOR |
| Crear/editar inventario, registrar movimientos, atender alertas | ADMIN, SUPERVISOR, ALMACENERO |
| Solo lectura | CONSULTA |

La autorización real la aplica el gateway; la UI solo oculta acciones.

## Flujo de prueba

1. Iniciar sesión con el admin del backend.
2. **Dashboard**: revisar KPIs.
3. **Categorías** → "+ Nueva categoría".
4. **Productos** → "+ Nuevo producto" (elige la categoría activa).
5. **Inventario** → "+ Crear inventario" para ese producto, con stock mínimo (ej. 10) y stock actual mayor (ej. 15).
6. **Movimientos** → registrar una ENTRADA y luego una SALIDA que deje el stock por debajo del mínimo
   (una SALIDA mayor al stock devuelve 400 con mensaje).
7. **Alertas** → la alerta de stock bajo se genera por evento (RabbitMQ/Kafka) y puede tardar un instante:
   usa el botón **Actualizar**. Luego "Marcar como atendida" (si el login no devuelve `id`, se pide el
   identificador del responsable y se recuerda en `sessionStorage`).
