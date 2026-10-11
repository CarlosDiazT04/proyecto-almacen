package com.proyectoalmacen.inventory.exception;

import org.springframework.http.*;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import java.time.OffsetDateTime;
import java.util.*;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(ResourceNotFoundException.class)
    ResponseEntity<Map<String,Object>> notFound(ResourceNotFoundException e){return body(HttpStatus.NOT_FOUND,e.getMessage());}
    @ExceptionHandler(IllegalArgumentException.class)
    ResponseEntity<Map<String,Object>> bad(IllegalArgumentException e){return body(HttpStatus.BAD_REQUEST,e.getMessage());}
    @ExceptionHandler(MethodArgumentNotValidException.class)
    ResponseEntity<Map<String,Object>> validation(MethodArgumentNotValidException e){
        String msg=e.getBindingResult().getFieldErrors().stream().findFirst().map(x->x.getField()+": "+x.getDefaultMessage()).orElse("Datos invalidos");
        return body(HttpStatus.BAD_REQUEST,msg);
    }
    private ResponseEntity<Map<String,Object>> body(HttpStatus s,String m){
        Map<String,Object> b=new LinkedHashMap<>(); b.put("timestamp", OffsetDateTime.now()); b.put("status",s.value()); b.put("error",s.getReasonPhrase()); b.put("message",m); return ResponseEntity.status(s).body(b);
    }
}
