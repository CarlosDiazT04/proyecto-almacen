-- ============================================================
-- PROYECTO ALMACEN
-- MICROSERVICIO: INVENTORY-SERVICE
-- BASE DE DATOS: almacen_inventory
-- ============================================================

USE almacen_inventory;


-- ============================================================
-- TABLA: inventarios
-- ============================================================

CREATE TABLE IF NOT EXISTS inventarios (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    -- Referencia lógica al producto de catalog-service.
    -- NO se crea Foreign Key entre microservicios.
    producto_id BIGINT NOT NULL,

    stock_actual INT NOT NULL DEFAULT 0,

    stock_reservado INT NOT NULL DEFAULT 0,

    stock_minimo INT NOT NULL DEFAULT 0,

    activo BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMP NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL
        DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT uk_inventarios_producto
        UNIQUE (producto_id),

    CONSTRAINT chk_stock_actual
        CHECK (stock_actual >= 0),

    CONSTRAINT chk_stock_reservado
        CHECK (stock_reservado >= 0),

    CONSTRAINT chk_stock_minimo
        CHECK (stock_minimo >= 0),

    CONSTRAINT chk_stock_reservado_actual
        CHECK (stock_reservado <= stock_actual)
);


-- ============================================================
-- DATOS INICIALES
--
-- producto_id corresponde lógicamente a los productos
-- existentes en almacen_catalog.
-- ============================================================

INSERT IGNORE INTO inventarios
(
    producto_id,
    stock_actual,
    stock_reservado,
    stock_minimo
)
VALUES
(1, 10, 0, 3),
(2, 8, 0, 3),
(3, 15, 0, 5),
(4, 25, 0, 5),
(5, 30, 0, 5),
(6, 20, 0, 5);


-- ============================================================
-- VALIDACIONES
-- ============================================================

SHOW TABLES;


SELECT
    id,
    producto_id,
    stock_actual,
    stock_reservado,
    (stock_actual - stock_reservado) AS stock_disponible,
    stock_minimo,
    activo
FROM inventarios;