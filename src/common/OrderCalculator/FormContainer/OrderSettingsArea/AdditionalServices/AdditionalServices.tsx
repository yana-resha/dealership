import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from '@mui/material'
import { FieldArray, useField } from 'formik'

import { ReactComponent as OrderCreateIcon } from 'assets/icons/orderCreate.svg'
import { useAdditionalServiceIds } from 'entities/OrderCalculator'

import { AdditionalServiceItem } from './AdditionalServiceItem/AdditionalServiceItem'
import useStyles from './AdditionalServices.styles'

type Props = {
  title: string
  options: string[]
  name: string
  productLabel: string
  isError: boolean
  errorMessage?: string
  disabled?: boolean
}

const DEFAULT_ERROR_MESSAGE = 'Произошла ошибка при получении данных. Перезагрузите страницу'

export function AdditionalServices(props: Props) {
  const { title, options, name, productLabel, isError, errorMessage, disabled = false } = props
  const classes = useStyles()
  const [field] = useField(name)
  const { ids, changeIds } = useAdditionalServiceIds()

  return (
    <Accordion disableGutters disabled={disabled} className={classes.accordionContainer}>
      <AccordionSummary expandIcon={<OrderCreateIcon className={classes.summaryIcon} />}>
        <Box gridColumn="1 / -1" minWidth="min-content">
          <Typography className={classes.title}>{title}</Typography>
        </Box>
      </AccordionSummary>
      {isError && (
        <Typography className={classes.errorMessage}>{errorMessage || DEFAULT_ERROR_MESSAGE}</Typography>
      )}
      <AccordionDetails>
        <FieldArray name={name}>
          {arrayHelpers => (
            <Box minWidth="min-content" className={classes.itemsContainer}>
              {field.value.map((v: any, i: number, arr: any[]) => (
                <AdditionalServiceItem
                  key={ids[i]}
                  options={options}
                  parentName={name}
                  index={i}
                  productLabel={productLabel}
                  arrayHelpers={arrayHelpers}
                  arrayLength={arr.length}
                  changeIds={changeIds}
                  isError={isError}
                />
              ))}
            </Box>
          )}
        </FieldArray>
      </AccordionDetails>
    </Accordion>
  )
}
