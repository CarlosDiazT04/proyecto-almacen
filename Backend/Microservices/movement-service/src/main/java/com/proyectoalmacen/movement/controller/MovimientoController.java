package com.proyectoalmacen.movement.controller;

import com.proyectoalmacen.movement.dto.MovimientoRequest;
import com.proyectoalmacen.movement.dto.MovimientoResponse;
import com.proyectoalmacen.movement.service.MovimientoService;
import jakarta.validation.Valid;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/movimientos")
public class MovimientoController {

    private final MovimientoService service;

    public MovimientoController(MovimientoService service) {
        this.service = service;
    }

    @GetMapping
    public List<MovimientoResponse> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    public MovimientoResponse obtener(@PathVariable Long id) {
        return service.obtener(id);
    }

    @PostMapping
    public ResponseEntity<MovimientoResponse> registrar(@Valid @RequestBody MovimientoRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.registrar(request));
    }
}
