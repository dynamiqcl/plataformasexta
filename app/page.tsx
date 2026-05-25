import AuthGate from './components/AuthGate'
import IncidentesList from './components/IncidentesList'

export default function Home() {
  return (
    <AuthGate>
      <IncidentesList />
    </AuthGate>
  )
}
