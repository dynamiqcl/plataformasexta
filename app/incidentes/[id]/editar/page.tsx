import AuthGate from '@/app/components/AuthGate'
import IncidenteEditor from '@/app/components/IncidenteEditor'

export default async function EditarIncidentePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return (
    <AuthGate>
      <IncidenteEditor id={id} />
    </AuthGate>
  )
}
