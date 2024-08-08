import { useEffect, useMemo } from 'react'

import { useFormikContext } from 'formik'

import { ServicesGroupName } from 'entities/application/AdditionalOptionsRequisites/configs/additionalOptionsRequisites.config'
import { RequiredRateMods } from 'entities/reduxStore/orderSlice'

import {
  BriefOrderCalculatorFields,
  CreditProductsData,
  FullInitialBankAdditionalService,
  OrderCalculatorBankAdditionalService,
} from '../types'
import { NonNullableAdditionalOption } from './useGetVendorOptionsQuery'

type Params = {
  creditProductsData: CreditProductsData
  additionalOptionsMap: Record<string, NonNullableAdditionalOption> | undefined
  isVendorOptionsSuccess: boolean
  initialBankAdditionalService: OrderCalculatorBankAdditionalService | FullInitialBankAdditionalService
}
export function useRequiredService({
  creditProductsData,
  additionalOptionsMap = {},
  isVendorOptionsSuccess,
  initialBankAdditionalService,
}: Params) {
  const { values, setFieldValue } = useFormikContext<BriefOrderCalculatorFields>()

  // conditions[0] т.к. currentProduct будет всегда иметь только один condition,
  // если ожидаются rateMods (по заявлениям аналитиков)
  const requiredOptions = useMemo(
    () =>
      creditProductsData.currentProduct?.conditions[0].rateMods.filter(rateMod => rateMod.requiredService) ||
      [],
    [creditProductsData.currentProduct?.conditions],
  )

  const { selectedRequiredOptionsMap, notSelectedRequiredOptions } = useMemo(
    () =>
      requiredOptions.reduce(
        (acc, requiredOption) => {
          const isSelected = values.bankAdditionalServices.some(
            service =>
              service.productType === requiredOption?.optionId && service.tariff === requiredOption?.tariffId,
          )
          if (isSelected) {
            acc.selectedRequiredOptionsMap[requiredOption.optionId] = true
          } else {
            acc.notSelectedRequiredOptions.push(requiredOption)
          }

          return acc
        },
        {
          selectedRequiredOptionsMap: {} as Record<string, boolean>,
          notSelectedRequiredOptions: [] as RequiredRateMods[],
        },
      ),
    [requiredOptions, values.bankAdditionalServices],
  )

  const isHasTariff = useMemo(
    () =>
      notSelectedRequiredOptions.some(requiredOption => {
        const option = additionalOptionsMap[requiredOption.optionId]
        const isHasTariff = option?.tariffs?.some(tariff => tariff.tariffId === requiredOption.tariffId)

        return isHasTariff
      }),
    [additionalOptionsMap, notSelectedRequiredOptions],
  )

  const isHasRequiredOptionsInData =
    !isVendorOptionsSuccess || !notSelectedRequiredOptions.length || isHasTariff

  useEffect(() => {
    if (notSelectedRequiredOptions.length && isHasRequiredOptionsInData) {
      /* Отфильтровываем пустые значения в форме (например, если она была пустой) и
      значения опций с тем же productType, т.к. они будут заменяться */
      const currentBankAdditionalServices = values.bankAdditionalServices.filter(
        service =>
          !!service.productType &&
          !requiredOptions.some(requiredOption => requiredOption.optionId === service.productType),
      )
      const newBankAdditionalServices: OrderCalculatorBankAdditionalService[] =
        notSelectedRequiredOptions.map(requiredOption => ({
          ...initialBankAdditionalService,
          productType: requiredOption.optionId ?? initialBankAdditionalService.productType,
          tariff: requiredOption.tariffId ?? initialBankAdditionalService.tariff,
        }))

      setFieldValue(ServicesGroupName.bankAdditionalServices, [
        ...newBankAdditionalServices,
        ...currentBankAdditionalServices,
      ])
    }
  }, [
    initialBankAdditionalService,
    isHasRequiredOptionsInData,
    notSelectedRequiredOptions,
    requiredOptions,
    setFieldValue,
    values.bankAdditionalServices,
  ])

  return { selectedRequiredOptionsMap }
}
