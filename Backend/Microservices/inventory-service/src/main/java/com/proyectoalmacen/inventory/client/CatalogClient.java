package com.proyectoalmacen.inventory.client;

import com.proyectoalmacen.inventory.dto.ProductoCatalogoResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "catalog-service")
public interface CatalogClient {
    @GetMapping("/api/productos/{id}")
    ProductoCatalogoResponse obtenerProducto(@PathVariable("id") Long id);
}
