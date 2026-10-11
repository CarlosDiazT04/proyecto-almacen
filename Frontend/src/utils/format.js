export const money = value => new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(Number(value || 0))
export const dateTime = value => value ? new Intl.DateTimeFormat('es-PE', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(value)) : '—'
export const num = value => new Intl.NumberFormat('es-PE').format(Number(value || 0))
