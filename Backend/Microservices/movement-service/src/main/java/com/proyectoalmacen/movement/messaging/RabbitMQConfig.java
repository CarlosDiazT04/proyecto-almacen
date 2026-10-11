package com.proyectoalmacen.movement.messaging;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Declarables;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.QueueBuilder;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    @Value("${app.rabbitmq.exchange}")
    private String exchangeName;

    @Value("${app.rabbitmq.movement.queue}")
    private String queueName;

    @Value("${app.rabbitmq.movement.routing-key}")
    private String routingKey;

    @Bean
    public Declarables movementRabbitDeclarables() {

        TopicExchange exchange =
                new TopicExchange(exchangeName, true, false);

        Queue queue =
                QueueBuilder
                        .durable(queueName)
                        .build();

        Binding binding =
                BindingBuilder
                        .bind(queue)
                        .to(exchange)
                        .with(routingKey);

        return new Declarables(
                exchange,
                queue,
                binding
        );
    }

    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }
}