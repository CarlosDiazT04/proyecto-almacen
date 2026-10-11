import React,{useEffect,useMemo,useState}from'react'
import PageHeader from '../components/PageHeader'
import Modal from '../components/Modal'
import{Loading,ErrorBox,Empty}from'../components/State'
import{api}from'../services/api'
import{dateTime}from'../utils/format'
import{useAuth}from'../context/AuthContext'
import{useToast}from'../components/Toast'

export default function Alertas(){
 const{hasRole,user}=useAuth();const{show}=useToast();const canAttend=hasRole('ADMIN','SUPERVISOR','ALMACENERO')
 const savedOperatorId=sessionStorage.getItem(`almacen_operator_id:${user?.username||''}`)||''
 const[items,setItems]=useState([]),[loading,setLoading]=useState(true),[error,setError]=useState(''),[filter,setFilter]=useState('TODAS'),[modal,setModal]=useState(null),[usuarioId,setUsuarioId]=useState(user?.id?String(user.id):savedOperatorId),[saving,setSaving]=useState(false)
 const load=async()=>{setLoading(true);setError('');try{setItems(await api.alertas())}catch(e){setError(e.message)}finally{setLoading(false)}};useEffect(()=>{load()},[])
 const filtered=useMemo(()=>filter==='TODAS'?items:items.filter(x=>x.estado===filter),[items,filter])
 const attend=async e=>{e.preventDefault();const responsibleId=user?.id||Number(usuarioId);if(!responsibleId){show('Ingresa el identificador del responsable.','error');return}setSaving(true);try{await api.atenderAlerta(modal.id,responsibleId);if(!user?.id)sessionStorage.setItem(`almacen_operator_id:${user?.username||''}`,String(responsibleId));show('Alerta atendida correctamente.');setModal(null);await load()}catch(e){show(e.message,'error')}finally{setSaving(false)}}
 return <><PageHeader title="Alertas" subtitle="Seguimiento de alertas de inventario."/><div className="toolbar"><div className="segmented"><button className={filter==='TODAS'?'active':''} onClick={()=>setFilter('TODAS')}>Todas</button><button className={filter==='PENDIENTE'?'active':''} onClick={()=>setFilter('PENDIENTE')}>Pendientes</button><button className={filter==='ATENDIDA'?'active':''} onClick={()=>setFilter('ATENDIDA')}>Atendidas</button></div><span className="result-count">{filtered.length} alerta(s)</span></div>{loading?<Loading/>:error?<ErrorBox message={error} onRetry={load}/>:filtered.length===0?<Empty text="No hay alertas para este filtro."/>:<div className="alert-grid">{filtered.map(a=><div className={`alert-card ${a.estado==='PENDIENTE'?'pending':''}`} key={a.id}><div className="alert-card-top"><span className="alert-symbol">!</span><div><strong>{a.producto}</strong><small>{a.sku}</small></div><span className={`badge ${a.estado==='PENDIENTE'?'danger':'success'}`}>{a.estado}</span></div><p>{a.mensaje}</p><div className="alert-meta"><span>Stock: <b>{a.stockActual}</b></span><span>Mínimo: <b>{a.stockMinimo}</b></span><span>{dateTime(a.fechaAlerta)}</span></div>{a.estado==='ATENDIDA'&&<div className="attended-meta">Atendida {dateTime(a.fechaAtencion)}</div>}{a.estado==='PENDIENTE'&&canAttend&&<button className="btn secondary full" onClick={()=>setModal(a)}>Marcar como atendida</button>}</div>)}</div>}
 <Modal open={!!modal} title="Atender alerta" onClose={()=>setModal(null)} width={460}><form onSubmit={attend} className="form-stack"><p>Confirma la atención de la alerta de <strong>{modal?.producto}</strong>.</p>{!user?.id&&<label>Responsable<input type="number" min="1" value={usuarioId} onChange={e=>setUsuarioId(e.target.value)} placeholder="Identificador del responsable" required/></label>}<div className="form-actions"><button type="button" className="btn secondary" onClick={()=>setModal(null)}>Cancelar</button><button className="btn primary" disabled={saving}>{saving?'Guardando...':'Confirmar atención'}</button></div></form></Modal></>
}
