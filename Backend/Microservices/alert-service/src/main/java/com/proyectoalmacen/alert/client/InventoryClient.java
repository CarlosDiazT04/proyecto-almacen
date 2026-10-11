package com.proyectoalmacen.alert.client;

import com.proyectoalmacen.alert.dto.InventarioResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@FeignClient(name = "inventory-service")
public interface InventoryClient {

    @GetMapping("/api/inventarios")
    List<InventarioResponse> listarInventarios();
}
