package com.proyectoalmacen.movement.service;

import com.proyectoalmacen.movement.dto.AjusteStockRequest;
import com.proyectoalmacen.movement.dto.InventarioResponse;
import com.proyectoalmacen.movement.dto.MovimientoRequest;
import com.proyectoalmacen.movement.dto.MovimientoResponse;
import com.proyectoalmacen.movement.entity.Movimiento;
import com.proyectoalmacen.movement.exception.ResourceNotFoundException;
import com.proyectoalmacen.movement.kafka.MovimientoKafkaEvent;
import com.proyectoalmacen.movement.kafka.MovimientoKafkaPublisher;
import com.proyectoalmacen.movement.messaging.MovimientoEvent;
import com.proyectoalmacen.movement.messaging.MovimientoEventPublisher;
import com.proyectoalmacen.movement.repository.MovimientoRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Locale;

@Service
public class MovimientoService {

    private static final Logger log =
            LoggerFactory.getLogger(MovimientoService.class);

    private final MovimientoRepository repository;
    private final InventoryCircuitBreakerService inventoryService;
    private final MovimientoEventPublisher rabbitPublisher;
    private final MovimientoKafkaPublisher kafkaPublisher;

    public MovimientoService(
            MovimientoRepository repository,
            InventoryCircuitBreakerService inventoryService,
            MovimientoEventPublisher rabbitPublisher,
            MovimientoKafkaPublisher kafkaPublisher
    ) {
        this.repository = repository;
        this.inventoryService = inventoryService;
        this.rabbitPublisher = rabbitPublisher;
        this.kafkaPublisher = kafkaPublisher;
    }

    public List<MovimientoResponse> listar() {
        return repository.findAllByOrderByFechaMovimientoDesc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public MovimientoResponse obtener(Long id) {
        Movimiento movimiento = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Movimiento no encontrado: " + id
                ));

        return toResponse(movimiento);
    }

    @Transactional
    public MovimientoResponse registrar(MovimientoRequest request) {

        String tipo = request.tipo()
                .trim()
                .toUpperCase(Locale.ROOT);

        if (!tipo.equals("ENTRADA") && !tipo.equals("SALIDA")) {
            throw new IllegalArgumentException(
                    "tipo debe ser ENTRADA o SALIDA"
            );
        }

        // La consulta a Inventory ya pasa por Circuit Breaker.
        inventoryService.obtenerPorProducto(request.productoId());

        Movimiento movimiento = new Movimiento();
        movimiento.setProductoId(request.productoId());
        movimiento.setTipo(tipo);
        movimiento.setCantidad(request.cantidad());
        movimiento.setMotivo(request.motivo());
        movimiento.setReferencia(request.referencia());
        movimiento.setUsuarioId(request.usuarioId());
        movimiento.setEstado("PENDIENTE");

        movimiento = repository.save(movimiento);

        InventarioResponse inventarioActualizado;

        try {

            if (tipo.equals("ENTRADA")) {

                inventarioActualizado =
                        inventoryService.registrarEntrada(
                                request.productoId(),
                                new AjusteStockRequest(
                                        request.cantidad()
                                )
                        );

            } else {

                inventarioActualizado =
                        inventoryService.registrarSalida(
                                request.productoId(),
                                new AjusteStockRequest(
                                        request.cantidad()
                                )
                        );
            }

            movimiento.setEstado("PROCESADO");
            movimiento = repository.save(movimiento);

        } catch (RuntimeException ex) {

            movimiento.setEstado("ERROR");
            repository.save(movimiento);

            throw ex;
        }

        MovimientoEvent rabbitEvent = new MovimientoEvent(
                movimiento.getId(),
                movimiento.getProductoId(),
                movimiento.getTipo(),
                movimiento.getCantidad(),
                movimiento.getReferencia(),
                movimiento.getEstado(),
                movimiento.getFechaMovimiento()
        );

        try {

            rabbitPublisher.publicar(rabbitEvent);

        } catch (RuntimeException ex) {

            log.error(
                    "Movimiento {} procesado, pero fallo la publicacion RabbitMQ",
                    movimiento.getId(),
                    ex
            );
        }

        MovimientoKafkaEvent kafkaEvent =
                new MovimientoKafkaEvent(
                        "MOVEMENT_PROCESSED",
                        movimiento.getId(),
                        movimiento.getProductoId(),
                        movimiento.getTipo(),
                        movimiento.getCantidad(),
                        inventarioActualizado.stockActual(),
                        movimiento.getReferencia(),
                        movimiento.getEstado(),
                        movimiento.getFechaMovimiento()
                );

        try {

            kafkaPublisher.publicar(kafkaEvent);

        } catch (RuntimeException ex) {

            log.error(
                    "Movimiento {} procesado, pero fallo la publicacion Kafka",
                    movimiento.getId(),
                    ex
            );
        }

        return toResponse(movimiento);
    }

    private MovimientoResponse toResponse(
            Movimiento movimiento
    ) {

        String sku = null;
        String producto = null;

        try {

            InventarioResponse inventario =
                    inventoryService.obtenerPorProducto(
                            movimiento.getProductoId()
                    );

            sku = inventario.sku();
            producto = inventario.producto();

        } catch (RuntimeException ignored) {

            /*
             * El historico sigue siendo consultable aunque
             * Inventory Service este caido o el Circuit Breaker
             * se encuentre abierto.
             */
        }

        return new MovimientoResponse(
                movimiento.getId(),
                movimiento.getProductoId(),
                sku,
                producto,
                movimiento.getTipo(),
                movimiento.getCantidad(),
                movimiento.getMotivo(),
                movimiento.getReferencia(),
                movimiento.getUsuarioId(),
                movimiento.getEstado(),
                movimiento.getFechaMovimiento()
        );
    }
}
