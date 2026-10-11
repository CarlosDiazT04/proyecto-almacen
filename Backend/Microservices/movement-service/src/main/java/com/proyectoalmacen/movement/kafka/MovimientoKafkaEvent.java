package com.proyectoalmacen.movement.kafka;

import java.time.LocalDateTime;

public record MovimientoKafkaEvent(
        String eventType,
        Long movimientoId,
        Long productoId,
        String tipo,
        Integer cantidad,
        Integer stockActual,
        String referencia,
        String estado,
        LocalDateTime fechaMovimiento
) {
}
