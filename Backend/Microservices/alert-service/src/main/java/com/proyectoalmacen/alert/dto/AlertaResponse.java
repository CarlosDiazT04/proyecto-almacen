package com.proyectoalmacen.alert.dto;

import java.time.LocalDateTime;

public record AlertaResponse(
        Long id,
        Long productoId,
        String sku,
        String producto,
        String tipo,
        String mensaje,
        Integer stockActual,
        Integer stockMinimo,
        String estado,
        LocalDateTime fechaAlerta,
        LocalDateTime fechaAtencion,
        Long atendidaPor
) {}
