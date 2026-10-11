import React, { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { user, login, loading } = useAuth()
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')

  if (user) return <Navigate to="/" replace />

  const submit = async e => {
    e.preventDefault()
    setError('')
    try { await login(form.username.trim(), form.password) }
    catch (err) { setError(err.status === 401 || err.status === 403 ? 'Usuario o contraseña incorrectos.' : err.message) }
  }

  return (
    <div className="login-page">
      <div className="login-panel">
        <div className="login-brand"><div className="brand-mark large">PA</div><div><h1>Proyecto Almacén</h1><p>Gestión integral de inventario y operaciones</p></div></div>
        <div className="login-features">
          <div><span>✓</span><div><strong>Inventario centralizado</strong><small>Stock, mínimos y disponibilidad en tiempo real.</small></div></div>
          <div><span>✓</span><div><strong>Control de movimientos</strong><small>Registro de entradas y salidas del almacén.</small></div></div>
          <div><span>✓</span><div><strong>Alertas de inventario</strong><small>Seguimiento oportuno de productos con stock bajo.</small></div></div>
        </div>
      </div>
      <div className="login-card-wrap">
        <form className="login-card" onSubmit={submit}>
          <div className="login-card-head"><h2>Iniciar sesión</h2><p>Ingresa tus credenciales para continuar.</p></div>
          <label>Usuario<input autoFocus value={form.username} onChange={e => setForm({...form, username:e.target.value})} placeholder="Usuario" required /></label>
          <label>Contraseña<input type="password" value={form.password} onChange={e => setForm({...form, password:e.target.value})} placeholder="••••••••" required /></label>
          {error && <div className="form-error">{error}</div>}
          <button className="btn primary full" disabled={loading}>{loading ? 'Ingresando...' : 'Ingresar'}</button>
        </form>
      </div>
    </div>
  )
}
