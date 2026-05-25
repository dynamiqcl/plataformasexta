'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Header({
  userEmail,
  onSignOut,
}: {
  userEmail: string
  onSignOut: () => void
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [userOpen, setUserOpen] = useState(false)

  return (
    <header className="bg-red-600 text-white shadow-md relative">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMenuOpen(o => !o)}
            className="p-2 rounded-md hover:bg-red-700 transition-colors"
            aria-label="Menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <span className="text-xl" aria-hidden>🔥</span>
          <h1 className="font-semibold text-base sm:text-lg">
            Sistema de Registro de Incidentes
          </h1>
        </div>

        <div className="flex items-center gap-3 relative">
          <div className="text-right hidden sm:block leading-tight">
            <div className="text-xs text-red-100">Administrador</div>
            <div className="text-sm font-medium">{userEmail || 'Usuario'}</div>
          </div>
          <button
            onClick={() => setUserOpen(o => !o)}
            className="w-9 h-9 rounded-full bg-red-700 hover:bg-red-800 flex items-center justify-center transition-colors"
            aria-label="Usuario"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21c0-4 4-7 8-7s8 3 8 7" />
            </svg>
          </button>

          {userOpen && (
            <div className="absolute right-0 top-12 bg-white text-zinc-800 rounded-lg shadow-xl border border-zinc-200 min-w-[200px] overflow-hidden z-20">
              <div className="px-4 py-3 text-sm border-b border-zinc-100">
                <div className="text-xs text-zinc-500">Sesión iniciada como</div>
                <div className="font-medium truncate">{userEmail}</div>
              </div>
              <button
                onClick={() => { setUserOpen(false); onSignOut() }}
                className="w-full text-left px-4 py-2.5 text-sm hover:bg-zinc-50 transition-colors"
              >
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>

      {menuOpen && (
        <nav className="absolute left-0 top-full bg-white text-zinc-800 shadow-xl border border-zinc-200 rounded-br-lg min-w-[220px] z-20">
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            className="block px-4 py-3 text-sm hover:bg-zinc-50 border-b border-zinc-100"
          >
            📋 Listado de Incidentes
          </Link>
          <Link
            href="/incidentes/nuevo"
            onClick={() => setMenuOpen(false)}
            className="block px-4 py-3 text-sm hover:bg-zinc-50"
          >
            ➕ Registrar Incidente
          </Link>
        </nav>
      )}
    </header>
  )
}
