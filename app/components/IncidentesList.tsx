'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { generateClient } from 'aws-amplify/data'
import type { Schema } from '@/amplify/data/resource'
import { useRouter } from 'next/navigation'
import {
  type Incidente,
  formatFecha, formatDateTime,
  labelCategoria, labelTipoActo,
} from '@/app/lib/incidente'
import { labelEmergencia } from '@/app/lib/emergencias'

function labelTipo(i: Incidente): string {
  if (i.categoria === 'ACTO_SERVICIO') return labelTipoActo(i.tipoActoServicio)
  if (i.categoria === 'EMERGENCIA')    return labelEmergencia(i.tipoEmergencia)
  return '—'
}

const client = generateClient<Schema>()

export default function IncidentesList() {
  const router = useRouter()
  const [items, setItems] = useState<Incidente[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const cargar = useCallback(async () => {
    setLoading(true); setError(null)
    try {
      const { data, errors } = await client.models.Incidente.list()
      if (errors?.length) throw new Error(errors[0].message)
      const sorted = [...data].sort((a, b) =>
        (b.createdAt ?? '').localeCompare(a.createdAt ?? '')
      )
      setItems(sorted)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { cargar() }, [cargar])

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col gap-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900">Incidentes</h2>
          <p className="text-sm text-zinc-500 mt-1">
            Registro histórico de actos de servicio
          </p>
        </div>
        <Link
          href="/incidentes/nuevo"
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium shadow-sm transition-colors"
        >
          <span className="text-lg leading-none">+</span>
          Registrar Incidente
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
          <button onClick={cargar} className="ml-3 underline">Reintentar</button>
        </div>
      )}

      {loading ? (
        <div className="text-center py-16 text-zinc-400 text-sm">Cargando…</div>
      ) : items.length === 0 ? (
        <div className="bg-white border border-zinc-200 rounded-xl text-center py-16 flex flex-col items-center gap-3">
          <span className="text-4xl">📋</span>
          <div>
            <div className="text-zinc-700 font-medium">No hay incidentes registrados</div>
            <div className="text-sm text-zinc-500 mt-1">Empieza creando tu primer registro</div>
          </div>
          <Link
            href="/incidentes/nuevo"
            className="mt-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm"
          >
            Registrar Incidente
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-600 text-xs uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3 text-left">Fecha</th>
                <th className="px-4 py-3 text-left">Categoría</th>
                <th className="px-4 py-3 text-left">Tipo</th>
                <th className="px-4 py-3 text-left">Dirección</th>
                <th className="px-4 py-3 text-left">Vehículo</th>
                <th className="px-4 py-3 text-right">Personal</th>
                <th className="px-4 py-3 text-left">Registrado</th>
                <th className="px-4 py-3 text-left">Por</th>
                <th className="px-4 py-3 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {items.map(i => {
                const personal = (i.voluntariosHonorarios ?? 0)
                  + (i.voluntariosActivos ?? 0)
                  + (i.otrasCompanias ?? 0)
                const editar = () => router.push(`/incidentes/${i.id}/editar`)
                return (
                  <tr
                    key={i.id}
                    onClick={editar}
                    className="hover:bg-zinc-50 cursor-pointer"
                  >
                    <td className="px-4 py-3 text-zinc-900">{formatFecha(i.fecha)}</td>
                    <td className="px-4 py-3 text-zinc-700">{labelCategoria(i.categoria)}</td>
                    <td className="px-4 py-3 text-zinc-700">{labelTipo(i)}</td>
                    <td className="px-4 py-3 text-zinc-900">{i.direccion}</td>
                    <td className="px-4 py-3 text-zinc-700">{i.vehiculo ?? '—'}</td>
                    <td className="px-4 py-3 text-zinc-900 text-right tabular-nums">{personal}</td>
                    <td className="px-4 py-3 text-zinc-500 text-xs tabular-nums">{formatDateTime(i.createdAt)}</td>
                    <td className="px-4 py-3 text-zinc-700 text-xs truncate max-w-[160px]" title={i.registradoPor ?? ''}>
                      {i.registradoPor ?? '—'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/incidentes/${i.id}/editar`}
                        onClick={e => e.stopPropagation()}
                        className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                      >
                        Editar
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
