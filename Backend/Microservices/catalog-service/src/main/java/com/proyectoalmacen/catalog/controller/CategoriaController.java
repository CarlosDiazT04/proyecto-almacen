package com.proyectoalmacen.catalog.controller;
import com.proyectoalmacen.catalog.dto.*;
import com.proyectoalmacen.catalog.service.CategoriaService;
import jakarta.validation.Valid;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController @RequestMapping("/api/categorias")
public class CategoriaController {
 private final CategoriaService service; public CategoriaController(CategoriaService service){this.service=service;}
 @GetMapping public List<CategoriaResponse> listar(){return service.listar();}
 @GetMapping("/{id}") public CategoriaResponse obtener(@PathVariable Long id){return service.obtener(id);}
 @PostMapping public ResponseEntity<CategoriaResponse> crear(@Valid @RequestBody CategoriaRequest r){return ResponseEntity.status(HttpStatus.CREATED).body(service.crear(r));}
 @PutMapping("/{id}") public CategoriaResponse actualizar(@PathVariable Long id,@Valid @RequestBody CategoriaRequest r){return service.actualizar(id,r);}
}
