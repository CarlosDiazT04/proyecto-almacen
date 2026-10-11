const API_BASE = import.meta.env.VITE_API_BASE_URL || ''

function getToken() {
  return sessionStorage.getItem('almacen_token')
}

function friendlyMessage(status, data) {
  if (status === 401) return 'Tu sesión venció. Inicia sesión nuevamente.'
  if (status === 403) return 'No tienes permisos para realizar esta acción.'
  if (status === 404) return typeof data === 'object' && data?.message ? data.message : 'No se encontró la información solicitada.'
  if (status === 502 || status === 503) return 'El servicio no está disponible temporalmente. Intenta nuevamente en unos momentos.'
  if (status >= 500) return 'Ocurrió un problema al procesar la solicitud. Intenta nuevamente.'
  return typeof data === 'string'
    ? data || `Error ${status}`
    : data?.message || data?.error || `Error ${status}`
}

async function request(path, options = {}) {
  const headers = new Headers(options.headers || {})
  const token = getToken()

  if (token) headers.set('Authorization', `Bearer ${token}`)
  if (options.body && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json')
  }

  let response
  try {
    response = await fetch(`${API_BASE}${path}`, { ...options, headers })
  } catch {
    throw new Error('No se pudo conectar con el sistema. Verifica que los servicios estén disponibles.')
  }

  if (response.status === 401) {
    sessionStorage.removeItem('almacen_token')
    sessionStorage.removeItem('almacen_user')
    window.dispatchEvent(new CustomEvent('auth:expired'))
  }

  const contentType = response.headers.get('content-type') || ''
  const data = contentType.includes('application/json')
    ? await response.json()
    : await response.text()

  if (!response.ok) {
    const error = new Error(friendlyMessage(response.status, data))
    error.status = response.status
    error.payload = data
    throw error
  }

  return data
}

export const api = {
  login: (username, password) => request('/auth-service/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password })
  }),

  productos: () => request('/catalog-service/api/productos'),
  producto: (id) => request(`/catalog-service/api/productos/${id}`),
  crearProducto: (data) => request('/catalog-service/api/productos', {
    method: 'POST', body: JSON.stringify(data)
  }),
  actualizarProducto: (id, data) => request(`/catalog-service/api/productos/${id}`, {
    method: 'PUT', body: JSON.stringify(data)
  }),

  categorias: () => request('/catalog-service/api/categorias'),
  crearCategoria: (data) => request('/catalog-service/api/categorias', {
    method: 'POST', body: JSON.stringify(data)
  }),
  actualizarCategoria: (id, data) => request(`/catalog-service/api/categorias/${id}`, {
    method: 'PUT', body: JSON.stringify(data)
  }),

  inventarios: () => request('/inventory-service/api/inventarios'),
  crearInventario: (data) => request('/inventory-service/api/inventarios', {
    method: 'POST', body: JSON.stringify(data)
  }),
  actualizarInventario: (id, data) => request(`/inventory-service/api/inventarios/${id}`, {
    method: 'PUT', body: JSON.stringify(data)
  }),

  movimientos: () => request('/movement-service/api/movimientos'),
  crearMovimiento: (data) => request('/movement-service/api/movimientos', {
    method: 'POST', body: JSON.stringify(data)
  }),

  alertas: () => request('/alert-service/api/alertas'),
  atenderAlerta: (id, usuarioId) => request(`/alert-service/api/alertas/${id}/atender`, {
    method: 'PUT', body: JSON.stringify({ usuarioId: Number(usuarioId) })
  })
}
