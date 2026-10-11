package com.proyectoalmacen.movement.exception;

import feign.FeignException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<?> notFound(ResourceNotFoundException ex) {
        return response(
                HttpStatus.NOT_FOUND,
                ex.getMessage()
        );
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<?> badRequest(IllegalArgumentException ex) {
        return response(
                HttpStatus.BAD_REQUEST,
                ex.getMessage()
        );
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> validation(
            MethodArgumentNotValidException ex
    ) {

        String message = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .findFirst()
                .map(e ->
                        e.getField()
                                + ": "
                                + e.getDefaultMessage()
                )
                .orElse("Solicitud invalida");

        return response(
                HttpStatus.BAD_REQUEST,
                message
        );
    }

    @ExceptionHandler(FeignException.NotFound.class)
    public ResponseEntity<?> feignNotFound(
            FeignException.NotFound ex
    ) {

        return response(
                HttpStatus.NOT_FOUND,
                "Producto o inventario no encontrado"
        );
    }

    @ExceptionHandler(InventoryUnavailableException.class)
    public ResponseEntity<?> inventoryUnavailable(
            InventoryUnavailableException ex
    ) {

        return response(
                HttpStatus.SERVICE_UNAVAILABLE,
                ex.getMessage()
        );
    }

    @ExceptionHandler(FeignException.class)
    public ResponseEntity<?> feign(
            FeignException ex
    ) {

        return response(
                HttpStatus.BAD_GATEWAY,
                "No fue posible comunicarse con inventory-service"
        );
    }

    private ResponseEntity<Map<String, Object>> response(
            HttpStatus status,
            String message
    ) {

        Map<String, Object> body =
                new LinkedHashMap<>();

        body.put(
                "timestamp",
                LocalDateTime.now()
        );

        body.put(
                "status",
                status.value()
        );

        body.put(
                "error",
                status.getReasonPhrase()
        );

        body.put(
                "message",
                message
        );

        return ResponseEntity
                .status(status)
                .body(body);
    }
}
