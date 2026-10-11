package com.proyectoalmacen.catalog.service;

import com.proyectoalmacen.catalog.dto.*;
import com.proyectoalmacen.catalog.entity.Categoria;
import com.proyectoalmacen.catalog.exception.ResourceNotFoundException;
import com.proyectoalmacen.catalog.repository.CategoriaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service @Transactional
public class CategoriaService {
    private final CategoriaRepository repo;
    public CategoriaService(CategoriaRepository repo){this.repo=repo;}
    @Transactional(readOnly=true) public List<CategoriaResponse> listar(){return repo.findAll().stream().map(this::map).toList();}
    @Transactional(readOnly=true) public CategoriaResponse obtener(Long id){return map(find(id));}
    public CategoriaResponse crear(CategoriaRequest r){if(repo.existsByNombreIgnoreCase(r.nombre())) throw new IllegalArgumentException("Ya existe una categoría con ese nombre"); Categoria c=new Categoria();apply(c,r);return map(repo.save(c));}
    public CategoriaResponse actualizar(Long id,CategoriaRequest r){Categoria c=find(id);apply(c,r);return map(repo.save(c));}
    private Categoria find(Long id){return repo.findById(id).orElseThrow(()->new ResourceNotFoundException("Categoría no encontrada: "+id));}
    private void apply(Categoria c,CategoriaRequest r){c.setNombre(r.nombre().trim());c.setDescripcion(r.descripcion());if(r.activo()!=null)c.setActivo(r.activo());}
    private CategoriaResponse map(Categoria c){return new CategoriaResponse(c.getId(),c.getNombre(),c.getDescripcion(),c.getActivo());}
}
