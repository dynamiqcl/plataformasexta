// Clasificación oficial de emergencias (códigos 10-X)
// Estructurada en grupos para usar con <optgroup>

export type EmergenciaOption = { code: string; label: string }
export type EmergenciaGroup  = { groupLabel: string; options: EmergenciaOption[] }

export const EMERGENCIA_GROUPS: EmergenciaGroup[] = [
  {
    groupLabel: '10-0 Llamado Estructural',
    options: [
      { code: '10-0',   label: '10-0 — Estructural (general)' },
      { code: '10-0-1', label: '10-0-1 — Básico (hasta 3 pisos)' },
      { code: '10-0-2', label: '10-0-2 — Edificio (4 o más pisos)' },
      { code: '10-0-3', label: '10-0-3 — Lugar público (en horario de funcionamiento)' },
      { code: '10-0-4', label: '10-0-4 — Poblaciones (material ligero, cités)' },
      { code: '10-0-5', label: '10-0-5 — Haz Mat' },
      { code: '10-0-6', label: '10-0-6 — Edificio patrimonial' },
    ],
  },
  {
    groupLabel: '10-1 Llamado a Vehículos',
    options: [
      { code: '10-1',   label: '10-1 — Vehículos (general)' },
      { code: '10-1-1', label: '10-1-1 — Automóvil' },
      { code: '10-1-2', label: '10-1-2 — Autobús' },
      { code: '10-1-3', label: '10-1-3 — Camión de basura o reciclaje' },
      { code: '10-1-4', label: '10-1-4 — Automóvil tras colisión o choque' },
      { code: '10-1-5', label: '10-1-5 — Transporte de combustibles o mat. peligrosos' },
      { code: '10-1-6', label: '10-1-6 — Automóvil/camión de transporte de gas' },
      { code: '10-1-7', label: '10-1-7 — Vehículo eléctrico' },
      { code: '10-1-8', label: '10-1-8 — Vehículo en túnel de autopistas' },
    ],
  },
  {
    groupLabel: '10-2 Pastizales / Basura',
    options: [
      { code: '10-2', label: '10-2 — Pastizales y/o basura' },
    ],
  },
  {
    groupLabel: '10-3 Llamado a Rescate de Emergencia',
    options: [
      { code: '10-3',   label: '10-3 — Rescate de emergencia (general)' },
      { code: '10-3-1', label: '10-3-1 — Simple' },
      { code: '10-3-2', label: '10-3-2 — Reforzado, complejo' },
      { code: '10-3-3', label: '10-3-3 — En caudal de río' },
      { code: '10-3-4', label: '10-3-4 — En altura sobre 4º piso' },
      { code: '10-3-5', label: '10-3-5 — Con riesgo de caída' },
      { code: '10-3-6', label: '10-3-6 — En espacios confinados' },
      { code: '10-3-7', label: '10-3-7 — En derrumbes' },
      { code: '10-3-8', label: '10-3-8 — Riesgo vital / atropello (uso de DAE)' },
      { code: '10-3-9', label: '10-3-9 — En zonas agrestes' },
    ],
  },
  {
    groupLabel: '10-4 Llamado a Rescate Vehicular',
    options: [
      { code: '10-4',   label: '10-4 — Rescate vehicular (general)' },
      { code: '10-4-1', label: '10-4-1 — Hasta 4 lesionados o atrapados' },
      { code: '10-4-2', label: '10-4-2 — 5 o más lesionados o atrapados' },
      { code: '10-4-3', label: '10-4-3 — Con relación Haz-Mat' },
    ],
  },
  {
    groupLabel: '10-5 Llamado Haz-Mat',
    options: [
      { code: '10-5',   label: '10-5 — Haz-Mat (general)' },
      { code: '10-5-1', label: '10-5-1 — Derrame ≤ 200 L / saco 25 kg / olor desconocido' },
      { code: '10-5-2', label: '10-5-2 — Derrame > 200 L y < IBC 1.000 L (o sacos 25-1000 kg)' },
      { code: '10-5-3', label: '10-5-3 — Emergencia química industrial mayor' },
      { code: '10-5-4', label: '10-5-4 — Atentado terrorista QBR' },
      { code: '10-5-5', label: '10-5-5 — Cianuro: accidente o intento de suicidio' },
    ],
  },
  {
    groupLabel: '10-6 Llamado a emanación de Gas',
    options: [
      { code: '10-6',   label: '10-6 — Emanación de gas (general)' },
      { code: '10-6-1', label: '10-6-1 — Emanación u olor a gas' },
      { code: '10-6-2', label: '10-6-2 — Con personas al interior de casa' },
      { code: '10-6-3', label: '10-6-3 — Con personas en departamento sobre 3º piso' },
    ],
  },
  {
    groupLabel: '10-7 Llamado Eléctrico',
    options: [
      { code: '10-7',   label: '10-7 — Eléctrico (general)' },
      { code: '10-7-1', label: '10-7-1 — Habitacional / Comercial / Industrial' },
      { code: '10-7-2', label: '10-7-2 — Cámara, transformador, subestación' },
    ],
  },
  {
    groupLabel: '10-8 / 10-9 — Otros',
    options: [
      { code: '10-8', label: '10-8 — Llamado no clasificado' },
      { code: '10-9', label: '10-9 — Llamado a otros servicios' },
    ],
  },
  {
    groupLabel: '10-10 Llamado a Escombros',
    options: [
      { code: '10-10',   label: '10-10 — Escombros (general)' },
      { code: '10-10-1', label: '10-10-1 — Escombros estructural' },
      { code: '10-10-2', label: '10-10-2 — Escombros forestal' },
    ],
  },
  {
    groupLabel: '10-11 — 10-15 — Servicios especiales',
    options: [
      { code: '10-11', label: '10-11 — Servicio aéreo' },
      { code: '10-12', label: '10-12 — Apoyo a otros Cuerpos' },
      { code: '10-13', label: '10-13 — Atentados terroristas' },
      { code: '10-14', label: '10-14 — Accidentes aéreos' },
      { code: '10-15', label: '10-15 — Simulacro' },
    ],
  },
  {
    groupLabel: '10-16 Llamado en Túnel',
    options: [
      { code: '10-16',   label: '10-16 — En túnel (general)' },
      { code: '10-16-0', label: '10-16-0 — Fuego o emanación de humo' },
      { code: '10-16-3', label: '10-16-3 — Rescate por derrumbe / colapso' },
      { code: '10-16-4', label: '10-16-4 — Personas atrapadas en vehículos' },
      { code: '10-16-5', label: '10-16-5 — Materiales peligrosos en túnel' },
    ],
  },
  {
    groupLabel: '10-17 Llamado en Metro / Ferrocarriles',
    options: [
      { code: '10-17',   label: '10-17 — Metro/tren (general)' },
      { code: '10-17-0', label: '10-17-0 — Fuego en estación' },
      { code: '10-17-1', label: '10-17-1 — Fuego en vagón' },
      { code: '10-17-2', label: '10-17-2 — Persona caída en estación' },
      { code: '10-17-3', label: '10-17-3 — Persona bajo vagón' },
      { code: '10-17-4', label: '10-17-4 — Colisión o descarrilamiento' },
      { code: '10-17-5', label: '10-17-5 — Haz-Mat en estación o tren' },
      { code: '10-17-6', label: '10-17-6 — Emanación de gas en estación o tren' },
      { code: '10-17-7', label: '10-17-7 — Eléctrico en estación o tren' },
      { code: '10-17-8', label: '10-17-8 — No clasificado en estación o tren' },
    ],
  },
  {
    groupLabel: '10-18 Llamado límite con otro Cuerpo de Bomberos',
    options: [
      { code: '10-18',   label: '10-18 — Límite (general)' },
      { code: '10-18-0', label: '10-18-0 — Despacho límite a 10-0' },
      { code: '10-18-1', label: '10-18-1 — Despacho límite a 10-1' },
      { code: '10-18-2', label: '10-18-2 — Despacho límite a 10-2' },
      { code: '10-18-3', label: '10-18-3 — Despacho límite a 10-3' },
      { code: '10-18-4', label: '10-18-4 — Despacho límite a 10-4' },
      { code: '10-18-5', label: '10-18-5 — Despacho límite a 10-5' },
      { code: '10-18-6', label: '10-18-6 — Despacho límite a 10-6' },
      { code: '10-18-7', label: '10-18-7 — Despacho límite a 10-7' },
      { code: '10-18-8', label: '10-18-8 — Despacho límite a 10-8' },
    ],
  },
]

let _flat: Map<string, string> | null = null

export function labelEmergencia(code: string | null | undefined): string {
  if (!code) return '—'
  if (!_flat) {
    _flat = new Map()
    for (const g of EMERGENCIA_GROUPS)
      for (const o of g.options) _flat.set(o.code, o.label)
  }
  return _flat.get(code) ?? code
}
