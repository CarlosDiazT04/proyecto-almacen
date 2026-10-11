package com.proyectoalmacen.alert.messaging;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.proyectoalmacen.alert.service.AlertaService;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
public class MovimientoEventConsumer {

    private final ObjectMapper objectMapper;
    private final AlertaService alertaService;

    public MovimientoEventConsumer(
            ObjectMapper objectMapper,
            AlertaService alertaService
    ) {
        this.objectMapper = objectMapper;
        this.alertaService = alertaService;
    }

    @RabbitListener(
            queues = "${app.rabbitmq.movement.queue}"
    )
    public void consumir(Message message) {

        try {

            String json =
                    new String(message.getBody());

            MovimientoEvent event =
                    objectMapper.readValue(
                            json,
                            MovimientoEvent.class
                    );

            System.out.println(
                    "RabbitMQ - Movimiento recibido: "
                            + event
            );

            if (!"PROCESADO".equalsIgnoreCase(
                    event.estado()
            )) {
                return;
            }

            if (!"SALIDA".equalsIgnoreCase(
                    event.tipo()
            )) {
                System.out.println(
                        "RabbitMQ - Movimiento ignorado. "
                                + "No corresponde a una SALIDA."
                );

                return;
            }

            alertaService
                    .detectarStockBajoPorProducto(
                            event.productoId()
                    );

        } catch (Exception ex) {

            throw new RuntimeException(
                    "Error procesando mensaje RabbitMQ",
                    ex
            );
        }
    }
}