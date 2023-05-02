import { PropsWithChildren } from 'react'

import { Button } from '@mui/material'

import useStyles from './SquareBtn.styles'

type Props = {
  onClick: () => void
  testId?: string
}

export const SquareBtn = ({ onClick, testId = '', children }: PropsWithChildren<Props>) => {
  const classes = useStyles()

  return (
    <Button size="small" className={classes.button} variant="outlined" onClick={onClick} data-testid={testId}>
      {children}
    </Button>
  )
}
