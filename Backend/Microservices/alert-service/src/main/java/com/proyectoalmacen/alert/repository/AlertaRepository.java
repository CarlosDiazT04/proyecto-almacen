package com.proyectoalmacen.alert.repository;

import com.proyectoalmacen.alert.entity.Alerta;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AlertaRepository extends JpaRepository<Alerta, Long> {
    List<Alerta> findAllByOrderByFechaAlertaDesc();
    boolean existsByProductoIdAndTipoAndEstado(Long productoId, String tipo, String estado);
}
