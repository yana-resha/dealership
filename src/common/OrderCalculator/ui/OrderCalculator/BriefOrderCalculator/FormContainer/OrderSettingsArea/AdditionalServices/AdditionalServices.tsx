import { useEffect } from 'react'

import { Box } from '@mui/material'
import { FieldArray, useField, useFormikContext } from 'formik'

import { INITIAL_ADDITIONAL_SERVICE } from 'common/OrderCalculator/config'
import { useAdditionalServiceIds } from 'common/OrderCalculator/hooks/useAdditionalServiceIds'
import { OrderCalculatorAdditionalService } from 'common/OrderCalculator/types'
import { AdditionalServicesContainer } from 'common/OrderCalculator/ui/AdditionalServicesContainer/AdditionalServicesContainer'
import { ServicesGroupName } from 'entities/application/AdditionalOptionsRequisites/configs/additionalOptionsRequisites.config'
import { usePrevious } from 'shared/hooks/usePrevious'

import { AdditionalServiceItem } from './AdditionalServiceItem/AdditionalServiceItem'
import useStyles from './AdditionalServices.styles'

type Props = {
  title: string
  options: { value: string | number; label: string }[]
  name: ServicesGroupName
  isNecessaryCasco?: boolean
  productLabel: string
  isError?: boolean
  errorMessage?: string
  disabled?: boolean
}

export function AdditionalServices({
  title,
  options,
  name,
  isNecessaryCasco = false,
  productLabel,
  isError = false,
  errorMessage,
  disabled = false,
}: Props) {
  const classes = useStyles()
  const [field, , { setValue: setServices }] = useField<OrderCalculatorAdditionalService[]>(name)
  const { ids, changeIds } = useAdditionalServiceIds()

  const isInitialExpanded = !!field.value.length && !!field.value[0].productType

  const { submitCount } = useFormikContext()
  const prevSubmitCount = usePrevious(submitCount)

  useEffect(() => {
    if (prevSubmitCount === submitCount) {
      return
    }
    const newValue = field.value.filter((value: OrderCalculatorAdditionalService) => value.productType)
    setServices(newValue.length ? newValue : [INITIAL_ADDITIONAL_SERVICE])
  }, [field.name, field.value, prevSubmitCount, setServices, submitCount])

  return (
    <AdditionalServicesContainer
      title={title}
      name={name}
      initialValues={INITIAL_ADDITIONAL_SERVICE}
      disabled={disabled}
      isError={isError}
      errorMessage={errorMessage}
      isInitialExpanded={isInitialExpanded}
    >
      <FieldArray name={name}>
        {arrayHelpers => (
          <Box minWidth="min-content" className={classes.itemsContainer}>
            {field.value.map((v, i, arr) => (
              <AdditionalServiceItem
                key={ids[i]}
                options={options}
                parentName={name}
                isNecessaryCasco={isNecessaryCasco}
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
