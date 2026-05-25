import { type ClientSchema, a, defineData } from '@aws-amplify/backend'

const schema = a.schema({
  Incidente: a
    .model({
      fecha: a.date().required(),
      categoria: a.enum([
        'ACTO_SERVICIO',
        'EMERGENCIA',
        'CITACION',
        'OTRO',
      ]),
      tipoActoServicio: a.enum([
        'SESION_COMPANIA',
        'JUNTA_OFICIALES',
        'CONSEJO_DISCIPLINA',
        'ACADEMIA_COMPANIA',
        'PRESTAMO_MATERIAL',
        'EJERCICIOS',
        'INGRESO_PERSONAL_EXTERNO',
        'MATERIAL_MAYOR_COMBUSTIBLE',         // 6-14
        'MATERIAL_MAYOR_CENTRO_ASISTENCIAL',  // 6-15
        'OTRO',
      ]),
      tipoEmergencia: a.string(),
      direccion: a.string().required(),

      // Vehículo
      vehiculo: a.string(),
      conductor: a.string(),
      odometroAnterior: a.integer(),
      odometroActual: a.integer(),

      // Tiempos
      horaSalida: a.time(),
      horaLlegada: a.time(),
      horaRegreso: a.time(),

      // Recarga / materiales
      pasoCombustible: a.boolean(),
      pasoMaterial: a.boolean(),

      // Personal
      voluntariosHonorarios: a.integer(),
      voluntariosActivos: a.integer(),
      otrasCompanias: a.integer(),

      // Liderazgo
      oficialCargoCompania: a.string(),
      oficialCargoCuerpo: a.string(),

      // Adicional
      observaciones: a.string(),

      // Auditoría
      registradoPor: a.string(),
    })
    .authorization((allow) => [allow.authenticated()]),
})

export type Schema = ClientSchema<typeof schema>

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
})
