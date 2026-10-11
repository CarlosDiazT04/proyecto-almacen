package com.proyectoalmacen.auth.controller;
import com.proyectoalmacen.auth.dto.*;
import com.proyectoalmacen.auth.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/auth")
public class AuthController {
    private final AuthService service; public AuthController(AuthService service){this.service=service;}
    @PostMapping("/login") public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest req){return ResponseEntity.ok(service.login(req));}
}
