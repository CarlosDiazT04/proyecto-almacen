package com.proyectoalmacen.movement.messaging;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class MovimientoEventPublisher {

    private final RabbitTemplate rabbitTemplate;

    @Value("${app.rabbitmq.exchange}")
    private String exchange;

    @Value("${app.rabbitmq.movement.routing-key}")
    private String routingKey;

    public MovimientoEventPublisher(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    public void publicar(MovimientoEvent event) {
        rabbitTemplate.convertAndSend(
                exchange,
                routingKey,
                event
        );
    }
}