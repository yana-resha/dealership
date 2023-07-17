import { PropsWithChildren } from 'react'

import { Box, Button } from '@mui/material'

import { CircularProgressWheel } from 'shared/ui/CircularProgressWheel/CircularProgressWheel'

import useStyles from './AreaFooter.styles'

type Props = {
  btnTitle: string
  btnType?: 'submit' | 'reset' | 'button'
  onClickBtn?: () => void
  disabled?: boolean
  isLoadingBtn?: boolean
}

export function AreaFooter({
  btnTitle,
  btnType,
  onClickBtn,
  disabled = false,
  isLoadingBtn = false,
  children,
}: PropsWithChildren<Props>) {
  const classes = useStyles()

  return (
    <Box className={classes.footerContainer} gridColumn="1 / -1">
      {children}

      <Button
        type={btnType}
        className={classes.submitBtn}
        variant="contained"
        onClick={onClickBtn}
        disabled={disabled || isLoadingBtn}
      >
        {isLoadingBtn ? <CircularProgressWheel size="small" /> : btnTitle}
      </Button>
    </Box>
  )
}
