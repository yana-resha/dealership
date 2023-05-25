import React, { PropsWithChildren } from 'react'

import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from '@mui/material'

import { ReactComponent as OrderCreateIcon } from 'assets/icons/orderCreate.svg'

import useStyles from './AdditionalServicesContainer.styles'

const DEFAULT_ERROR_MESSAGE = 'Произошла ошибка при получении данных. Перезагрузите страницу'

type Props = {
  title: string
  disabled?: boolean
  isError?: boolean
  errorMessage?: string
}
export const AdditionalServicesContainer = React.memo(
  ({ title, disabled = false, isError = false, errorMessage, children }: PropsWithChildren<Props>) => {
    const classes = useStyles()

    return (
      <Accordion disableGutters disabled={disabled} className={classes.accordionContainer}>
        <AccordionSummary expandIcon={<OrderCreateIcon className={classes.summaryIcon} />}>
          <Box gridColumn="1 / -1" minWidth="min-content">
            <Typography className={classes.title}>{title}</Typography>
            {isError && (
              <Typography className={classes.errorMessage}>
                {errorMessage || DEFAULT_ERROR_MESSAGE}
              </Typography>
            )}
          </Box>
        </AccordionSummary>
        <AccordionDetails>{children}</AccordionDetails>
      </Accordion>
    )
  },
)
