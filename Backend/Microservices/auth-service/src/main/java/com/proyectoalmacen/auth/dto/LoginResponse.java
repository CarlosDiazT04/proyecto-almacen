package com.proyectoalmacen.auth.dto;
import java.util.Set;
public record LoginResponse(String token, String tipo, String username, String nombre, Set<String> roles) {}
