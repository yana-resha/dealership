import { PropsWithChildren } from 'react'

import { Box } from '@mui/material'

import { theme } from 'app/theme'

type Props = {
  bgColor?: string
}

export const Status = ({ bgColor, children }: PropsWithChildren<Props>) => (
  <Box
    bgcolor={bgColor ?? theme.palette.sber.main}
    py={1}
    px={2}
    borderRadius={1}
    color={theme.palette.common.white}
    whiteSpace="nowrap"
  >
    {children}
  </Box>
)
