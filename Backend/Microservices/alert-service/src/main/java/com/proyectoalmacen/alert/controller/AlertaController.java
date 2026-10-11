package com.proyectoalmacen.alert.controller;

import com.proyectoalmacen.alert.dto.AlertaResponse;
import com.proyectoalmacen.alert.dto.AtenderAlertaRequest;
import com.proyectoalmacen.alert.service.AlertaService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alertas")
public class AlertaController {

    private final AlertaService service;

    public AlertaController(AlertaService service) {
        this.service = service;
    }

    @GetMapping
    public List<AlertaResponse> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    public AlertaResponse obtener(@PathVariable Long id) {
        return service.obtener(id);
    }

    @PostMapping("/detectar-stock-bajo")
    public List<AlertaResponse> detectarStockBajo() {
        return service.detectarStockBajo();
    }

    @PutMapping("/{id}/atender")
    public AlertaResponse atender(
            @PathVariable Long id,
            @Valid @RequestBody AtenderAlertaRequest request) {
        return service.atender(id, request);
    }
}
