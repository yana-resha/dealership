import React, { useMemo } from 'react'

import { Box, Divider } from '@mui/material'
import { FieldArray, useField } from 'formik'

import { FULL_INITIAL_BANK_ADDITIONAL_SERVICE } from 'common/OrderCalculator/config'
import { useAdditionalServiceIds } from 'common/OrderCalculator/hooks/useAdditionalServiceIds'
import { useAdditionalServicesGroupe } from 'common/OrderCalculator/hooks/useAdditionalServicesGroupe'
import { BankAdditionalOption } from 'common/OrderCalculator/hooks/useGetVendorOptionsQuery'
import { AdditionalServicesContainer } from 'common/OrderCalculator/ui/AdditionalServicesContainer/AdditionalServicesContainer'
import { ServicesGroupName } from 'entities/application/AdditionalOptionsRequisites/configs/additionalOptionsRequisites.config'
import {
  BankAdditionalService,
  BankServicesRequisites,
} from 'entities/application/AdditionalOptionsRequisites/ui'

import useStyles from './AdditionalBankService.styles'

type Props = {
  additionalServices: BankAdditionalOption[]
  clientAge: number | undefined
  isError?: boolean
  errorMessage?: string
  disabled?: boolean
  selectedRequiredOptionsMap: Record<string, boolean>
}

export function AdditionalBankService({
  additionalServices,
  clientAge,
  isError = false,
  errorMessage,
  disabled = false,
  selectedRequiredOptionsMap,
}: Props) {
  const classes = useStyles()
  const [field] = useField(ServicesGroupName.bankAdditionalServices)

  const { ids, changeIds } = useAdditionalServiceIds()
  const { isInitialExpanded, isShouldExpanded, resetShouldExpanded } = useAdditionalServicesGroupe(
    ServicesGroupName.bankAdditionalServices,
    FULL_INITIAL_BANK_ADDITIONAL_SERVICE,
  )

  const options = useMemo(
    () =>
      additionalServices.map(option => ({
        value: option.optionId,
        label: option.optionName,
      })),
    [additionalServices],
  )

  return (
    <AdditionalServicesContainer
      title="Дополнительные услуги банка"
      name={ServicesGroupName.bankAdditionalServices}
      initialValues={FULL_INITIAL_BANK_ADDITIONAL_SERVICE}
      isShouldExpanded={isShouldExpanded}
      resetShouldExpanded={resetShouldExpanded}
      disabled={disabled}
      isError={isError}
      errorMessage={errorMessage}
      isInitialExpanded={isInitialExpanded}
    >
      <FieldArray name={ServicesGroupName.bankAdditionalServices}>
        {arrayHelpers => (
          <Box minWidth="min-content" className={classes.itemsContainer}>
            {field.value.map((v: any, index: number, arr: any[]) => (
              <React.Fragment key={ids[index]}>
                <BankAdditionalService
                  options={options}
                  additionalServices={additionalServices as BankAdditionalOption[]}
                  parentName={ServicesGroupName.bankAdditionalServices}
                  index={index}
                  productLabel="Тип продукта"
                  arrayHelpers={arrayHelpers}
                  arrayLength={arr.length}
                  changeIds={changeIds}
                  isError={isError}
                  servicesItem={v}
                  // Если clientAge отсутствует, то банковские опции = пустой массив,
                  // потому clientAge можно ставить как number
                  clientAge={clientAge as number}
                  selectedRequiredOptionsMap={selectedRequiredOptionsMap}
                />
                <BankServicesRequisites
                  index={index}
                  parentName={ServicesGroupName.bankAdditionalServices}
                  servicesItem={v}
                />
                {index < arr.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </Box>
        )}
      </FieldArray>
    </AdditionalServicesContainer>
  )
}
