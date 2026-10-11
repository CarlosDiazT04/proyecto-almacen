import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { ToastProvider } from './components/Toast'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Productos from './pages/Productos'
import Categorias from './pages/Categorias'
import Inventario from './pages/Inventario'
import Movimientos from './pages/Movimientos'
import Alertas from './pages/Alertas'

function Protected({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" replace />
}

export default function App() {
  return <ToastProvider><Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/" element={<Protected><Layout /></Protected>}>
      <Route index element={<Dashboard />} />
      <Route path="productos" element={<Productos />} />
      <Route path="categorias" element={<Categorias />} />
      <Route path="inventario" element={<Inventario />} />
      <Route path="movimientos" element={<Movimientos />} />
      <Route path="alertas" element={<Alertas />} />
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes></ToastProvider>
}
