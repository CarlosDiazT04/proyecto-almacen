package com.proyectoalmacen.inventory.dto;

public record InventarioResponse(Long id, Long productoId, String sku, String producto,
                                 Integer stockActual, Integer stockReservado, Integer stockDisponible,
                                 Integer stockMinimo, Boolean activo, Boolean stockBajo) {}
