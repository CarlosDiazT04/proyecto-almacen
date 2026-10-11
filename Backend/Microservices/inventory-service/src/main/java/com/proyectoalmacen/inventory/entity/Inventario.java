package com.proyectoalmacen.inventory.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "inventarios")
public class Inventario {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name="producto_id", nullable=false, unique=true) private Long productoId;
    @Column(name="stock_actual", nullable=false) private Integer stockActual;
    @Column(name="stock_reservado", nullable=false) private Integer stockReservado;
    @Column(name="stock_minimo", nullable=false) private Integer stockMinimo;
    @Column(nullable=false) private Boolean activo;
    @Column(name="created_at", insertable=false, updatable=false) private LocalDateTime createdAt;
    @Column(name="updated_at", insertable=false, updatable=false) private LocalDateTime updatedAt;

    public Long getId(){return id;} public void setId(Long id){this.id=id;}
    public Long getProductoId(){return productoId;} public void setProductoId(Long v){this.productoId=v;}
    public Integer getStockActual(){return stockActual;} public void setStockActual(Integer v){this.stockActual=v;}
    public Integer getStockReservado(){return stockReservado;} public void setStockReservado(Integer v){this.stockReservado=v;}
    public Integer getStockMinimo(){return stockMinimo;} public void setStockMinimo(Integer v){this.stockMinimo=v;}
    public Boolean getActivo(){return activo;} public void setActivo(Boolean v){this.activo=v;}
    public LocalDateTime getCreatedAt(){return createdAt;} public LocalDateTime getUpdatedAt(){return updatedAt;}
}
