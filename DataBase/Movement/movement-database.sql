-- ============================================================
-- PROYECTO ALMACEN
-- MICROSERVICIO: MOVEMENT-SERVICE
-- BASE DE DATOS: almacen_movement
-- ============================================================

USE almacen_movement;


-- ============================================================
-- TABLA: movimientos
-- ============================================================

CREATE TABLE IF NOT EXISTS movimientos (

    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    -- Referencia lógica al producto de catalog-service
    producto_id BIGINT NOT NULL,

    -- ENTRADA
    -- SALIDA
    -- AJUSTE_ENTRADA
    -- AJUSTE_SALIDA
    tipo VARCHAR(30) NOT NULL,

    cantidad INT NOT NULL,

    motivo VARCHAR(255),

    -- Ejemplo:
    -- OC-000001
    -- DEV-000001
    -- AJU-000001
    referencia VARCHAR(100),

    -- Referencia lógica al usuario de auth-service
    usuario_id BIGINT,

    -- PENDIENTE
    -- PROCESADO
    -- RECHAZADO
    estado VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE',

    fecha_movimiento TIMESTAMP NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    created_at TIMESTAMP NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_movimiento_cantidad
        CHECK (cantidad > 0),

    CONSTRAINT chk_movimiento_tipo
        CHECK (
            tipo IN (
                'ENTRADA',
                'SALIDA',
                'AJUSTE_ENTRADA',
                'AJUSTE_SALIDA'
            )
        ),

    CONSTRAINT chk_movimiento_estado
        CHECK (
            estado IN (
                'PENDIENTE',
                'PROCESADO',
                'RECHAZADO'
            )
        )
);


-- ============================================================
-- ÍNDICES
-- ============================================================

CREATE INDEX idx_movimientos_producto
ON movimientos(producto_id);

CREATE INDEX idx_movimientos_fecha
ON movimientos(fecha_movimiento);

CREATE INDEX idx_movimientos_usuario
ON movimientos(usuario_id);


-- ============================================================
-- VALIDACIÓN
-- ============================================================

SHOW TABLES;

DESCRIBE movimientos;