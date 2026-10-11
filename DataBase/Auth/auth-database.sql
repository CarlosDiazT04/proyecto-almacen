-- ============================================================
-- PROYECTO ALMACEN
-- MICROSERVICIO: AUTH-SERVICE
-- BASE DE DATOS: almacen_auth
-- ============================================================

USE almacen_auth;


-- ============================================================
-- TABLA: usuarios
-- ============================================================

CREATE TABLE IF NOT EXISTS usuarios (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    username VARCHAR(50) NOT NULL,
    password VARCHAR(100) NOT NULL,

    nombre VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,

    activo BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL
        DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT uk_usuarios_username UNIQUE (username),
    CONSTRAINT uk_usuarios_email UNIQUE (email)
);


-- ============================================================
-- TABLA: roles
-- ============================================================

CREATE TABLE IF NOT EXISTS roles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    nombre VARCHAR(50) NOT NULL,
    descripcion VARCHAR(255),

    CONSTRAINT uk_roles_nombre UNIQUE (nombre)
);


-- ============================================================
-- TABLA INTERMEDIA: usuario_roles
-- ============================================================

CREATE TABLE IF NOT EXISTS usuario_roles (
    usuario_id BIGINT NOT NULL,
    rol_id BIGINT NOT NULL,

    PRIMARY KEY (usuario_id, rol_id),

    CONSTRAINT fk_usuario_roles_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_usuario_roles_rol
        FOREIGN KEY (rol_id)
        REFERENCES roles(id)
        ON DELETE RESTRICT
);


-- ============================================================
-- ROLES INICIALES
-- ============================================================

INSERT IGNORE INTO roles (nombre, descripcion) VALUES
('ADMIN', 'Administrador general del sistema'),
('SUPERVISOR', 'Supervisión de inventario y operaciones'),
('ALMACENERO', 'Gestión operativa de entradas y salidas'),
('CONSULTA', 'Acceso de solo lectura');


-- ============================================================
-- VALIDACIONES
-- ============================================================

SHOW TABLES;

SELECT * FROM roles;