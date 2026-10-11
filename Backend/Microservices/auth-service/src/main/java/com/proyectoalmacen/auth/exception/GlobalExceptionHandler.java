package com.proyectoalmacen.auth.exception;
import org.springframework.http.*;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import java.time.Instant; import java.util.Map;
@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(BadCredentialsException.class) ResponseEntity<?> badCredentials(){return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("timestamp",Instant.now().toString(),"status",401,"error","Unauthorized","message","Usuario o contraseña incorrectos"));}
    @ExceptionHandler(MethodArgumentNotValidException.class) ResponseEntity<?> validation(){return ResponseEntity.badRequest().body(Map.of("timestamp",Instant.now().toString(),"status",400,"error","Bad Request","message","Datos de autenticación inválidos"));}
}
