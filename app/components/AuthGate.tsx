'use client'

import { Authenticator, translations } from '@aws-amplify/ui-react'
import { I18n } from 'aws-amplify/utils'
import Header from './Header'

I18n.putVocabularies(translations)
I18n.setLanguage('es')

// Algunas traducciones puntuales más naturales para Chile.
I18n.putVocabulariesForLanguage('es', {
  'Sign In': 'Iniciar sesión',
  'Sign in': 'Ingresar',
  'Sign in to your account': 'Ingresa a tu cuenta',
  'Create Account': 'Crear cuenta',
  'Email': 'Correo electrónico',
  'Enter your Email': 'Ingresa tu correo',
  'Password': 'Contraseña',
  'Enter your Password': 'Ingresa tu contraseña',
  'Confirm Password': 'Confirma la contraseña',
  'Please confirm your Password': 'Confirma tu contraseña',
  'Forgot your password?': '¿Olvidaste tu contraseña?',
  'Reset Password': 'Recuperar contraseña',
  'Send code': 'Enviar código',
  'Submit': 'Confirmar',
  'Confirmation Code': 'Código de verificación',
  'Enter your Confirmation Code': 'Ingresa el código que llegó a tu correo',
})

function LoginBrand() {
  return (
    <div className="text-center pb-6 pt-2">
      <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-white/95 flex items-center justify-center shadow-lg ring-1 ring-white/30">
        <span className="text-4xl" aria-hidden>🔥</span>
      </div>
      <h1 className="text-3xl font-bold text-white tracking-tight drop-shadow-sm">6ª Compañía</h1>
      <p className="text-sm text-red-100 mt-1.5">Sistema de Registro de Incidentes</p>
    </div>
  )
}

export default function AuthGate({ children }: { children: React.ReactNode }) {
  return (
    <Authenticator
      loginMechanisms={['email']}
      signUpAttributes={['email']}
      components={{ Header: LoginBrand }}
    >
      {({ signOut, user }) => (
        <div className="min-h-screen flex flex-col">
          <Header
            userEmail={user?.signInDetails?.loginId ?? ''}
            onSignOut={signOut ?? (() => {})}
          />
          <div className="flex-1 bg-zinc-50">{children}</div>
        </div>
      )}
    </Authenticator>
  )
}
