package com.proyectoalmacen.inventory.dto;

import java.math.BigDecimal;

public record ProductoCatalogoResponse(Long id, String sku, String nombre, String descripcion,
                                       BigDecimal precio, Long categoriaId, String categoria, Boolean activo) {}
