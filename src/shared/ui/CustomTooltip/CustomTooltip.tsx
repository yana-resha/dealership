import React from 'react'

import { Tooltip, TooltipProps } from '@mui/material'
import cx from 'classnames'

import useStyles from './CustomTooltip.styles'

export const CustomTooltip = React.memo((props: React.PropsWithChildren<TooltipProps>) => {
  const styles = useStyles()

  return (
    <Tooltip
      {...props}
      classes={{
        tooltip: cx(styles.tooltip, props.classes?.tooltip),
        arrow: cx(styles.tooltipArrow, props.classes?.tooltipArrow),
      }}
    >
      {props.children}
    </Tooltip>
  )
})
