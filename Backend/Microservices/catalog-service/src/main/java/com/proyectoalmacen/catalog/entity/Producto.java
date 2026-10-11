package com.proyectoalmacen.catalog.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "productos")
public class Producto {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, unique = true, length = 50)
    private String sku;
    @Column(nullable = false, length = 150)
    private String nombre;
    @Column(length = 500)
    private String descripcion;
    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal precio;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "categoria_id", nullable = false)
    private Categoria categoria;
    @Column(nullable = false)
    private Boolean activo = true;
    @Column(name = "created_at", nullable = false, insertable = false, updatable = false)
    private LocalDateTime createdAt;
    @Column(name = "updated_at", nullable = false, insertable = false, updatable = false)
    private LocalDateTime updatedAt;

    public Long getId(){return id;} public void setId(Long id){this.id=id;}
    public String getSku(){return sku;} public void setSku(String sku){this.sku=sku;}
    public String getNombre(){return nombre;} public void setNombre(String nombre){this.nombre=nombre;}
    public String getDescripcion(){return descripcion;} public void setDescripcion(String descripcion){this.descripcion=descripcion;}
    public BigDecimal getPrecio(){return precio;} public void setPrecio(BigDecimal precio){this.precio=precio;}
    public Categoria getCategoria(){return categoria;} public void setCategoria(Categoria categoria){this.categoria=categoria;}
    public Boolean getActivo(){return activo;} public void setActivo(Boolean activo){this.activo=activo;}
    public LocalDateTime getCreatedAt(){return createdAt;} public LocalDateTime getUpdatedAt(){return updatedAt;}
}
