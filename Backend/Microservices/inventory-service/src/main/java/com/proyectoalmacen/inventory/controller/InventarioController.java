package com.proyectoalmacen.inventory.controller;

import com.proyectoalmacen.inventory.dto.*;
import com.proyectoalmacen.inventory.service.InventarioService;
import jakarta.validation.Valid;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventarios")
public class InventarioController {

    private final InventarioService service;

    public InventarioController(InventarioService service) {
        this.service = service;
    }

    @GetMapping
    public List<InventarioResponse> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    public InventarioResponse obtener(@PathVariable Long id) {
        return service.obtener(id);
    }

    @GetMapping("/producto/{productoId}")
    public InventarioResponse porProducto(@PathVariable Long productoId) {
        return service.obtenerPorProducto(productoId);
    }

    @PostMapping
    public ResponseEntity<InventarioResponse> crear(
            @Valid @RequestBody InventarioRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(service.crear(request));
    }

    @PutMapping("/{id}")
    public InventarioResponse actualizar(
            @PathVariable Long id,
            @Valid @RequestBody InventarioRequest request) {

        return service.actualizar(id, request);
    }

    @PatchMapping("/producto/{productoId}/ajustar")
    public InventarioResponse ajustar(
            @PathVariable Long productoId,
            @RequestParam int delta) {

        return service.ajustarStock(productoId, delta);
    }

    // ========================================================
    // ENTRADA DE STOCK
    // ========================================================

    @PutMapping("/producto/{productoId}/entrada")
    public InventarioResponse registrarEntrada(
            @PathVariable Long productoId,
            @RequestBody AjusteStockRequest request) {

        if (request.cantidad() == null || request.cantidad() <= 0) {
            throw new IllegalArgumentException(
                    "La cantidad de entrada debe ser mayor a cero"
            );
        }

        return service.ajustarStock(
                productoId,
                request.cantidad()
        );
    }

    // ========================================================
    // SALIDA DE STOCK
    // ========================================================

    @PutMapping("/producto/{productoId}/salida")
    public InventarioResponse registrarSalida(
            @PathVariable Long productoId,
            @RequestBody AjusteStockRequest request) {

        if (request.cantidad() == null || request.cantidad() <= 0) {
            throw new IllegalArgumentException(
                    "La cantidad de salida debe ser mayor a cero"
            );
        }

        return service.ajustarStock(
                productoId,
                -request.cantidad()
        );
    }
}