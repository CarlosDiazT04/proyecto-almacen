-- ============================================================
-- PROYECTO ALMACEN - ARQUITECTURA DE MICROSERVICIOS
-- ============================================================

-- 1. AUTH SERVICE
-- Usuarios, roles y seguridad
CREATE DATABASE IF NOT EXISTS almacen_auth
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

-- 2. CATALOG SERVICE
-- Productos y categorías
CREATE DATABASE IF NOT EXISTS almacen_catalog
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

-- 3. INVENTORY SERVICE
-- Stock y disponibilidad
CREATE DATABASE IF NOT EXISTS almacen_inventory
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

-- 4. MOVEMENT SERVICE
-- Entradas, salidas y movimientos de almacén
CREATE DATABASE IF NOT EXISTS almacen_movement
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

-- 5. ALERT SERVICE
-- Alertas generadas por el sistema
CREATE DATABASE IF NOT EXISTS almacen_alert
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

SHOW DATABASES;