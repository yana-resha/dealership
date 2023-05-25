import { PropsWithChildren, useCallback, useState } from 'react'

import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from '@mui/material'

import useStyles from './CollapsibleFormAreaContainer.styles'

type Props = {
  title: string
  disabled?: boolean
  shouldExpanded?: boolean
}

export function CollapsibleFormAreaContainer({
  title,
  children,
  disabled = false,
  shouldExpanded,
}: PropsWithChildren<Props>) {
  const classes = useStyles()
  const [isExpanded, setExpanded] = useState(true)
  const handleAccordionChange = useCallback(() => setExpanded(prev => !prev), [])

  return (
    <Accordion
      defaultExpanded
      expanded={shouldExpanded ?? isExpanded}
      className={classes.accordionContainer}
      disabled={disabled}
      data-testid={`accordion-${title}`}
    >
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
