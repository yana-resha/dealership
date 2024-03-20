import { ReactComponent as TeamIdLogo } from 'assets/icons/teamIdLogo.svg'
import { LoginWrapper } from 'entities/LoginWrapper/LoginWrapper'

import { useStyles } from './TrainingAuth.styles'
import { TrainingLoginForm } from './TrainingLoginForm/TrainingLoginForm'

export function TrainingAuth() {
  const classes = useStyles()
  const logo = <TeamIdLogo className={classes.logo} />

  return (
    <LoginWrapper title="Ваш аккаунт" subtitle="С помощью Team ID" logo={logo}>
      <TrainingLoginForm />
    </LoginWrapper>
  )
}
