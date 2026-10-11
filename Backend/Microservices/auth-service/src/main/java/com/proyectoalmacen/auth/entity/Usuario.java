package com.proyectoalmacen.auth.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "usuarios")
public class Usuario {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable=false, unique=true, length=50) private String username;
    @Column(nullable=false, length=100) private String password;
    @Column(nullable=false, length=150) private String nombre;
    @Column(nullable=false, unique=true, length=150) private String email;
    @Column(nullable=false) private Boolean activo = true;
    @Column(name="created_at", insertable=false, updatable=false) private LocalDateTime createdAt;
    @Column(name="updated_at", insertable=false, updatable=false) private LocalDateTime updatedAt;
    @ManyToMany(fetch=FetchType.EAGER)
    @JoinTable(name="usuario_roles", joinColumns=@JoinColumn(name="usuario_id"), inverseJoinColumns=@JoinColumn(name="rol_id"))
    private Set<Rol> roles = new HashSet<>();
    public Long getId(){return id;} public void setId(Long id){this.id=id;}
    public String getUsername(){return username;} public void setUsername(String username){this.username=username;}
    public String getPassword(){return password;} public void setPassword(String password){this.password=password;}
    public String getNombre(){return nombre;} public void setNombre(String nombre){this.nombre=nombre;}
    public String getEmail(){return email;} public void setEmail(String email){this.email=email;}
    public Boolean getActivo(){return activo;} public void setActivo(Boolean activo){this.activo=activo;}
    public LocalDateTime getCreatedAt(){return createdAt;} public LocalDateTime getUpdatedAt(){return updatedAt;}
    public Set<Rol> getRoles(){return roles;} public void setRoles(Set<Rol> roles){this.roles=roles;}
}
