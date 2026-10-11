package com.proyectoalmacen.alert.dto;

import jakarta.validation.constraints.NotNull;

public record AtenderAlertaRequest(
        @NotNull Long usuarioId
) {}
