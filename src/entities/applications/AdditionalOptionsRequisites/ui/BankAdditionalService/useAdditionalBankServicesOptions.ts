import { useMemo } from 'react'

import { useFormikContext } from 'formik'

import { LOAN_TERM_GRADUATION_VALUE, MONTH_OF_YEAR_COUNT } from 'common/OrderCalculator/constants'
import { BankAdditionalOption } from 'common/OrderCalculator/hooks/useGetVendorOptionsQuery'
import {
  BriefOrderCalculatorFields,
  OrderCalculatorBankAdditionalService,
  MaxRateModsMap,
} from 'common/OrderCalculator/types'
import { RequiredRateMod, RequiredTariff } from 'entities/order/model/orderSlice'
import { checkIsNumber } from 'shared/lib/helpers'

import { ServicesGroupName } from '../../configs/additionalOptionsRequisites.config'
import { useAdditionalServicesOptions } from '../../hooks/useAdditionalServicesOptions'

/* Формирем строку со скидкой. Если кредитный продукт выбран и optionId === currentRateMod.optionId,
то скидку берем currentMaxDelta, если RateMod был в данном продукте. Если продкут не выбран,
берем скидку из maxRateModsMap для данной опции. Если скидка не найдена, возвращаем undefined */
const getProductOptionSubLabel = ({
  optionId,
  currentRateMod,
  currentMaxDelta,
  maxRateModsMap,
  isCreditProductsSelected,
}: {
  optionId: string
  currentRateMod: RequiredRateMod | undefined
  currentMaxDelta: number
  maxRateModsMap: MaxRateModsMap
  isCreditProductsSelected: boolean
}) => {
  if (isCreditProductsSelected && currentRateMod && optionId === currentRateMod.optionId && currentMaxDelta) {
    return `Скидка до ${currentMaxDelta}%`
  }
  if (!isCreditProductsSelected && maxRateModsMap[optionId]?.maxDelta) {
    return `Скидка до ${maxRateModsMap[optionId].maxDelta}%`
  }

  return undefined
}

/* Формирем строку со скидкой. Если кредитный продукт выбран и optionId === currentRateMod.optionId,
то скидку берем currentTariffDeltasMap, если RateMod был в данном продукте. Если продкут не выбран,
берем скидку из maxTariffMap для данного тарифа. Если скидка не найдена, возвращаем undefined */
const getTariffOptionSubLabel = ({
  tariffId,
  currentTariffDeltasMap,
  maxTariffMap,
  isCreditProductsSelected,
}: {
  tariffId: string
  currentTariffDeltasMap: Record<string, number>
  maxTariffMap: Record<string, RequiredTariff> | undefined
  isCreditProductsSelected: boolean
}) => {
  if (isCreditProductsSelected && currentTariffDeltasMap[tariffId]) {
    return `-${currentTariffDeltasMap[tariffId]}%`
  }
  if (!isCreditProductsSelected && maxTariffMap?.[tariffId]?.rateDelta) {
    return `Скидка до ${maxTariffMap[tariffId].rateDelta}%`
  }

  return undefined
}

type Props = {
  options: { value: string; label: string }[]
  additionalServices: BankAdditionalOption[]
  parentName: ServicesGroupName
  index: number
  servicesItem: OrderCalculatorBankAdditionalService
  clientAge: number
  currentRateMod: RequiredRateMod | undefined
  maxRateModsMap: MaxRateModsMap
}
export function useAdditionalBankServicesOptions({
  options,
  additionalServices,
  parentName,
  index,
  servicesItem,
  clientAge,
  currentRateMod,
  maxRateModsMap,
}: Props) {
  const { values } = useFormikContext<BriefOrderCalculatorFields>()
  const { productType, tariff: currentTariffId } = servicesItem
  const isCreditProductsSelected = !!values.creditProduct

  const { filteredOptions, shouldDisableAdding } = useAdditionalServicesOptions({
    values,
    index,
    parentName,
    options,
  })

  // Формируем мапу тарифов со скидкой для текущего кредитного продукта,
  // находим максимальную скидку для кредитного продукта
  const { currentTariffDeltasMap, currentMaxDelta } = useMemo(
    () =>
      (currentRateMod?.tariffs || []).reduce<{
        currentTariffDeltasMap: Record<string, number>
        currentMaxDelta: number
      }>(
        (acc, cur) => {
          if (cur.rateDelta) {
            acc.currentTariffDeltasMap[cur.tariffId] = cur.rateDelta
          }
          if (cur.rateDelta && cur.rateDelta > acc.currentMaxDelta) {
            acc.currentMaxDelta = cur.rateDelta
          }

          return acc
        },
        {
          currentTariffDeltasMap: {},
          currentMaxDelta: 0,
        },
      ),
    [currentRateMod?.tariffs],
  )

  /* Формируем опции банковских доп. услуг. Если текущий кредитный продукт не имеет обязательный тариф,
  то добавляем subLabel с возможной скидкой, если таковая найдется */
  const filteredOptionsWithSubLabels = useMemo(
    () =>
      currentRateMod?.requiredService
        ? filteredOptions
        : filteredOptions.map(option => ({
            ...option,
            subLabel: getProductOptionSubLabel({
              optionId: option.value,
              currentRateMod,
              currentMaxDelta,
              maxRateModsMap,
              isCreditProductsSelected,
            }),
          })),
    [currentRateMod, filteredOptions, isCreditProductsSelected, currentMaxDelta, maxRateModsMap],
  )

  const tariffs = useMemo(
    () =>
      additionalServices
        .find(service => service.optionId === productType)
        ?.tariffs.filter(
          tariff =>
            !!tariff.tariffId &&
            tariff.tariff &&
            checkIsNumber(tariff?.maxClientAge) &&
            checkIsNumber(tariff?.maxTerm),
        ) || [],
    [additionalServices, productType],
  )

  /* Формируем опции тарифов банковской доп. услуги. Если текущий кредитный продукт не имеет
  обязательный тариф, то добавляем subLabel с возможной скидкой, если таковая найдется */
  const tariffOptions = useMemo(
    () =>
      currentRateMod?.requiredService
        ? tariffs.map(tariff => ({ value: tariff.tariffId, label: tariff.tariff }))
        : tariffs.map(tariff => ({
            value: tariff.tariffId,
            label: tariff.tariff,
            subLabel: getTariffOptionSubLabel({
              tariffId: tariff.tariffId,
              currentTariffDeltasMap: productType === currentRateMod?.optionId ? currentTariffDeltasMap : {},
              maxTariffMap: maxRateModsMap[productType || '']?.maxTariffMap,
              isCreditProductsSelected,
            }),
          })),
    [
      currentRateMod?.optionId,
      currentRateMod?.requiredService,
      currentTariffDeltasMap,
      isCreditProductsSelected,
      maxRateModsMap,
      productType,
      tariffs,
    ],
  )

  const currentTariff = useMemo(
    () => tariffs.find(tariff => tariff.tariffId === currentTariffId),
    [currentTariffId, tariffs],
  )

  const loanTermOptions = useMemo(() => {
    if (!currentTariff) {
      return []
    }
    const maxLoanTermByClientAge = (currentTariff.maxClientAge - clientAge) * MONTH_OF_YEAR_COUNT
    const maxLoanTermByLoanTerm = values.loanTerm || maxLoanTermByClientAge
    const maxLoanTerm = Math.min(maxLoanTermByClientAge, maxLoanTermByLoanTerm, currentTariff.maxTerm)

    if (currentTariff.minTerm > maxLoanTerm || maxLoanTerm <= 0) {
      return []
    }
    const scaleLength = Math.floor((maxLoanTerm - currentTariff.minTerm) / LOAN_TERM_GRADUATION_VALUE + 1)
    const loanTerms = [...new Array(scaleLength)].map((_, index) => ({
      value: (index + 1) * LOAN_TERM_GRADUATION_VALUE + currentTariff.minTerm - LOAN_TERM_GRADUATION_VALUE,
    }))

    return loanTerms
  }, [clientAge, currentTariff, values.loanTerm])

  const isRequired =
    !!currentRateMod?.requiredService &&
    !!currentRateMod?.optionId &&
    currentRateMod?.optionId === servicesItem.productType

  return {
    shouldDisableAdding,
    filteredOptionsWithSubLabels,
    tariffOptions,
    currentTariff,
    loanTermOptions,
    isRequired,
  }
}
