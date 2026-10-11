package com.proyectoalmacen.catalog.repository;
import com.proyectoalmacen.catalog.entity.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;
public interface CategoriaRepository extends JpaRepository<Categoria, Long> { boolean existsByNombreIgnoreCase(String nombre); }
