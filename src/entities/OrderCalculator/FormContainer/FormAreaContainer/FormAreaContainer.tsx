import { PropsWithChildren, useCallback, useState } from 'react'

import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from '@mui/material'

import useStyles from './FormAreaContainer.styles'

type Props = {
  title: string
}

export function FormAreaContainer({ title, children }: PropsWithChildren<Props>) {
  const classes = useStyles()
  const [isExpanded, setExpanded] = useState(true)
  const handleAccordionChange = useCallback(() => setExpanded(prev => !prev), [])

  return (
    <Accordion defaultExpanded expanded={isExpanded} className={classes.accordionContainer}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon className={classes.accordionIcon} onClick={handleAccordionChange} />}
      >
        <Box gridColumn="1 / -1" minWidth="min-content">
          <Typography className={classes.title}>{title}</Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails>{children}</AccordionDetails>
    </Accordion>
  )
}
