import React from 'react'

export function Loading({ text = 'Cargando información...' }) {
  return <div className="state-box"><div className="spinner"/><span>{text}</span></div>
}

export function Empty({ text = 'No hay información para mostrar.' }) {
  return <div className="state-box empty">{text}</div>
}

export function ErrorBox({ message, onRetry }) {
  return <div className="error-box"><strong>No se pudo cargar la información.</strong><span>{message}</span>{onRetry && <button className="btn secondary" onClick={onRetry}>Reintentar</button>}</div>
}
