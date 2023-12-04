import { PropsWithChildren } from 'react'

import { Button } from '@mui/material'
import cx from 'classnames'

import useStyles from './SquareBtn.styles'

type Props = {
  onClick: () => void
  disabled?: boolean
  testId?: string
  className?: string
}

export const SquareBtn = ({
  onClick,
  disabled = false,
  testId = '',
  className,
  children,
}: PropsWithChildren<Props>) => {
  const classes = useStyles()

  return (
    <Button
      size="small"
      className={cx(classes.button, className)}
      variant="outlined"
      onClick={onClick}
      disabled={disabled}
      data-testid={testId}
    >
      {children}
    </Button>
  )
}
