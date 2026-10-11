package com.proyectoalmacen.movement.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record MovimientoRequest(
        @NotNull Long productoId,
        @NotBlank String tipo,
        @NotNull @Min(1) Integer cantidad,
        String motivo,
        String referencia,
        Long usuarioId
) {}
