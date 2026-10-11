package com.proyectoalmacen.inventory.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record InventarioRequest(
        @NotNull Long productoId,
        @NotNull @Min(0) Integer stockActual,
        @NotNull @Min(0) Integer stockReservado,
        @NotNull @Min(0) Integer stockMinimo,
        Boolean activo) {}
