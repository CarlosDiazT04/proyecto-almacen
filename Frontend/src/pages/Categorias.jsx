import React, { useEffect, useMemo, useState } from 'react'
import PageHeader from '../components/PageHeader'
import Modal from '../components/Modal'
import { Loading, ErrorBox, Empty } from '../components/State'
import { api } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/Toast'

const blank={nombre:'',descripcion:'',activo:true}
export default function Categorias(){
  const {hasRole}=useAuth(); const {show}=useToast(); const canWrite=hasRole('ADMIN','SUPERVISOR')
  const [items,setItems]=useState([]),[loading,setLoading]=useState(true),[error,setError]=useState(''),[search,setSearch]=useState(''),[modal,setModal]=useState(false),[editing,setEditing]=useState(null),[form,setForm]=useState(blank),[saving,setSaving]=useState(false)
  const load=async()=>{setLoading(true);setError('');try{setItems(await api.categorias())}catch(e){setError(e.message)}finally{setLoading(false)}}; useEffect(()=>{load()},[])
  const filtered=useMemo(()=>items.filter(x=>`${x.nombre} ${x.descripcion||''}`.toLowerCase().includes(search.toLowerCase())),[items,search])
  const openNew=()=>{setEditing(null);setForm(blank);setModal(true)}; const openEdit=x=>{setEditing(x);setForm({nombre:x.nombre,descripcion:x.descripcion||'',activo:x.activo});setModal(true)}
  const save=async e=>{e.preventDefault();setSaving(true);try{editing?await api.actualizarCategoria(editing.id,form):await api.crearCategoria(form);show(editing?'Categoría actualizada.':'Categoría creada.');setModal(false);await load()}catch(e){show(e.message,'error')}finally{setSaving(false)}}
  return <><PageHeader title="Categorías" subtitle="Clasificación del catálogo de productos." action={canWrite&&<button className="btn primary" onClick={openNew}>+ Nueva categoría</button>}/><div className="toolbar"><input className="search" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar categoría..."/><span className="result-count">{filtered.length} categoría(s)</span></div>{loading?<Loading/>:error?<ErrorBox message={error} onRetry={load}/>:filtered.length===0?<Empty/>:<div className="table-card"><table><thead><tr><th>ID</th><th>Nombre</th><th>Descripción</th><th>Estado</th>{canWrite&&<th></th>}</tr></thead><tbody>{filtered.map(x=><tr key={x.id}><td>{x.id}</td><td><strong>{x.nombre}</strong></td><td>{x.descripcion||'—'}</td><td><span className={`badge ${x.activo?'success':'muted'}`}>{x.activo?'ACTIVA':'INACTIVA'}</span></td>{canWrite&&<td className="actions"><button className="link-btn" onClick={()=>openEdit(x)}>Editar</button></td>}</tr>)}</tbody></table></div>}
  <Modal open={modal} title={editing?'Editar categoría':'Nueva categoría'} onClose={()=>setModal(false)} width={520}><form className="form-grid" onSubmit={save}><label className="span-2">Nombre<input value={form.nombre} onChange={e=>setForm({...form,nombre:e.target.value})} required/></label><label className="span-2">Descripción<textarea rows="3" value={form.descripcion} onChange={e=>setForm({...form,descripcion:e.target.value})}/></label><label className="checkbox span-2"><input type="checkbox" checked={form.activo} onChange={e=>setForm({...form,activo:e.target.checked})}/> Categoría activa</label><div className="form-actions span-2"><button type="button" className="btn secondary" onClick={()=>setModal(false)}>Cancelar</button><button className="btn primary" disabled={saving}>{saving?'Guardando...':'Guardar'}</button></div></form></Modal></>
}
