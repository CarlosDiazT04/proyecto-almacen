import React, { useEffect, useMemo, useState } from 'react'
import PageHeader from '../components/PageHeader'
import Modal from '../components/Modal'
import { Loading, ErrorBox, Empty } from '../components/State'
import { api } from '../services/api'
import { money } from '../utils/format'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/Toast'

const blank = { sku:'', nombre:'', descripcion:'', precio:'', categoriaId:'', activo:true }

export default function Productos() {
  const { hasRole } = useAuth(); const { show } = useToast()
  const canWrite = hasRole('ADMIN','SUPERVISOR')
  const [productos,setProductos]=useState([]), [categorias,setCategorias]=useState([]), [loading,setLoading]=useState(true), [error,setError]=useState('')
  const [search,setSearch]=useState(''), [modal,setModal]=useState(false), [editing,setEditing]=useState(null), [form,setForm]=useState(blank), [saving,setSaving]=useState(false)

  const load=async()=>{setLoading(true);setError('');try{const [p,c]=await Promise.all([api.productos(),api.categorias()]);setProductos(p);setCategorias(c)}catch(e){setError(e.message)}finally{setLoading(false)}}
  useEffect(()=>{load()},[])
  const filtered=useMemo(()=>productos.filter(p=>`${p.sku} ${p.nombre} ${p.categoria}`.toLowerCase().includes(search.toLowerCase())),[productos,search])
  const openNew=()=>{setEditing(null);setForm(blank);setModal(true)}
  const openEdit=p=>{setEditing(p);setForm({sku:p.sku,nombre:p.nombre,descripcion:p.descripcion||'',precio:p.precio,categoriaId:String(p.categoriaId),activo:p.activo});setModal(true)}
  const save=async e=>{e.preventDefault();setSaving(true);try{const payload={...form,precio:Number(form.precio),categoriaId:Number(form.categoriaId),activo:Boolean(form.activo)}; editing?await api.actualizarProducto(editing.id,payload):await api.crearProducto(payload);show(editing?'Producto actualizado.':'Producto creado.');setModal(false);await load()}catch(e){show(e.message,'error')}finally{setSaving(false)}}

  return <>
    <PageHeader title="Productos" subtitle="Catálogo de productos del almacén." action={canWrite && <button className="btn primary" onClick={openNew}>+ Nuevo producto</button>} />
    <div className="toolbar"><input className="search" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar por SKU, nombre o categoría..."/><span className="result-count">{filtered.length} producto(s)</span></div>
    {loading?<Loading/>:error?<ErrorBox message={error} onRetry={load}/>:filtered.length===0?<Empty/>:<div className="table-card"><table><thead><tr><th>SKU</th><th>Producto</th><th>Categoría</th><th>Precio</th><th>Estado</th>{canWrite&&<th></th>}</tr></thead><tbody>{filtered.map(p=><tr key={p.id}><td><code>{p.sku}</code></td><td><strong>{p.nombre}</strong><small className="cell-sub">{p.descripcion||'Sin descripción'}</small></td><td>{p.categoria}</td><td>{money(p.precio)}</td><td><span className={`badge ${p.activo?'success':'muted'}`}>{p.activo?'ACTIVO':'INACTIVO'}</span></td>{canWrite&&<td className="actions"><button className="link-btn" onClick={()=>openEdit(p)}>Editar</button></td>}</tr>)}</tbody></table></div>}
    <Modal open={modal} title={editing?'Editar producto':'Nuevo producto'} onClose={()=>setModal(false)}>
      <form className="form-grid" onSubmit={save}>
        <label>SKU<input value={form.sku} onChange={e=>setForm({...form,sku:e.target.value})} maxLength="50" required/></label>
        <label>Nombre<input value={form.nombre} onChange={e=>setForm({...form,nombre:e.target.value})} maxLength="150" required/></label>
        <label className="span-2">Descripción<textarea value={form.descripcion} onChange={e=>setForm({...form,descripcion:e.target.value})} maxLength="500" rows="3"/></label>
        <label>Precio (S/)<input type="number" min="0" step="0.01" value={form.precio} onChange={e=>setForm({...form,precio:e.target.value})} required/></label>
        <label>Categoría<select value={form.categoriaId} onChange={e=>setForm({...form,categoriaId:e.target.value})} required><option value="">Seleccionar</option>{categorias.filter(c=>c.activo).map(c=><option key={c.id} value={c.id}>{c.nombre}</option>)}</select></label>
        <label className="checkbox span-2"><input type="checkbox" checked={form.activo} onChange={e=>setForm({...form,activo:e.target.checked})}/> Producto activo</label>
        <div className="form-actions span-2"><button type="button" className="btn secondary" onClick={()=>setModal(false)}>Cancelar</button><button className="btn primary" disabled={saving}>{saving?'Guardando...':'Guardar'}</button></div>
      </form>
    </Modal>
  </>
}
