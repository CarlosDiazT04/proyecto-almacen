package com.proyectoalmacen.auth.security;
import org.springframework.context.annotation.*;
import org.springframework.security.authentication.*;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
@Configuration @EnableMethodSecurity
public class SecurityConfig {
    private final JwtAuthenticationFilter jwtFilter; private final CustomUserDetailsService users;
    public SecurityConfig(JwtAuthenticationFilter jwtFilter,CustomUserDetailsService users){this.jwtFilter=jwtFilter;this.users=users;}
    @Bean PasswordEncoder passwordEncoder(){return new BCryptPasswordEncoder();}
    @Bean DaoAuthenticationProvider authenticationProvider(){var p=new DaoAuthenticationProvider();p.setUserDetailsService(users);p.setPasswordEncoder(passwordEncoder());return p;}
    @Bean AuthenticationManager authenticationManager(AuthenticationConfiguration c) throws Exception{return c.getAuthenticationManager();}
    @Bean SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf->csrf.disable()).sessionManagement(s->s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(a->a.requestMatchers("/api/auth/login","/actuator/health","/actuator/info").permitAll().anyRequest().authenticated())
            .authenticationProvider(authenticationProvider()).addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
}
