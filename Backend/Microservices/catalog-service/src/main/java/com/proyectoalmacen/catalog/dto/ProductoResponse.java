package com.proyectoalmacen.catalog.dto;
import java.math.BigDecimal;
public record ProductoResponse(Long id, String sku, String nombre, String descripcion, BigDecimal precio, Long categoriaId, String categoria, Boolean activo) {}
