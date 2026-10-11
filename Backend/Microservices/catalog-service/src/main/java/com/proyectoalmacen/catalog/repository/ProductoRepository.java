package com.proyectoalmacen.catalog.repository;
import com.proyectoalmacen.catalog.entity.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
public interface ProductoRepository extends JpaRepository<Producto, Long> { boolean existsBySkuIgnoreCase(String sku); }
