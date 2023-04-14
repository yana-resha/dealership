import { PropsWithChildren } from 'react'

import { Box } from '@mui/material'

import { theme } from 'app/theme'

type Props = {
  bgColor?: string
  color?: string
}

export const Status = ({ bgColor, color, children }: PropsWithChildren<Props>) => (
  <Box
    bgcolor={bgColor ?? theme.palette.sber.main}
    py={0.625}
    px={2}
    lineHeight="18px"
    width="fit-content"
    borderRadius={1}
    color={color ?? theme.palette.common.white}
    whiteSpace="nowrap"
  >
    {children}
  </Box>
)
