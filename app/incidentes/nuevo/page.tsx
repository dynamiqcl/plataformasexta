import AuthGate from '@/app/components/AuthGate'
import IncidenteForm from '@/app/components/IncidenteForm'

export default function NuevoIncidentePage() {
  return (
    <AuthGate>
      <IncidenteForm />
    </AuthGate>
  )
}
