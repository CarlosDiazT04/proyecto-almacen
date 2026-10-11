package com.proyectoalmacen.alert.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "alertas")
public class Alerta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "producto_id", nullable = false)
    private Long productoId;

    @Column(nullable = false, length = 30)
    private String tipo;

    @Column(nullable = false, length = 255)
    private String mensaje;

    @Column(name = "stock_actual")
    private Integer stockActual;

    @Column(name = "stock_minimo")
    private Integer stockMinimo;

    @Column(nullable = false, length = 20)
    private String estado = "PENDIENTE";

    @Column(name = "fecha_alerta", nullable = false)
    private LocalDateTime fechaAlerta;

    @Column(name = "fecha_atencion")
    private LocalDateTime fechaAtencion;

    @Column(name = "atendida_por")
    private Long atendidaPor;

    @Column(name = "created_at", nullable = false, insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", insertable = false, updatable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    void prePersist() {
        if (fechaAlerta == null) fechaAlerta = LocalDateTime.now();
        if (estado == null || estado.isBlank()) estado = "PENDIENTE";
    }

    public Long getId() { return id; }
    public Long getProductoId() { return productoId; }
    public void setProductoId(Long productoId) { this.productoId = productoId; }
    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }
    public String getMensaje() { return mensaje; }
    public void setMensaje(String mensaje) { this.mensaje = mensaje; }
    public Integer getStockActual() { return stockActual; }
    public void setStockActual(Integer stockActual) { this.stockActual = stockActual; }
    public Integer getStockMinimo() { return stockMinimo; }
    public void setStockMinimo(Integer stockMinimo) { this.stockMinimo = stockMinimo; }
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
    public LocalDateTime getFechaAlerta() { return fechaAlerta; }
    public void setFechaAlerta(LocalDateTime fechaAlerta) { this.fechaAlerta = fechaAlerta; }
    public LocalDateTime getFechaAtencion() { return fechaAtencion; }
    public void setFechaAtencion(LocalDateTime fechaAtencion) { this.fechaAtencion = fechaAtencion; }
    public Long getAtendidaPor() { return atendidaPor; }
    public void setAtendidaPor(Long atendidaPor) { this.atendidaPor = atendidaPor; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
