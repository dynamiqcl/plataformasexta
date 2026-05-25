'use client'

import { Authenticator } from '@aws-amplify/ui-react'
import Header from './Header'

export default function AuthGate({ children }: { children: React.ReactNode }) {
  return (
    <Authenticator loginMechanisms={['email']} signUpAttributes={['email']}>
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
