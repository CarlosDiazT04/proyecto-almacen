import React, { useEffect, useMemo, useState } from 'react'
import PageHeader from '../components/PageHeader'
import { Loading, ErrorBox } from '../components/State'
import { api } from '../services/api'
import { dateTime, money } from '../utils/format'

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  const load = async () => {
    setError('')
    try {
      const [productos, inventarios, movimientos, alertas] = await Promise.all([
        api.productos(), api.inventarios(), api.movimientos(), api.alertas()
      ])
      setData({ productos, inventarios, movimientos, alertas })
    } catch (e) { setError(e.message) }
  }
  useEffect(() => { load() }, [])

  const stats = useMemo(() => {
    if (!data) return null
    const low = data.inventarios.filter(x => x.stockBajo).length
    const pending = data.alertas.filter(x => x.estado === 'PENDIENTE').length
    const stock = data.inventarios.reduce((s, x) => s + (x.stockActual || 0), 0)
    const value = data.productos.reduce((s, p) => {
      const inv = data.inventarios.find(i => i.productoId === p.id)
      return s + Number(p.precio || 0) * Number(inv?.stockActual || 0)
    }, 0)
    return { low, pending, stock, value }
  }, [data])

  if (!data && !error) return <Loading />
  if (error) return <ErrorBox message={error} onRetry={load} />

  return <>
    <PageHeader title="Dashboard" subtitle="Resumen operativo del almacén." />
    <div className="kpi-grid">
      <Kpi label="Productos activos" value={data.productos.filter(x => x.activo).length} icon="▦" />
      <Kpi label="Stock total" value={stats.stock} icon="▤" />
      <Kpi label="Stock bajo" value={stats.low} icon="!" tone={stats.low ? 'warning' : ''} />
      <Kpi label="Alertas pendientes" value={stats.pending} icon="⚑" tone={stats.pending ? 'danger' : ''} />
      <Kpi label="Valor estimado" value={money(stats.value)} icon="S/" />
    </div>

    <div className="dashboard-grid">
      <div className="card">
        <div className="card-head"><h3>Estado del inventario</h3><span>{data.inventarios.length} registros</span></div>
        <div className="stock-list">
          {data.inventarios.slice(0, 6).map(i => {
            const max = Math.max((i.stockMinimo || 0) * 4, i.stockActual || 1)
            const pct = Math.min(100, Math.round((i.stockActual || 0) / max * 100))
            return <div className="stock-row" key={i.id}>
              <div><strong>{i.producto}</strong><small>{i.sku}</small></div>
              <div className="progress"><span style={{width:`${pct}%`}} className={i.stockBajo ? 'low' : ''}/></div>
              <b>{i.stockActual}</b>
            </div>
          })}
        </div>
      </div>
      <div className="card">
        <div className="card-head"><h3>Últimos movimientos</h3><span>Actividad reciente</span></div>
        <div className="activity-list">
          {data.movimientos.slice(0, 6).map(m => <div className="activity" key={m.id}>
            <span className={`movement-dot ${m.tipo.toLowerCase()}`}>{m.tipo === 'ENTRADA' ? '↓' : '↑'}</span>
            <div><strong>{m.producto || `Producto ${m.productoId}`}</strong><small>{m.tipo} · {m.cantidad} unidad(es) · {dateTime(m.fechaMovimiento)}</small></div>
            <span className={`badge ${m.estado === 'PROCESADO' ? 'success' : 'danger'}`}>{m.estado}</span>
          </div>)}
        </div>
      </div>
    </div>
  </>
}

function Kpi({ label, value, icon, tone='' }) {
  return <div className={`kpi-card ${tone}`}><div className="kpi-icon">{icon}</div><div><span>{label}</span><strong>{value}</strong></div></div>
}
