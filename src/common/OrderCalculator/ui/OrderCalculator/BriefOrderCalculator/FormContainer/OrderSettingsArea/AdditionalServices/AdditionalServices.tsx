import { useCallback, useEffect, useMemo, useState } from 'react'

import { Box } from '@mui/material'
import { FieldArray, useField, useFormikContext } from 'formik'

import { INITIAL_ADDITIONAL_SERVICE, INITIAL_BANK_ADDITIONAL_SERVICE } from 'common/OrderCalculator/config'
import { useAdditionalServiceIds } from 'common/OrderCalculator/hooks/useAdditionalServiceIds'
import { useAdditionalServicesGroupe } from 'common/OrderCalculator/hooks/useAdditionalServicesGroupe'
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
  selectedRequiredOptionsMap?: Record<string, boolean>
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
  selectedRequiredOptionsMap = {},
}: Props) {
  const classes = useStyles()
  const initialAdditionalService =
    name === ServicesGroupName.bankAdditionalServices
      ? INITIAL_BANK_ADDITIONAL_SERVICE
      : INITIAL_ADDITIONAL_SERVICE
  const [field] = useField<(OrderCalculatorAdditionalService | OrderCalculatorBankAdditionalService)[]>(name)
  const { ids, changeIds } = useAdditionalServiceIds()

  const options = useMemo(
    () =>
      additionalServices.map(option => ({
        value: option.optionId,
        label: option.optionName,
      })),
    [additionalServices],
  )

  const { isInitialExpanded, isShouldExpanded, resetShouldExpanded } = useAdditionalServicesGroupe(
    name,
    initialAdditionalService,
  )

  return (
    <AdditionalServicesContainer
      title={title}
      name={name}
      initialValues={initialAdditionalService}
      isShouldExpanded={isShouldExpanded}
      resetShouldExpanded={resetShouldExpanded}
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
                    selectedRequiredOptionsMap={selectedRequiredOptionsMap}
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
