import { PropsWithChildren } from 'react'

import { Box, Button, CircularProgress } from '@mui/material'

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
        disabled={disabled}
      >
        {isLoadingBtn ? <CircularProgress color="inherit" size={25} /> : btnTitle}
      </Button>
    </Box>
  )
}
