import { Box } from '@mui/material'
import { FieldArray, useField } from 'formik'

import { AdditionalServicesContainer, useAdditionalServiceIds } from 'entities/OrderCalculator'

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

export function AdditionalServices(props: Props) {
  const { title, options, name, productLabel, isError, errorMessage, disabled = false } = props
  const classes = useStyles()
  const [field] = useField(name)
  const { ids, changeIds } = useAdditionalServiceIds()

  return (
    <AdditionalServicesContainer
      title={title}
      disabled={disabled}
      isError={isError}
      errorMessage={errorMessage}
    >
      <FieldArray name={name} data-testid="dima">
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
    </AdditionalServicesContainer>
  )
}
