-- ============================================================
-- PROYECTO ALMACEN
-- MICROSERVICIO: ALERT-SERVICE
-- BASE DE DATOS: almacen_alert
-- ============================================================

USE almacen_alert;


-- ============================================================
-- TABLA: alertas
-- ============================================================

CREATE TABLE IF NOT EXISTS alertas (

    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    -- Referencia lógica al producto de catalog-service
    producto_id BIGINT NOT NULL,

    -- Ejemplos:
    -- STOCK_BAJO
    -- SIN_STOCK
    tipo VARCHAR(30) NOT NULL,

    mensaje VARCHAR(500) NOT NULL,

    stock_actual INT,

    stock_minimo INT,

    -- PENDIENTE
    -- ATENDIDA
    -- DESCARTADA
    estado VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE',

    fecha_alerta TIMESTAMP NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    fecha_atencion TIMESTAMP NULL,

    -- Usuario que posteriormente atendió la alerta.
    -- Referencia lógica a auth-service.
    atendida_por BIGINT NULL,

    created_at TIMESTAMP NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL
        DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT chk_alerta_tipo
        CHECK (
            tipo IN (
                'STOCK_BAJO',
                'SIN_STOCK'
            )
        ),

    CONSTRAINT chk_alerta_estado
        CHECK (
            estado IN (
                'PENDIENTE',
                'ATENDIDA',
                'DESCARTADA'
            )
        ),

    CONSTRAINT chk_alerta_stock_actual
        CHECK (
            stock_actual IS NULL
            OR stock_actual >= 0
        ),

    CONSTRAINT chk_alerta_stock_minimo
        CHECK (
            stock_minimo IS NULL
            OR stock_minimo >= 0
        )
);


-- ============================================================
-- ÍNDICES
-- ============================================================

CREATE INDEX idx_alertas_producto
ON alertas(producto_id);

CREATE INDEX idx_alertas_estado
ON alertas(estado);

CREATE INDEX idx_alertas_fecha
ON alertas(fecha_alerta);


-- ============================================================
-- VALIDACIONES
-- ============================================================

SHOW TABLES;

DESCRIBE alertas;

SELECT * FROM alertas;