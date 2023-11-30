import { LoginForm } from 'common/auth'
import { AuthWrapper } from 'entities/AuthWrapper'

export function Auth() {
  return (
    <AuthWrapper dataTestId="authPage">
      <LoginForm />
    </AuthWrapper>
  )
}
