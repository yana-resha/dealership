import { PropsWithChildren } from 'react'

import { Button } from '@mui/material'

import useStyles from './SquareBtn.styles'

type Props = {
  onClick: () => void
  disabled?: boolean
  testId?: string
}

export const SquareBtn = ({ onClick, disabled = false, testId = '', children }: PropsWithChildren<Props>) => {
  const classes = useStyles()

  return (
    <Button
      size="small"
      className={classes.button}
      variant="outlined"
      onClick={onClick}
      disabled={disabled}
      data-testid={testId}
    >
      {children}
    </Button>
  )
}
