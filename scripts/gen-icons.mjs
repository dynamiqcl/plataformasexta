import sharp from 'sharp'
import { writeFileSync, mkdirSync } from 'fs'

mkdirSync('public/icons', { recursive: true })

// SVG: cuadrado rojo con casco de bombero blanco simple
const svg = (size, padding = 0) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="${padding ? 0 : 96}" fill="#dc2626"/>
  <g fill="#fff" transform="translate(256 280) scale(7)">
    <path d="M0 -28 C-5 -22 -10 -14 -8 -4 C-12 -8 -14 -12 -16 -16 C-18 -8 -22 0 -18 8 C-14 4 -12 0 -10 -2 C-10 4 -12 10 -8 14 C-4 10 -2 4 0 -2 C2 4 4 10 8 14 C12 10 10 4 10 -2 C12 0 14 4 18 8 C22 0 18 -8 16 -16 C14 -12 12 -8 8 -4 C10 -14 5 -22 0 -28 Z"/>
  </g>
  <text x="256" y="430" font-family="Arial,sans-serif" font-size="68" font-weight="700"
        text-anchor="middle" fill="#fff" letter-spacing="2">6ª</text>
</svg>
`

const sizes = [
  { name: 'icon-192.png', size: 192, maskable: false },
  { name: 'icon-512.png', size: 512, maskable: false },
  { name: 'icon-maskable-512.png', size: 512, maskable: true },
  { name: 'apple-icon-180.png', size: 180, maskable: false },
]

for (const { name, size, maskable } of sizes) {
  // maskable: sin esquinas redondeadas (rect completo)
  const buffer = Buffer.from(svg(size, maskable ? 1 : 0))
  await sharp(buffer).resize(size, size).png().toFile(`public/icons/${name}`)
  console.log(`✓ public/icons/${name}`)
}

// favicon SVG (más simple, sin texto)
const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="96" fill="#dc2626"/>
  <g fill="#fff" transform="translate(256 320) scale(9)">
    <path d="M0 -28 C-5 -22 -10 -14 -8 -4 C-12 -8 -14 -12 -16 -16 C-18 -8 -22 0 -18 8 C-14 4 -12 0 -10 -2 C-10 4 -12 10 -8 14 C-4 10 -2 4 0 -2 C2 4 4 10 8 14 C12 10 10 4 10 -2 C12 0 14 4 18 8 C22 0 18 -8 16 -16 C14 -12 12 -8 8 -4 C10 -14 5 -22 0 -28 Z"/>
  </g>
</svg>`
writeFileSync('public/icon.svg', faviconSvg)
console.log('✓ public/icon.svg')
