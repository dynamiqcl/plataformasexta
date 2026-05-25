'use client'

import { useState, useMemo, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { generateClient } from 'aws-amplify/data'
import type { Schema } from '@/amplify/data/resource'
import {
  CATEGORIAS, TIPOS_ACTO, QUICK_TIPOS, VEHICULOS,
  labelTipoActo, todayDate,
  type Categoria, type TipoActoServicio, type Incidente,
} from '@/app/lib/incidente'
import { EMERGENCIA_GROUPS } from '@/app/lib/emergencias'

const client = generateClient<Schema>()

type FormState = {
  fecha: string
  categoria: Categoria
  tipoActoServicio: TipoActoServicio | ''
  tipoEmergencia: string
  direccion: string
  vehiculo: string
  conductor: string
  odometroAnterior: string
  odometroActual: string
  horaSalida: string
  horaLlegada: string
  horaRegreso: string
  pasoCombustible: boolean
  pasoMaterial: boolean
  voluntariosHonorarios: string
  voluntariosActivos: string
  otrasCompanias: string
  oficialCargoCompania: string
  oficialCargoCuerpo: string
  observaciones: string
}

const initialState = (): FormState => ({
  fecha: todayDate(),
  categoria: 'ACTO_SERVICIO',
  tipoActoServicio: '',
  tipoEmergencia: '',
  direccion: '',
  vehiculo: '',
  conductor: '',
  odometroAnterior: '',
  odometroActual: '',
  horaSalida: '',
  horaLlegada: '',
  horaRegreso: '',
  pasoCombustible: false,
  pasoMaterial: false,
  voluntariosHonorarios: '0',
  voluntariosActivos: '0',
  otrasCompanias: '0',
  oficialCargoCompania: '',
  oficialCargoCuerpo: '',
  observaciones: '',
})

const timeFromIso = (s: string | null | undefined): string =>
  s ? s.slice(0, 5) : ''

const incidenteToForm = (i: Incidente): FormState => ({
  fecha: i.fecha ?? todayDate(),
  categoria: i.categoria ?? 'ACTO_SERVICIO',
  tipoActoServicio: i.tipoActoServicio ?? '',
  tipoEmergencia: i.tipoEmergencia ?? '',
  direccion: i.direccion ?? '',
  vehiculo: i.vehiculo ?? '',
  conductor: i.conductor ?? '',
  odometroAnterior: i.odometroAnterior?.toString() ?? '',
  odometroActual: i.odometroActual?.toString() ?? '',
  horaSalida: timeFromIso(i.horaSalida),
  horaLlegada: timeFromIso(i.horaLlegada),
  horaRegreso: timeFromIso(i.horaRegreso),
  pasoCombustible: i.pasoCombustible ?? false,
  pasoMaterial: i.pasoMaterial ?? false,
  voluntariosHonorarios: (i.voluntariosHonorarios ?? 0).toString(),
  voluntariosActivos: (i.voluntariosActivos ?? 0).toString(),
  otrasCompanias: (i.otrasCompanias ?? 0).toString(),
  oficialCargoCompania: i.oficialCargoCompania ?? '',
  oficialCargoCuerpo: i.oficialCargoCuerpo ?? '',
  observaciones: i.observaciones ?? '',
})

export default function IncidenteForm({ incidente }: { incidente?: Incidente }) {
  const router = useRouter()
  const isEdit = !!incidente
  const [form, setForm] = useState<FormState>(() =>
    incidente ? incidenteToForm(incidente) : initialState()
  )
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [ultimoOdometroPorVehiculo, setUltimoOdometroPorVehiculo] = useState<Map<string, number>>(new Map())
  const [autoLlenado, setAutoLlenado] = useState(false)

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm(prev => ({ ...prev, [k]: v }))

  // Cargar últimos odómetros por vehículo (solo al crear)
  useEffect(() => {
    if (isEdit) return
    client.models.Incidente.list().then(({ data }) => {
      const sorted = [...data].sort((a, b) =>
        (b.createdAt ?? '').localeCompare(a.createdAt ?? '')
      )
      const map = new Map<string, number>()
      for (const i of sorted) {
        if (i.vehiculo && i.odometroActual != null && !map.has(i.vehiculo)) {
          map.set(i.vehiculo, i.odometroActual)
        }
      }
      setUltimoOdometroPorVehiculo(map)
    }).catch(() => { /* sin auto-llenado si falla */ })
  }, [isEdit])

  const handleVehiculoChange = (v: string) => {
    set('vehiculo', v)
    if (isEdit) return
    const ultimo = v ? ultimoOdometroPorVehiculo.get(v) : undefined
    if (ultimo != null) {
      set('odometroAnterior', String(ultimo))
      setAutoLlenado(true)
    } else {
      // Sin registros previos: limpiar si el valor actual venía de un auto-fill
      if (autoLlenado) set('odometroAnterior', '')
      setAutoLlenado(false)
    }
  }

  const kmRecorridos = useMemo(() => {
    const ant = Number(form.odometroAnterior)
    const act = Number(form.odometroActual)
    if (!Number.isFinite(ant) || !Number.isFinite(act)) return 0
    return Math.max(0, act - ant)
  }, [form.odometroAnterior, form.odometroActual])

  const totalPersonal = useMemo(() => {
    return (Number(form.voluntariosHonorarios) || 0)
      + (Number(form.voluntariosActivos) || 0)
      + (Number(form.otrasCompanias) || 0)
  }, [form.voluntariosHonorarios, form.voluntariosActivos, form.otrasCompanias])

  const aplicarQuickRegistro = (tipo: TipoActoServicio) => {
    setForm(prev => ({
      ...prev,
      categoria: 'ACTO_SERVICIO',
      tipoActoServicio: tipo,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.direccion.trim()) { setError('La dirección es obligatoria.'); return }
    if (!form.fecha) { setError('La fecha es obligatoria.'); return }

    setSaving(true)
    setError(null)
    try {
      const toInt = (s: string): number | undefined => {
        const n = parseInt(s, 10)
        return Number.isFinite(n) ? n : undefined
      }
      const toTime = (s: string): string | undefined =>
        s ? `${s}:00.000` : undefined

      const payload = {
        fecha: form.fecha,
        categoria: form.categoria,
        tipoActoServicio: form.categoria === 'ACTO_SERVICIO' ? (form.tipoActoServicio || null) : null,
        tipoEmergencia:   form.categoria === 'EMERGENCIA'    ? (form.tipoEmergencia || null) : null,
        direccion: form.direccion.trim(),
        vehiculo: form.vehiculo || null,
        conductor: form.conductor.trim() || null,
        odometroAnterior: toInt(form.odometroAnterior) ?? null,
        odometroActual: toInt(form.odometroActual) ?? null,
        horaSalida: toTime(form.horaSalida) ?? null,
        horaLlegada: toTime(form.horaLlegada) ?? null,
        horaRegreso: toTime(form.horaRegreso) ?? null,
        pasoCombustible: form.pasoCombustible,
        pasoMaterial: form.pasoMaterial,
        voluntariosHonorarios: toInt(form.voluntariosHonorarios) ?? 0,
        voluntariosActivos: toInt(form.voluntariosActivos) ?? 0,
        otrasCompanias: toInt(form.otrasCompanias) ?? 0,
        oficialCargoCompania: form.oficialCargoCompania.trim() || null,
        oficialCargoCuerpo: form.oficialCargoCuerpo.trim() || null,
        observaciones: form.observaciones.trim() || null,
      }

      const { errors } = isEdit
        ? await client.models.Incidente.update({ id: incidente!.id, ...payload })
        : await client.models.Incidente.create(payload)
      if (errors?.length) throw new Error(errors[0].message)
      router.push('/')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al guardar')
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-7xl mx-auto px-4 py-6 flex flex-col gap-5">
      {/* Page title + back */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900">
            {isEdit ? 'Editar Incidente' : 'Registrar Incidente'}
          </h2>
          <p className="text-sm text-zinc-500 mt-1">
            {isEdit
              ? 'Modifica la información del acto de servicio'
              : 'Complete todos los detalles del acto de servicio'}
          </p>
        </div>
        <Link
          href="/"
          className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 border border-zinc-200 bg-white rounded-md px-3 py-1.5 shadow-sm"
        >
          ← Volver
        </Link>
      </div>

      {/* Quick registros (solo para Novedades) */}
      {form.categoria === 'ACTO_SERVICIO' && (
        <section className="bg-zinc-50 border border-zinc-200 rounded-xl p-5">
          <h3 className="font-semibold text-zinc-900">Registros Rápidos</h3>
          <p className="text-xs text-zinc-500 mt-0.5 mb-4">
            Selecciona un tipo de novedad para autorrellenar el formulario
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2">
            {QUICK_TIPOS.map(t => {
              const selected = form.tipoActoServicio === t
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => aplicarQuickRegistro(t)}
                  className={`rounded-lg px-3 py-3.5 text-sm font-medium text-center transition-all border-2 ${
                    selected
                      ? 'border-red-600 bg-red-600 text-white shadow-sm'
                      : 'border-zinc-200 bg-white text-zinc-700 hover:border-red-400 hover:text-red-700'
                  }`}
                >
                  {labelTipoActo(t)}
                </button>
              )
            })}
          </div>
        </section>
      )}

      {/* Información Básica */}
      <Section title="Información Básica">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Fecha">
            <input
              type="date" required
              value={form.fecha}
              onChange={e => set('fecha', e.target.value)}
              className={inputCls}
            />
          </Field>
          <Field label="Categoría">
            <select
              value={form.categoria}
              onChange={e => set('categoria', e.target.value as Categoria)}
              className={inputCls}
            >
              {CATEGORIAS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </Field>
          {form.categoria === 'ACTO_SERVICIO' && (
            <Field label="Tipo de Novedad">
              <select
                value={form.tipoActoServicio}
                onChange={e => set('tipoActoServicio', e.target.value as TipoActoServicio | '')}
                className={inputCls}
              >
                <option value="">Seleccionar tipo</option>
                {TIPOS_ACTO.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </Field>
          )}
          {form.categoria === 'EMERGENCIA' && (
            <Field label="Tipo de Emergencia" className="md:col-span-2">
              <select
                value={form.tipoEmergencia}
                onChange={e => set('tipoEmergencia', e.target.value)}
                className={inputCls}
              >
                <option value="">Seleccionar tipo</option>
                {EMERGENCIA_GROUPS.map(g => (
                  <optgroup key={g.groupLabel} label={g.groupLabel}>
                    {g.options.map(o => (
                      <option key={o.code} value={o.code}>{o.label}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </Field>
          )}
          <Field label="Dirección" className="md:col-span-2">
            <input
              type="text" required
              placeholder="Ej: Av. Libertador 1250, Santiago"
              value={form.direccion}
              onChange={e => set('direccion', e.target.value)}
              className={inputCls}
            />
          </Field>
        </div>
      </Section>

      {form.categoria !== 'ACTO_SERVICIO' && <>
      {/* Información del Vehículo */}
      <Section title="Información del Vehículo">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Vehículo">
            <select
              value={form.vehiculo}
              onChange={e => handleVehiculoChange(e.target.value)}
              className={inputCls}
            >
              <option value="">Seleccionar vehículo</option>
              {VEHICULOS.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </Field>
          <Field label="Conductor">
            <input
              type="text"
              placeholder="Nombre del conductor"
              value={form.conductor}
              onChange={e => set('conductor', e.target.value)}
              className={inputCls}
            />
          </Field>
          <Field label="Odómetro Anterior (km)">
            <input
              type="number" min="0"
              value={form.odometroAnterior}
              onChange={e => { set('odometroAnterior', e.target.value); setAutoLlenado(false) }}
              className={inputCls}
            />
            {autoLlenado && (
              <p className="text-xs text-green-700">
                Autocompletado con el último registro de {form.vehiculo}.
              </p>
            )}
          </Field>
          <Field label="Odómetro Actual (km)">
            <input
              type="number" min="0"
              value={form.odometroActual}
              onChange={e => set('odometroActual', e.target.value)}
              className={inputCls}
            />
          </Field>
          <Field label="Kilómetros Recorridos" className="md:col-span-2">
            <div className="bg-zinc-100 border border-zinc-200 rounded-lg px-3 py-2 font-semibold text-zinc-900">
              {kmRecorridos} km
            </div>
          </Field>
        </div>
      </Section>

      {/* Registro de Tiempos */}
      <Section title="Registro de Tiempos">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field label="Hora de Salida">
            <input
              type="time"
              value={form.horaSalida}
              onChange={e => set('horaSalida', e.target.value)}
              className={inputCls}
            />
          </Field>
          <Field label="Hora de Llegada al Lugar">
            <input
              type="time"
              value={form.horaLlegada}
              onChange={e => set('horaLlegada', e.target.value)}
              className={inputCls}
            />
          </Field>
          <Field label="Hora de Regreso">
            <input
              type="time"
              value={form.horaRegreso}
              onChange={e => set('horaRegreso', e.target.value)}
              className={inputCls}
            />
          </Field>
        </div>
      </Section>

      {/* Recarga y Materiales */}
      <Section title="Recarga y Materiales">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <CheckCard
            label="¿Pasó a cargar combustible?"
            checked={form.pasoCombustible}
            onChange={v => set('pasoCombustible', v)}
          />
          <CheckCard
            label="¿Pasó a buscar material?"
            checked={form.pasoMaterial}
            onChange={v => set('pasoMaterial', v)}
          />
        </div>
      </Section>

      {/* Gestión de Personal */}
      <Section title="Gestión de Personal">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field label="Voluntarios Honorarios">
            <input
              type="number" min="0"
              value={form.voluntariosHonorarios}
              onChange={e => set('voluntariosHonorarios', e.target.value)}
              className={inputCls}
            />
          </Field>
          <Field label="Voluntarios Activos">
            <input
              type="number" min="0"
              value={form.voluntariosActivos}
              onChange={e => set('voluntariosActivos', e.target.value)}
              className={inputCls}
            />
          </Field>
          <Field label="Otras Compañías">
            <input
              type="number" min="0"
              value={form.otrasCompanias}
              onChange={e => set('otrasCompanias', e.target.value)}
              className={inputCls}
            />
          </Field>
          <Field label="Total de Personal" className="md:col-span-3">
            <div className="bg-zinc-100 border border-zinc-200 rounded-lg px-3 py-2 font-semibold text-zinc-900">
              {totalPersonal}
            </div>
          </Field>
        </div>
      </Section>

      {/* Información de Liderazgo */}
      <Section title="Información de Liderazgo">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Oficial o Voluntario a Cargo de la Compañía">
            <input
              type="text"
              value={form.oficialCargoCompania}
              onChange={e => set('oficialCargoCompania', e.target.value)}
              className={inputCls}
            />
          </Field>
          <Field label="Oficial o Voluntario a Cargo del Cuerpo">
            <input
              type="text"
              value={form.oficialCargoCuerpo}
              onChange={e => set('oficialCargoCuerpo', e.target.value)}
              className={inputCls}
            />
          </Field>
        </div>
      </Section>

      </>}

      {/* Información Adicional */}
      <Section title="Información Adicional">
        <Field label="Observaciones">
          <textarea
            rows={4}
            placeholder="Detalles adicionales del incidente..."
            value={form.observaciones}
            onChange={e => set('observaciones', e.target.value)}
            className={`${inputCls} resize-y`}
          />
        </Field>
      </Section>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="flex justify-end gap-3">
        <Link
          href="/"
          className="border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50 px-5 py-2 rounded-md text-sm font-medium transition-colors"
        >
          Cancelar
        </Link>
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-60 shadow-sm"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
            <polyline points="17 21 17 13 7 13 7 21" />
            <polyline points="7 3 7 8 15 8" />
          </svg>
          {saving ? 'Guardando…' : isEdit ? 'Actualizar Incidente' : 'Guardar Incidente'}
        </button>
      </div>
    </form>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm">
      <h3 className="font-semibold text-zinc-900 pb-3 mb-4 border-b border-zinc-100">
        {title}
      </h3>
      {children}
    </section>
  )
}

function Field({
  label,
  children,
  className = '',
}: {
  label: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label className="text-sm font-medium text-zinc-700">{label}</label>
      {children}
    </div>
  )
}

function CheckCard({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <label className="flex items-center gap-3 border border-red-200 rounded-lg px-4 py-3 cursor-pointer hover:bg-red-50 transition-colors">
      <input
        type="checkbox"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        className="w-4 h-4 accent-red-600 rounded"
      />
      <span className="text-sm text-zinc-700">{label}</span>
    </label>
  )
}

const inputCls =
  'w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent placeholder:text-zinc-400'
