import React from 'react'

import { Tooltip, TooltipProps } from '@mui/material'

import useStyles from './CustomTooltip.styles'

export const CustomTooltip = React.memo((props: React.PropsWithChildren<TooltipProps>) => {
  const styles = useStyles()

  return (
    <Tooltip {...props} classes={{ tooltip: styles.tooltip, arrow: styles.tooltipArrow }}>
      <div className={styles.childrenContainer}>{props.children}</div>
    </Tooltip>
  )
})
