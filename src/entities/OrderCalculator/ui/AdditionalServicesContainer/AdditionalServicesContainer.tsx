import { PropsWithChildren } from 'react'

import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from '@mui/material'

import { ReactComponent as OrderCreateIcon } from 'assets/icons/orderCreate.svg'

import useStyles from './AdditionalServicesContainer.styles'

type Props = {
  title: string
  disabled?: boolean
}

export function AdditionalServicesContainer({ title, disabled = false, children }: PropsWithChildren<Props>) {
  const classes = useStyles()

  return (
    <Accordion disableGutters disabled={disabled} className={classes.accordionContainer}>
      <AccordionSummary expandIcon={<OrderCreateIcon className={classes.summaryIcon} />}>
        <Box gridColumn="1 / -1" minWidth="min-content">
          <Typography className={classes.title}>{title}</Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails>{children}</AccordionDetails>
    </Accordion>
  )
}
