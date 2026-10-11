package com.proyectoalmacen.catalog.service;

import com.proyectoalmacen.catalog.dto.*;
import com.proyectoalmacen.catalog.entity.*;
import com.proyectoalmacen.catalog.exception.ResourceNotFoundException;
import com.proyectoalmacen.catalog.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service @Transactional
public class ProductoService {
    private final ProductoRepository productos; private final CategoriaRepository categorias;
    public ProductoService(ProductoRepository productos,CategoriaRepository categorias){this.productos=productos;this.categorias=categorias;}
    @Transactional(readOnly=true) public List<ProductoResponse> listar(){return productos.findAll().stream().map(this::map).toList();}
    @Transactional(readOnly=true) public ProductoResponse obtener(Long id){return map(find(id));}
    public ProductoResponse crear(ProductoRequest r){if(productos.existsBySkuIgnoreCase(r.sku())) throw new IllegalArgumentException("Ya existe un producto con ese SKU"); Producto p=new Producto();apply(p,r);return map(productos.save(p));}
    public ProductoResponse actualizar(Long id,ProductoRequest r){Producto p=find(id);if(!p.getSku().equalsIgnoreCase(r.sku())&&productos.existsBySkuIgnoreCase(r.sku())) throw new IllegalArgumentException("Ya existe un producto con ese SKU");apply(p,r);return map(productos.save(p));}
    private Producto find(Long id){return productos.findById(id).orElseThrow(()->new ResourceNotFoundException("Producto no encontrado: "+id));}
    private Categoria categoria(Long id){return categorias.findById(id).orElseThrow(()->new ResourceNotFoundException("Categoría no encontrada: "+id));}
    private void apply(Producto p,ProductoRequest r){p.setSku(r.sku().trim());p.setNombre(r.nombre().trim());p.setDescripcion(r.descripcion());p.setPrecio(r.precio());p.setCategoria(categoria(r.categoriaId()));if(r.activo()!=null)p.setActivo(r.activo());}
    private ProductoResponse map(Producto p){return new ProductoResponse(p.getId(),p.getSku(),p.getNombre(),p.getDescripcion(),p.getPrecio(),p.getCategoria().getId(),p.getCategoria().getNombre(),p.getActivo());}
}
