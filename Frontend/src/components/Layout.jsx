import React, { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const nav = [
  ['/', '⌂', 'Dashboard'],
  ['/productos', '▦', 'Productos'],
  ['/categorias', '◫', 'Categorías'],
  ['/inventario', '▤', 'Inventario'],
  ['/movimientos', '⇄', 'Movimientos'],
  ['/alertas', '!', 'Alertas']
]

export default function Layout() {
  const { user, logout } = useAuth()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className={`shell ${collapsed ? 'sidebar-collapsed' : ''}`}>
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">PA</div>
          {!collapsed && <div><strong>Proyecto Almacén</strong><span>Control de Inventario</span></div>}
        </div>
        <nav>
          {nav.map(([to, icon, label]) => (
            <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <span className="nav-icon">{icon}</span>
              {!collapsed && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          {!collapsed && <div className="user-mini"><strong>{user?.nombre}</strong><span>{user?.roles?.join(', ')}</span></div>}
          <button className="nav-item logout" onClick={logout}><span className="nav-icon">↪</span>{!collapsed && <span>Cerrar sesión</span>}</button>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <button className="icon-button" onClick={() => setCollapsed(v => !v)}>{collapsed ? '☰' : '≡'}</button>
          <div className="topbar-title">Sistema de Gestión de Almacén</div>
          <div className="topbar-user"><span className="status-dot" />{user?.username}</div>
        </header>
        <section className="content"><Outlet /></section>
      </main>
    </div>
  )
}
