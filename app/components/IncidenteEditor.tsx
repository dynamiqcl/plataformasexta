'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { generateClient } from 'aws-amplify/data'
import type { Schema } from '@/amplify/data/resource'
import type { Incidente } from '@/app/lib/incidente'
import IncidenteForm from './IncidenteForm'

const client = generateClient<Schema>()

export default function IncidenteEditor({ id }: { id: string }) {
  const [incidente, setIncidente] = useState<Incidente | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true); setError(null)
    client.models.Incidente.get({ id }).then(({ data, errors }) => {
      if (cancelled) return
      if (errors?.length) { setError(errors[0].message); return }
      if (!data) { setError('Incidente no encontrado.'); return }
      setIncidente(data)
    }).catch(e => {
      if (!cancelled) setError(e instanceof Error ? e.message : 'Error al cargar')
    }).finally(() => {
      if (!cancelled) setLoading(false)
    })
    return () => { cancelled = true }
  }, [id])

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-16 text-center text-zinc-400 text-sm">Cargando incidente…</div>
  }
  if (error || !incidente) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error ?? 'Incidente no encontrado.'}
        </div>
        <Link href="/" className="inline-block mt-4 text-sm text-blue-600 hover:underline">
          ← Volver al listado
        </Link>
      </div>
    )
  }
  return <IncidenteForm incidente={incidente} />
}
