import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from '@mui/material'
import { FieldArray, useField } from 'formik'

import { ReactComponent as OrderCreateIcon } from 'assets/icons/orderCreate.svg'

import { AdditionalServiceItem } from './AdditionalServiceItem/AdditionalServiceItem'
import useStyles from './AdditionalServices.styles'

type Props = {
  title: string
  options: string[]
  name: string
  productLabel: string
  disabled?: boolean
}

export function AdditionalServices({ title, options, name, productLabel, disabled = false }: Props) {
  const classes = useStyles()
  const [field] = useField(name)

  return (
    <Accordion disableGutters disabled={disabled} className={classes.accordionContainer}>
      <AccordionSummary expandIcon={<OrderCreateIcon className={classes.summaryIcon} />}>
        <Box gridColumn="1 / -1" minWidth="min-content">
          <Typography className={classes.title}>{title}</Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <FieldArray name={name}>
          {arrayHelpers => (
            <Box minWidth="min-content" className={classes.itemsContaner}>
              {field.value.map((v: any, i: number, arr: any[]) => (
                <AdditionalServiceItem
                  key={i}
                  options={options}
                  parentName={name}
                  index={i}
                  productLabel={productLabel}
                  arrayHelpers={arrayHelpers}
                  arrayLength={arr.length}
                />
              ))}
            </Box>
          )}
        </FieldArray>
      </AccordionDetails>
    </Accordion>
  )
}
