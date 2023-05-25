import { Box } from '@mui/material'
import { FieldArray, useField } from 'formik'

import { useAdditionalServiceIds } from 'common/OrderCalculator/hooks/useAdditionalServiceIds'
import { AdditionalServicesContainer } from 'common/OrderCalculator/ui/AdditionalServicesContainer/AdditionalServicesContainer'

import { AdditionalServiceItem } from './AdditionalServiceItem/AdditionalServiceItem'
import useStyles from './AdditionalServices.styles'

type Props = {
  title: string
  options: {
    productType: string[]
    loanTerms: string[]
  }
  name: string
  isError?: boolean
  errorMessage?: string
  disabled?: boolean
}

export function AdditionalServices({
  title,
  options,
  name,
  isError = false,
  errorMessage,
  disabled = false,
}: Props) {
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
      <FieldArray name={name}>
        {arrayHelpers => (
          <Box minWidth="min-content" className={classes.itemsContainer}>
            {field.value.map((v: any, i: number, arr: any[]) => (
              <AdditionalServiceItem
                key={ids[i]}
                options={options}
                parentName={name}
                index={i}
                arrayHelpers={arrayHelpers}
                arrayLength={arr.length}
                changeIds={changeIds}
              />
            ))}
          </Box>
        )}
      </FieldArray>
    </AdditionalServicesContainer>
  )
}
