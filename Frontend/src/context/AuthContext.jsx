import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { api } from '../services/api'

const AuthContext = createContext(null)

function readUser() {
  try {
    return JSON.parse(sessionStorage.getItem('almacen_user'))
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readUser)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const onExpired = () => setUser(null)
    window.addEventListener('auth:expired', onExpired)
    return () => window.removeEventListener('auth:expired', onExpired)
  }, [])

  const login = async (username, password) => {
    setLoading(true)
    try {
      const data = await api.login(username, password)
      sessionStorage.setItem('almacen_token', data.token)
      sessionStorage.setItem('almacen_user', JSON.stringify(data))
      setUser(data)
      return data
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    sessionStorage.removeItem('almacen_token')
    sessionStorage.removeItem('almacen_user')
    setUser(null)
  }

  const roles = user?.roles || []
  const hasRole = (...allowed) => roles.some(r => allowed.includes(r))

  const value = useMemo(() => ({ user, roles, login, logout, loading, hasRole }), [user, roles, loading])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
