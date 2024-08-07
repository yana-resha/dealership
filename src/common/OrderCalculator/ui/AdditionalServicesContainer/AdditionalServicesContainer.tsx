import React, { PropsWithChildren, useCallback, useEffect, useState } from 'react'

import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from '@mui/material'
import { useField, useFormikContext } from 'formik'

import { ReactComponent as OrderCreateIcon } from 'assets/icons/orderCreate.svg'
import {
  FullInitialAdditionalEquipments,
  FullInitialAdditionalService,
  OrderCalculatorAdditionalService,
  OrderCalculatorBankAdditionalService,
} from 'common/OrderCalculator/types'
import { usePrevious } from 'shared/hooks/usePrevious'

import useStyles from './AdditionalServicesContainer.styles'
import { AdditionalServicesContainerProvider } from './AdditionalServicesContainerProvider'

const DEFAULT_ERROR_MESSAGE = 'Произошла ошибка при получении данных. Перезагрузите страницу'

type AdditionalService =
  | OrderCalculatorAdditionalService
  | OrderCalculatorBankAdditionalService
  | FullInitialAdditionalService
  | FullInitialAdditionalEquipments
type Props = {
  title: string
  name: string
  initialValues: AdditionalService
  isShouldExpanded: boolean
  resetShouldExpanded: () => void
  disabled?: boolean
  isError?: boolean
  errorMessage?: string
  isInitialExpanded?: boolean
  icon?: React.ReactNode
}
export const AdditionalServicesContainer = React.memo(
  ({
    title,
    name,
    initialValues,
    isShouldExpanded,
    resetShouldExpanded,
    disabled = false,
    isError = false,
    errorMessage,
    isInitialExpanded = false,
    icon,
    children,
  }: PropsWithChildren<Props>) => {
    const classes = useStyles()

    const [expanded, setExpanded] = useState(isInitialExpanded)

    const changeExpanded = useCallback(() => setExpanded(prev => !prev), [])
    const closeAccordion = useCallback(() => {
      setExpanded(false)
    }, [])

    const [field, , { setValue: setServices }] = useField<AdditionalService[]>(name)
    const { submitCount } = useFormikContext()
    const prevSubmitCount = usePrevious(submitCount)

    const handleIconClick = useCallback((evt: React.MouseEvent<HTMLDivElement>) => {
      evt.preventDefault()
      evt.stopPropagation()
    }, [])

    useEffect(() => {
      if (prevSubmitCount === submitCount) {
        return
      }
      const newValue = field.value.filter((value: AdditionalService) => !!value.productType)
      setServices(newValue.length ? newValue : [initialValues])
    }, [closeAccordion, field.name, field.value, initialValues, prevSubmitCount, setServices, submitCount])

    useEffect(() => {
      if (isShouldExpanded) {
        setExpanded(true)
        resetShouldExpanded()
      }
    }, [isShouldExpanded, resetShouldExpanded])

    return (
      <Accordion
        disableGutters
        disabled={disabled}
        className={classes.accordionContainer}
        expanded={expanded}
      >
        <AccordionSummary
          onClick={changeExpanded}
          expandIcon={<OrderCreateIcon className={classes.summaryIcon} />}
        >
          <Box>
            <Typography className={classes.title}>{title}</Typography>
            {isError && (
              <Typography className={classes.errorMessage}>
                {errorMessage || DEFAULT_ERROR_MESSAGE}
              </Typography>
            )}
          </Box>
          {!!icon && (
            <Box className={classes.iconContainer} onClick={handleIconClick}>
              {icon}
            </Box>
          )}
        </AccordionSummary>

        <AdditionalServicesContainerProvider closeAccordion={closeAccordion}>
          <AccordionDetails>{children}</AccordionDetails>
        </AdditionalServicesContainerProvider>
      </Accordion>
    )
  },
)
