package com.proyectoalmacen.alert.service;

import com.proyectoalmacen.alert.client.InventoryClient;
import com.proyectoalmacen.alert.dto.AlertaResponse;
import com.proyectoalmacen.alert.dto.AtenderAlertaRequest;
import com.proyectoalmacen.alert.dto.InventarioResponse;
import com.proyectoalmacen.alert.entity.Alerta;
import com.proyectoalmacen.alert.exception.ResourceNotFoundException;
import com.proyectoalmacen.alert.repository.AlertaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AlertaService {

    private static final String TIPO_STOCK_BAJO = "STOCK_BAJO";
    private static final String ESTADO_PENDIENTE = "PENDIENTE";

    private final AlertaRepository repository;
    private final InventoryClient inventoryClient;

    public AlertaService(
            AlertaRepository repository,
            InventoryClient inventoryClient
    ) {
        this.repository = repository;
        this.inventoryClient = inventoryClient;
    }

    public List<AlertaResponse> listar() {
        return repository.findAllByOrderByFechaAlertaDesc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public AlertaResponse obtener(Long id) {
        Alerta alerta = repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Alerta no encontrada: " + id
                        )
                );

        return toResponse(alerta);
    }

    @Transactional
    public List<AlertaResponse> detectarStockBajo() {

        List<InventarioResponse> inventarios =
                inventoryClient.listarInventarios();

        for (InventarioResponse inventario : inventarios) {
            procesarInventario(inventario);
        }

        return listar();
    }

    @Transactional
    public void detectarStockBajoPorProducto(Long productoId) {

        InventarioResponse inventario =
                inventoryClient.listarInventarios()
                        .stream()
                        .filter(i ->
                                i.productoId().equals(productoId)
                        )
                        .findFirst()
                        .orElse(null);

        if (inventario != null) {
            procesarInventario(inventario);
        }
    }

    private void procesarInventario(
            InventarioResponse inventario
    ) {

        if (!Boolean.TRUE.equals(inventario.activo())) {
            return;
        }

        boolean stockBajo =
                inventario.stockActual() != null
                        && inventario.stockMinimo() != null
                        && inventario.stockActual()
                        <= inventario.stockMinimo();

        if (!stockBajo) {
            return;
        }

        boolean existePendiente =
                repository.existsByProductoIdAndTipoAndEstado(
                        inventario.productoId(),
                        TIPO_STOCK_BAJO,
                        ESTADO_PENDIENTE
                );

        if (existePendiente) {
            return;
        }

        Alerta alerta = new Alerta();

        alerta.setProductoId(
                inventario.productoId()
        );

        alerta.setTipo(
                TIPO_STOCK_BAJO
        );

        alerta.setMensaje(
                "Stock bajo para "
                        + inventario.producto()
                        + " ("
                        + inventario.sku()
                        + "). Stock actual: "
                        + inventario.stockActual()
                        + ", minimo: "
                        + inventario.stockMinimo()
        );

        alerta.setStockActual(
                inventario.stockActual()
        );

        alerta.setStockMinimo(
                inventario.stockMinimo()
        );

        alerta.setEstado(
                ESTADO_PENDIENTE
        );

        repository.save(alerta);
    }

    @Transactional
    public AlertaResponse atender(
            Long id,
            AtenderAlertaRequest request
    ) {

        Alerta alerta = repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Alerta no encontrada: " + id
                        )
                );

        alerta.setEstado("ATENDIDA");

        alerta.setFechaAtencion(
                LocalDateTime.now()
        );

        alerta.setAtendidaPor(
                request.usuarioId()
        );

        return toResponse(
                repository.save(alerta)
        );
    }

    private AlertaResponse toResponse(
            Alerta alerta
    ) {

        String sku = null;
        String producto = null;

        try {

            InventarioResponse inventario =
                    inventoryClient.listarInventarios()
                            .stream()
                            .filter(i ->
                                    i.productoId()
                                            .equals(
                                                    alerta.getProductoId()
                                            )
                            )
                            .findFirst()
                            .orElse(null);

            if (inventario != null) {
                sku = inventario.sku();
                producto = inventario.producto();
            }

        } catch (RuntimeException ignored) {

            /*
             * La alerta historica sigue siendo consultable
             * aunque Inventory Service no responda.
             */
        }

        return new AlertaResponse(
                alerta.getId(),
                alerta.getProductoId(),
                sku,
                producto,
                alerta.getTipo(),
                alerta.getMensaje(),
                alerta.getStockActual(),
                alerta.getStockMinimo(),
                alerta.getEstado(),
                alerta.getFechaAlerta(),
                alerta.getFechaAtencion(),
                alerta.getAtendidaPor()
        );
    }
}