package com.proyectoalmacen.catalog.controller;
import com.proyectoalmacen.catalog.dto.*;
import com.proyectoalmacen.catalog.service.ProductoService;
import jakarta.validation.Valid;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController @RequestMapping("/api/productos")
public class ProductoController {
 private final ProductoService service; public ProductoController(ProductoService service){this.service=service;}
 @GetMapping public List<ProductoResponse> listar(){return service.listar();}
 @GetMapping("/{id}") public ProductoResponse obtener(@PathVariable Long id){return service.obtener(id);}
 @PostMapping public ResponseEntity<ProductoResponse> crear(@Valid @RequestBody ProductoRequest r){return ResponseEntity.status(HttpStatus.CREATED).body(service.crear(r));}
 @PutMapping("/{id}") public ProductoResponse actualizar(@PathVariable Long id,@Valid @RequestBody ProductoRequest r){return service.actualizar(id,r);}
}
