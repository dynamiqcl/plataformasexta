import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Sistema de Registro de Incidentes — 6ª Compañía',
    short_name: 'Incidentes 6ª',
    description: 'Registro y seguimiento de actos de servicio e incidentes de la 6ª Compañía',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#ffffff',
    theme_color: '#dc2626',
    lang: 'es-CL',
    icons: [
      { src: '/icon.svg',                       sizes: 'any',     type: 'image/svg+xml', purpose: 'any' },
      { src: '/icons/icon-192.png',             sizes: '192x192', type: 'image/png',     purpose: 'any' },
      { src: '/icons/icon-512.png',             sizes: '512x512', type: 'image/png',     purpose: 'any' },
      { src: '/icons/icon-maskable-512.png',    sizes: '512x512', type: 'image/png',     purpose: 'maskable' },
    ],
  }
}
