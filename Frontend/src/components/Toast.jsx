import React, { createContext, useContext, useMemo, useState } from 'react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [items, setItems] = useState([])
  const show = (message, type = 'success') => {
    const id = Date.now() + Math.random()
    setItems(prev => [...prev, { id, message, type }])
    setTimeout(() => setItems(prev => prev.filter(x => x.id !== id)), 3500)
  }
  const value = useMemo(() => ({ show }), [])
  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-stack">
        {items.map(item => <div key={item.id} className={`toast ${item.type}`}>{item.message}</div>)}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)
