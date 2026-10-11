package com.proyectoalmacen.movement.messaging;

import java.time.LocalDateTime;

public record MovimientoEvent(
        Long movimientoId,
        Long productoId,
        String tipo,
        Integer cantidad,
        String referencia,
        String estado,
        LocalDateTime fechaMovimiento
) {
}