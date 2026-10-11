# Proyecto Almacén - Frontend

Aplicación web del sistema de gestión de almacén. El frontend consume los servicios exclusivamente a través del API Gateway.

## Funcionalidades

- Inicio de sesión y control de acceso por roles.
- Dashboard con indicadores operativos.
- Gestión de productos y categorías.
- Consulta y configuración de inventario.
- Registro y consulta de movimientos.
- Consulta y atención de alertas.
- Manejo de sesión, permisos y errores de servicio.
- Diseño responsive.

## Roles

- `CONSULTA`: acceso de lectura.
- `ALMACENERO`: lectura, movimientos y atención de alertas.
- `SUPERVISOR`: operaciones y gestión de catálogo.
- `ADMIN`: acceso funcional completo.

## Requisitos

- Node.js 18 o superior.
- API Gateway disponible en `http://localhost:8080`.

## Ejecución local

```bash
npm install
npm run dev
```

Abrir:

```text
http://localhost:5173
```

Durante el desarrollo, Vite redirige las rutas de servicios al API Gateway configurado en `vite.config.js`.

## Compilación

```bash
npm run build
```

El resultado se genera en `dist/`.

## Variables de entorno

Copia `.env.example` como `.env` solo si necesitas cambiar la URL base:

```text
VITE_API_BASE_URL=http://localhost:8080
```

Si `VITE_API_BASE_URL` queda vacío, se utiliza el proxy local de Vite.

## Estructura

```text
src/
├── components/
├── context/
├── pages/
├── services/
├── utils/
├── App.jsx
├── main.jsx
└── styles.css
```

## Seguridad

El token de sesión se conserva en `sessionStorage` y se adjunta automáticamente a las solicitudes protegidas. La autorización definitiva se valida en el backend.

## Nota de alertas

El backend actual solicita un identificador numérico al registrar quién atiende una alerta. Si el login incorpora el campo `id`, el frontend lo usa automáticamente. Mientras ese campo no esté disponible, el sistema solicita el identificador del responsable la primera vez y lo recuerda durante la sesión.

## Archivos excluidos del repositorio

El `.gitignore` excluye `node_modules`, `dist`, archivos `.env`, configuraciones del IDE y logs.
