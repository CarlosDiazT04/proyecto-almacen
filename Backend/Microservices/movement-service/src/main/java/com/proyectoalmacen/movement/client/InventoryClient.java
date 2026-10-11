package com.proyectoalmacen.movement.client;

import com.proyectoalmacen.movement.dto.AjusteStockRequest;
import com.proyectoalmacen.movement.dto.InventarioResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

@FeignClient(name = "inventory-service")
public interface InventoryClient {

    @GetMapping("/api/inventarios/producto/{productoId}")
    InventarioResponse obtenerPorProducto(@PathVariable("productoId") Long productoId);

    @PutMapping("/api/inventarios/producto/{productoId}/entrada")
    InventarioResponse registrarEntrada(@PathVariable("productoId") Long productoId,
                                        @RequestBody AjusteStockRequest request);

    @PutMapping("/api/inventarios/producto/{productoId}/salida")
    InventarioResponse registrarSalida(@PathVariable("productoId") Long productoId,
                                       @RequestBody AjusteStockRequest request);
}
