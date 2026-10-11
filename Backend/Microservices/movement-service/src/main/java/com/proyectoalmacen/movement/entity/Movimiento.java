package com.proyectoalmacen.movement.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "movimientos")
public class Movimiento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "producto_id", nullable = false)
    private Long productoId;

    @Column(nullable = false, length = 30)
    private String tipo;

    @Column(nullable = false)
    private Integer cantidad;

    @Column(length = 255)
    private String motivo;

    @Column(length = 100)
    private String referencia;

    @Column(name = "usuario_id")
    private Long usuarioId;

    @Column(nullable = false, length = 20)
    private String estado = "PENDIENTE";

    @Column(name = "fecha_movimiento", nullable = false)
    private LocalDateTime fechaMovimiento;

    @Column(name = "created_at", nullable = false, insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    void prePersist() {
        if (fechaMovimiento == null) fechaMovimiento = LocalDateTime.now();
        if (estado == null || estado.isBlank()) estado = "PENDIENTE";
    }

    public Long getId() { return id; }
    public Long getProductoId() { return productoId; }
    public void setProductoId(Long productoId) { this.productoId = productoId; }
    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }
    public Integer getCantidad() { return cantidad; }
    public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }
    public String getMotivo() { return motivo; }
    public void setMotivo(String motivo) { this.motivo = motivo; }
    public String getReferencia() { return referencia; }
    public void setReferencia(String referencia) { this.referencia = referencia; }
    public Long getUsuarioId() { return usuarioId; }
    public void setUsuarioId(Long usuarioId) { this.usuarioId = usuarioId; }
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
    public LocalDateTime getFechaMovimiento() { return fechaMovimiento; }
    public void setFechaMovimiento(LocalDateTime fechaMovimiento) { this.fechaMovimiento = fechaMovimiento; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
