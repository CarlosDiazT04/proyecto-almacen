package com.proyectoalmacen.auth.service;
import com.proyectoalmacen.auth.dto.*;
import com.proyectoalmacen.auth.entity.Usuario;
import com.proyectoalmacen.auth.repository.UsuarioRepository;
import com.proyectoalmacen.auth.security.JwtService;
import org.springframework.security.authentication.*;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import java.util.*;
@Service
public class AuthService {
    private final AuthenticationManager authManager; private final UsuarioRepository usuarios; private final JwtService jwt;
    public AuthService(AuthenticationManager authManager,UsuarioRepository usuarios,JwtService jwt){this.authManager=authManager;this.usuarios=usuarios;this.jwt=jwt;}
    public LoginResponse login(LoginRequest req){
        authManager.authenticate(new UsernamePasswordAuthenticationToken(req.username(),req.password()));
        Usuario u=usuarios.findByUsername(req.username()).orElseThrow();
        UserDetails ud=org.springframework.security.core.userdetails.User.withUsername(u.getUsername()).password(u.getPassword())
                .authorities(u.getRoles().stream().map(r->"ROLE_"+r.getNombre()).toArray(String[]::new)).build();
        Set<String> roles=new TreeSet<>(); u.getRoles().forEach(r->roles.add(r.getNombre()));
        String token=jwt.generateToken(ud,Map.of("roles",roles,"name",u.getNombre()));
        return new LoginResponse(token,"Bearer",u.getUsername(),u.getNombre(),roles);
    }
}
