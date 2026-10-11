package com.proyectoalmacen.movement.service;

import com.proyectoalmacen.movement.client.InventoryClient;
import com.proyectoalmacen.movement.dto.AjusteStockRequest;
import com.proyectoalmacen.movement.dto.InventarioResponse;
import com.proyectoalmacen.movement.exception.InventoryUnavailableException;
import feign.FeignException;
import org.springframework.cloud.client.circuitbreaker.CircuitBreaker;
import org.springframework.cloud.client.circuitbreaker.CircuitBreakerFactory;
import org.springframework.stereotype.Service;

@Service
public class InventoryCircuitBreakerService {

    private static final String CIRCUIT_BREAKER_ID = "inventoryService";

    private final InventoryClient inventoryClient;
    private final CircuitBreakerFactory<?, ?> circuitBreakerFactory;

    public InventoryCircuitBreakerService(
            InventoryClient inventoryClient,
            CircuitBreakerFactory<?, ?> circuitBreakerFactory
    ) {
        this.inventoryClient = inventoryClient;
        this.circuitBreakerFactory = circuitBreakerFactory;
    }

    public InventarioResponse obtenerPorProducto(Long productoId) {
        CircuitBreaker circuitBreaker =
                circuitBreakerFactory.create(CIRCUIT_BREAKER_ID);

        return circuitBreaker.run(
                () -> inventoryClient.obtenerPorProducto(productoId),
                throwable -> fallback(
                        "consultar el inventario del producto " + productoId,
                        throwable
                )
        );
    }

    public InventarioResponse registrarEntrada(
            Long productoId,
            AjusteStockRequest request
    ) {
        CircuitBreaker circuitBreaker =
                circuitBreakerFactory.create(CIRCUIT_BREAKER_ID);

        return circuitBreaker.run(
                () -> inventoryClient.registrarEntrada(productoId, request),
                throwable -> fallback(
                        "registrar la entrada del producto " + productoId,
                        throwable
                )
        );
    }

    public InventarioResponse registrarSalida(
            Long productoId,
            AjusteStockRequest request
    ) {
        CircuitBreaker circuitBreaker =
                circuitBreakerFactory.create(CIRCUIT_BREAKER_ID);

        return circuitBreaker.run(
                () -> inventoryClient.registrarSalida(productoId, request),
                throwable -> fallback(
                        "registrar la salida del producto " + productoId,
                        throwable
                )
        );
    }

    private InventarioResponse fallback(
            String operacion,
            Throwable throwable
    ) {
        Throwable cause = unwrap(throwable);

        // Conserva el 404 funcional cuando Inventory responde que no existe.
        if (cause instanceof FeignException.NotFound notFound) {
            throw notFound;
        }

        throw new InventoryUnavailableException(
                "inventory-service no esta disponible para " + operacion,
                cause
        );
    }

    private Throwable unwrap(Throwable throwable) {
        Throwable current = throwable;

        while (current.getCause() != null
                && current.getCause() != current) {
            current = current.getCause();
        }

        return current;
    }
}
