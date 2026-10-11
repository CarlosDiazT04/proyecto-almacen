package com.proyectoalmacen.catalog.dto;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
public record ProductoRequest(@NotBlank @Size(max=50) String sku, @NotBlank @Size(max=150) String nombre, @Size(max=500) String descripcion, @NotNull @DecimalMin(value="0.0", inclusive=true) BigDecimal precio, @NotNull Long categoriaId, Boolean activo) {}
