package com.proyectoalmacen.movement.dto;

import java.time.LocalDateTime;

public record MovimientoResponse(
        Long id,
        Long productoId,
        String sku,
        String producto,
        String tipo,
        Integer cantidad,
        String motivo,
        String referencia,
        Long usuarioId,
        String estado,
        LocalDateTime fechaMovimiento
) {}
