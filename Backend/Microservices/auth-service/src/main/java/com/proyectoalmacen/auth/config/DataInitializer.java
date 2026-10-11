package com.proyectoalmacen.auth.config;
import com.proyectoalmacen.auth.entity.*;
import com.proyectoalmacen.auth.repository.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.util.Set;
@Component
public class DataInitializer implements CommandLineRunner {
    private final UsuarioRepository usuarios; private final RolRepository roles; private final PasswordEncoder encoder;
    @Value("${app.admin.username}") private String username;
    @Value("${app.admin.password}") private String password;
    @Value("${app.admin.name}") private String name;
    @Value("${app.admin.email}") private String email;
    public DataInitializer(UsuarioRepository usuarios,RolRepository roles,PasswordEncoder encoder){this.usuarios=usuarios;this.roles=roles;this.encoder=encoder;}
    @Override public void run(String... args){
        if(password==null || password.isBlank() || usuarios.existsByUsername(username)) return;
        Rol admin=roles.findByNombre("ADMIN").orElseThrow(() -> new IllegalStateException("No existe el rol ADMIN en almacen_auth.roles"));
        Usuario u=new Usuario(); u.setUsername(username);u.setPassword(encoder.encode(password));u.setNombre(name);u.setEmail(email);u.setActivo(true);u.setRoles(Set.of(admin));usuarios.save(u);
    }
}
