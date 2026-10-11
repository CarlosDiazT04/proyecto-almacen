package com.proyectoalmacen.movement.kafka;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class MovimientoKafkaPublisher {

    private static final Logger log =
            LoggerFactory.getLogger(MovimientoKafkaPublisher.class);

    private final KafkaTemplate<String, MovimientoKafkaEvent> kafkaTemplate;
    private final String topic;

    public MovimientoKafkaPublisher(
            KafkaTemplate<String, MovimientoKafkaEvent> kafkaTemplate,
            @Value("${app.kafka.topic.inventory-events}") String topic
    ) {
        this.kafkaTemplate = kafkaTemplate;
        this.topic = topic;
    }

    public void publicar(MovimientoKafkaEvent event) {
        kafkaTemplate
                .send(topic, String.valueOf(event.productoId()), event)
                .whenComplete((result, ex) -> {
                    if (ex != null) {
                        log.error(
                                "No se pudo publicar evento Kafka del movimiento {}",
                                event.movimientoId(),
                                ex
                        );
                    } else {
                        log.info(
                                "Evento Kafka publicado. topic={}, movimientoId={}, offset={}",
                                topic,
                                event.movimientoId(),
                                result.getRecordMetadata().offset()
                        );
                    }
                });
    }
}
