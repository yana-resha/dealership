import { useEffect, useMemo } from 'react'

import { Box } from '@mui/material'
import { FieldArray, useField, useFormikContext } from 'formik'

import { INITIAL_ADDITIONAL_SERVICE, INITIAL_BANK_ADDITIONAL_SERVICE } from 'common/OrderCalculator/config'
import { useAdditionalServiceIds } from 'common/OrderCalculator/hooks/useAdditionalServiceIds'
import {
  BankAdditionalOption,
  NonNullableAdditionalOption,
} from 'common/OrderCalculator/hooks/useGetVendorOptionsQuery'
import {
  OrderCalculatorAdditionalService,
  OrderCalculatorBankAdditionalService,
} from 'common/OrderCalculator/types'
import { AdditionalServicesContainer } from 'common/OrderCalculator/ui/AdditionalServicesContainer/AdditionalServicesContainer'
import { ServicesGroupName } from 'entities/application/AdditionalOptionsRequisites/configs/additionalOptionsRequisites.config'
import { BankAdditionalService } from 'entities/application/AdditionalOptionsRequisites/ui'
import { usePrevious } from 'shared/hooks/usePrevious'
import { checkIsNumber } from 'shared/lib/helpers'

import { AdditionalServiceItem } from './AdditionalServiceItem/AdditionalServiceItem'
import useStyles from './AdditionalServices.styles'

type Props = {
  title: string
  additionalServices: NonNullableAdditionalOption[] | BankAdditionalOption[]
  name: ServicesGroupName
  productLabel: string
  isNecessaryCasco?: boolean
  isError?: boolean
  errorMessage?: string
  disabled?: boolean
  clientAge?: number
}

export function AdditionalServices({
  title,
  additionalServices,
  name,
  isNecessaryCasco = false,
  productLabel,
  isError = false,
  errorMessage,
  disabled = false,
  clientAge,
}: Props) {
  const classes = useStyles()
  const initialAdditionalService =
    name === ServicesGroupName.bankAdditionalServices
      ? INITIAL_BANK_ADDITIONAL_SERVICE
      : INITIAL_ADDITIONAL_SERVICE
  const [field, , { setValue: setServices }] =
    useField<(OrderCalculatorAdditionalService | OrderCalculatorBankAdditionalService)[]>(name)
  const { ids, changeIds } = useAdditionalServiceIds()

  const isInitialExpanded = !!field.value.length && checkIsNumber(field.value[0].productType)

  const { submitCount } = useFormikContext()
  const prevSubmitCount = usePrevious(submitCount)

  const options = useMemo(
    () =>
      additionalServices.map(option => ({
        value: option.optionId,
        label: option.optionName,
      })),
    [additionalServices],
  )

  useEffect(() => {
    if (prevSubmitCount === submitCount) {
      return
    }
    const newValue = field.value.filter(v => checkIsNumber(v.productType))
    setServices(newValue.length ? newValue : [initialAdditionalService])
  }, [field.value, initialAdditionalService, prevSubmitCount, setServices, submitCount])

  return (
    <AdditionalServicesContainer
      title={title}
      name={name}
      initialValues={initialAdditionalService}
      disabled={disabled}
      isError={isError}
      errorMessage={errorMessage}
      isInitialExpanded={isInitialExpanded}
    >
      <FieldArray name={name}>
        {arrayHelpers => (
          <Box minWidth="min-content" className={classes.itemsContainer}>
            {name === ServicesGroupName.bankAdditionalServices
              ? field.value.map((v, i, arr) => (
                  <BankAdditionalService
                    key={ids[i]}
                    options={options}
                    additionalServices={additionalServices as BankAdditionalOption[]}
                    parentName={name}
                    index={i}
                    productLabel={productLabel}
                    arrayHelpers={arrayHelpers}
                    arrayLength={arr.length}
                    changeIds={changeIds}
                    isError={isError}
                    servicesItem={v as unknown as OrderCalculatorBankAdditionalService}
                    // Если clientAge отсутствует, то банковские опции = пустой массив,
                    // потому clientAge можно ставить как number
                    clientAge={clientAge as number}
                  />
                ))
              : field.value.map((v, i, arr) => (
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
