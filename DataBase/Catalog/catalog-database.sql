-- ============================================================
-- PROYECTO ALMACEN
-- MICROSERVICIO: CATALOG-SERVICE
-- BASE DE DATOS: almacen_catalog
-- ============================================================

USE almacen_catalog;


-- ============================================================
-- TABLA: categorias
-- ============================================================

CREATE TABLE IF NOT EXISTS categorias (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    nombre VARCHAR(100) NOT NULL,
    descripcion VARCHAR(255),

    activo BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL
        DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT uk_categorias_nombre UNIQUE (nombre)
);


-- ============================================================
-- TABLA: productos
-- ============================================================

CREATE TABLE IF NOT EXISTS productos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    sku VARCHAR(50) NOT NULL,

    nombre VARCHAR(150) NOT NULL,

    descripcion VARCHAR(500),

    precio DECIMAL(12,2) NOT NULL,

    categoria_id BIGINT NOT NULL,

    activo BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL
        DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT uk_productos_sku
        UNIQUE (sku),

    CONSTRAINT chk_productos_precio
        CHECK (precio >= 0),

    CONSTRAINT fk_productos_categoria
        FOREIGN KEY (categoria_id)
        REFERENCES categorias(id)
        ON DELETE RESTRICT
);


-- ============================================================
-- CATEGORÍAS INICIALES
-- ============================================================

INSERT IGNORE INTO categorias
(nombre, descripcion)
VALUES
('Laptops', 'Computadoras portátiles'),
('Monitores', 'Monitores y pantallas'),
('Periféricos', 'Teclados, mouse y otros periféricos'),
('Almacenamiento', 'Discos SSD, discos duros y otros dispositivos de almacenamiento');


-- ============================================================
-- PRODUCTOS INICIALES
-- ============================================================

INSERT IGNORE INTO productos
(sku, nombre, descripcion, precio, categoria_id)
VALUES
(
    'LAP-LEN-001',
    'Laptop Lenovo ThinkPad',
    'Laptop Lenovo ThinkPad para uso empresarial',
    3200.00,
    1
),
(
    'LAP-HP-001',
    'Laptop HP ProBook',
    'Laptop HP ProBook para uso empresarial',
    2850.00,
    1
),
(
    'MON-LG-001',
    'Monitor LG 24 pulgadas',
    'Monitor LG de 24 pulgadas',
    750.00,
    2
),
(
    'PER-LOG-001',
    'Teclado Logitech',
    'Teclado Logitech',
    120.00,
    3
),
(
    'PER-LOG-002',
    'Mouse Logitech',
    'Mouse Logitech',
    80.00,
    3
),
(
    'ALM-KIN-001',
    'SSD Kingston 1TB',
    'Unidad SSD Kingston de 1TB',
    350.00,
    4
);


-- ============================================================
-- VALIDACIONES
-- ============================================================

SHOW TABLES;

SELECT * FROM categorias;

SELECT
    p.id,
    p.sku,
    p.nombre,
    p.precio,
    c.nombre AS categoria,
    p.activo
FROM productos p
INNER JOIN categorias c
    ON p.categoria_id = c.id;