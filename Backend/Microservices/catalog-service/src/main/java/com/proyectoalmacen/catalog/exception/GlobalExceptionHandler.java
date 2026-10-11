package com.proyectoalmacen.catalog.exception;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.*;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.*;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String,Object>> notFound(ResourceNotFoundException ex){return body(HttpStatus.NOT_FOUND, ex.getMessage());}
    @ExceptionHandler({IllegalArgumentException.class, DataIntegrityViolationException.class})
    public ResponseEntity<Map<String,Object>> badRequest(Exception ex){return body(HttpStatus.BAD_REQUEST, ex.getMessage());}
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String,Object>> validation(MethodArgumentNotValidException ex){
        Map<String,String> errors=new LinkedHashMap<>(); ex.getBindingResult().getFieldErrors().forEach(e->errors.put(e.getField(),e.getDefaultMessage()));
        Map<String,Object> m=new LinkedHashMap<>(); m.put("timestamp",LocalDateTime.now());m.put("status",400);m.put("error","Bad Request");m.put("message","Datos inválidos");m.put("fields",errors);return ResponseEntity.badRequest().body(m);
    }
    private ResponseEntity<Map<String,Object>> body(HttpStatus s,String msg){Map<String,Object> m=new LinkedHashMap<>();m.put("timestamp",LocalDateTime.now());m.put("status",s.value());m.put("error",s.getReasonPhrase());m.put("message",msg);return ResponseEntity.status(s).body(m);}
}
