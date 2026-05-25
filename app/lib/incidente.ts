import type { Schema } from '@/amplify/data/resource'

export type Incidente = Schema['Incidente']['type']
export type Categoria = NonNullable<Incidente['categoria']>
export type TipoActoServicio = NonNullable<Incidente['tipoActoServicio']>

export const CATEGORIAS: { value: Categoria; label: string }[] = [
  { value: 'ACTO_SERVICIO', label: 'Novedades' },
  { value: 'EMERGENCIA',    label: 'Emergencia' },
]

export const TIPOS_ACTO: { value: TipoActoServicio; label: string }[] = [
  { value: 'SESION_COMPANIA',         label: 'Sesión de Compañía' },
  { value: 'JUNTA_OFICIALES',         label: 'Junta de Oficiales' },
  { value: 'CONSEJO_DISCIPLINA',      label: 'Consejo de Disciplina' },
  { value: 'ACADEMIA_COMPANIA',       label: 'Academia de Compañía' },
  { value: 'PRESTAMO_MATERIAL',       label: 'Préstamo de Material' },
  { value: 'EJERCICIOS',              label: 'Ejercicios' },
  { value: 'INGRESO_PERSONAL_EXTERNO',label: 'Ingreso de Personal Externo' },
  { value: 'OTRO',                    label: 'Otro' },
]

// Acceso rápido (subset que aparece como botones grandes en el formulario)
export const QUICK_TIPOS: TipoActoServicio[] = [
  'SESION_COMPANIA',
  'JUNTA_OFICIALES',
  'CONSEJO_DISCIPLINA',
  'ACADEMIA_COMPANIA',
  'PRESTAMO_MATERIAL',
  'EJERCICIOS',
  'INGRESO_PERSONAL_EXTERNO',
]

export const VEHICULOS = ['B-6', 'BX-6', 'M-6', 'Q-6', 'Otro']

export function labelTipoActo(v: TipoActoServicio | null | undefined): string {
  if (!v) return '—'
  return TIPOS_ACTO.find(t => t.value === v)?.label ?? v
}

export function labelCategoria(v: Categoria | null | undefined): string {
  if (!v) return '—'
  return CATEGORIAS.find(c => c.value === v)?.label ?? v
}

export function formatFecha(date: string | null | undefined): string {
  if (!date) return '—'
  const [y, m, d] = date.split('-')
  return `${d}/${m}/${y}`
}

export function formatHora(time: string | null | undefined): string {
  if (!time) return '—'
  const [h, m] = time.split(':')
  return `${h}:${m}`
}

export function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return '—'
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export function todayDate(): string {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export function nowTime(): string {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`
}
