package com.proyectoalmacen.movement.repository;

import com.proyectoalmacen.movement.entity.Movimiento;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MovimientoRepository extends JpaRepository<Movimiento, Long> {
    List<Movimiento> findAllByOrderByFechaMovimientoDesc();
}
