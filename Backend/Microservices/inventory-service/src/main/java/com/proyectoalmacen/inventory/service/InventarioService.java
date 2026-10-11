package com.proyectoalmacen.inventory.service;

import com.proyectoalmacen.inventory.client.CatalogClient;
import com.proyectoalmacen.inventory.dto.*;
import com.proyectoalmacen.inventory.entity.Inventario;
import com.proyectoalmacen.inventory.exception.ResourceNotFoundException;
import com.proyectoalmacen.inventory.repository.InventarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class InventarioService {
    private final InventarioRepository repo; private final CatalogClient catalog;
    public InventarioService(InventarioRepository repo, CatalogClient catalog){this.repo=repo;this.catalog=catalog;}

    @Transactional(readOnly=true)
    public List<InventarioResponse> listar(){return repo.findAll().stream().map(this::response).toList();}
    @Transactional(readOnly=true)
    public InventarioResponse obtener(Long id){return response(repo.findById(id).orElseThrow(()->new ResourceNotFoundException("Inventario no encontrado: "+id)));}
    @Transactional(readOnly=true)
    public InventarioResponse obtenerPorProducto(Long productoId){return response(repo.findByProductoId(productoId).orElseThrow(()->new ResourceNotFoundException("Inventario no encontrado para producto: "+productoId)));}
    @Transactional
    public InventarioResponse crear(InventarioRequest r){
        catalog.obtenerProducto(r.productoId());
        if(repo.existsByProductoId(r.productoId())) throw new IllegalArgumentException("Ya existe inventario para el producto "+r.productoId());
        validar(r.stockActual(),r.stockReservado());
        Inventario i=new Inventario(); i.setProductoId(r.productoId()); i.setStockActual(r.stockActual()); i.setStockReservado(r.stockReservado()); i.setStockMinimo(r.stockMinimo()); i.setActivo(r.activo()==null?true:r.activo());
        return response(repo.save(i));
    }
    @Transactional
    public InventarioResponse actualizar(Long id, InventarioRequest r){
        Inventario i=repo.findById(id).orElseThrow(()->new ResourceNotFoundException("Inventario no encontrado: "+id));
        catalog.obtenerProducto(r.productoId()); validar(r.stockActual(),r.stockReservado());
        i.setProductoId(r.productoId()); i.setStockActual(r.stockActual()); i.setStockReservado(r.stockReservado()); i.setStockMinimo(r.stockMinimo()); if(r.activo()!=null)i.setActivo(r.activo());
        return response(repo.save(i));
    }
    @Transactional
    public InventarioResponse ajustarStock(Long productoId, int delta){
        Inventario i=repo.findByProductoId(productoId).orElseThrow(()->new ResourceNotFoundException("Inventario no encontrado para producto: "+productoId));
        int nuevo=i.getStockActual()+delta; if(nuevo<0) throw new IllegalArgumentException("Stock insuficiente"); if(i.getStockReservado()>nuevo) throw new IllegalArgumentException("El nuevo stock no puede ser menor al stock reservado");
        i.setStockActual(nuevo); return response(repo.save(i));
    }
    private void validar(int actual,int reservado){if(reservado>actual) throw new IllegalArgumentException("stockReservado no puede ser mayor que stockActual");}
    private InventarioResponse response(Inventario i){
        ProductoCatalogoResponse p=catalog.obtenerProducto(i.getProductoId()); int disponible=i.getStockActual()-i.getStockReservado();
        return new InventarioResponse(i.getId(),i.getProductoId(),p.sku(),p.nombre(),i.getStockActual(),i.getStockReservado(),disponible,i.getStockMinimo(),i.getActivo(),disponible<=i.getStockMinimo());
    }
}
