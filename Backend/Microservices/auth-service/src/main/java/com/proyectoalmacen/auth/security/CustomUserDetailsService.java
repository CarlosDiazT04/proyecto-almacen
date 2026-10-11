package com.proyectoalmacen.auth.security;
import com.proyectoalmacen.auth.entity.Usuario;
import com.proyectoalmacen.auth.repository.UsuarioRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;
@Service
public class CustomUserDetailsService implements UserDetailsService {
    private final UsuarioRepository repo;
    public CustomUserDetailsService(UsuarioRepository repo){this.repo=repo;}
    @Override public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Usuario u=repo.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));
        return User.withUsername(u.getUsername()).password(u.getPassword()).disabled(!Boolean.TRUE.equals(u.getActivo()))
                .authorities(u.getRoles().stream().map(r -> new SimpleGrantedAuthority("ROLE_"+r.getNombre())).toList()).build();
    }
}
