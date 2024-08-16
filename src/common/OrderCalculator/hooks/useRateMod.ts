import { useEffect, useMemo } from 'react'

import { useFormikContext } from 'formik'

import { ServicesGroupName } from 'entities/applications/AdditionalOptionsRequisites/configs/additionalOptionsRequisites.config'
import { RequiredProduct, RequiredRateMod } from 'entities/order/model/orderSlice'

import {
  BriefOrderCalculatorFields,
  FullInitialBankAdditionalService,
  MaxRateModsMap,
  OrderCalculatorBankAdditionalService,
  TariffMap,
  UseGetCreditProductListQueryData,
} from '../types'
import { NonNullableAdditionalOption } from './useGetVendorOptionsQuery'

type Params = {
  creditProductListData: UseGetCreditProductListQueryData | undefined
  currentProduct: RequiredProduct | undefined
  additionalOptionsMap: Record<string, NonNullableAdditionalOption> | undefined
  isVendorOptionsSuccess: boolean
  initialBankAdditionalService: OrderCalculatorBankAdditionalService | FullInitialBankAdditionalService
}
export function useRateMod({
  creditProductListData,
  currentProduct,
  additionalOptionsMap = {},
  isVendorOptionsSuccess,
  initialBankAdditionalService,
}: Params) {
  const { values, setFieldValue } = useFormikContext<BriefOrderCalculatorFields>()

  // В контексте скидок работаем только если rateMod.requiredService = false
  // см. https://wiki.x.sberauto.com/pages/viewpage.action?pageId=1068534196
  const allRateMods = useMemo(
    () =>
      (creditProductListData?.productIds || [])
        // conditions[0] т.к. currentProduct будет всегда иметь только один condition,
        // если ожидаются rateMods (по заявлениям аналитиков)
        .map(productId => creditProductListData?.productsMap[productId]?.conditions[0].rateMod)
        .filter((rateMod): rateMod is RequiredRateMod => !!rateMod && !rateMod.requiredService),
    [creditProductListData?.productIds, creditProductListData?.productsMap],
  )

  /* Собираем в мапу максимальные значения скидок (rateDelta),
  для каждого тарифа каждой опции (rateMod) (для каждого продукта они могут отличаться). */
  const maxRateModsMap = useMemo(
    () =>
      allRateMods.reduce<MaxRateModsMap>((acc, cur) => {
        if (!cur || !cur.tariffs) {
          return acc
        }

        const oldValue = acc[cur.optionId]

        /* Для текущей опции (rateMod) собираем мапу тарифов, и запоминаем максимальное значение rateDelta.
        Если такая опция уже была запомнена, то сравниваем новое значение rateDelta с уже запомненным,
        и выбираем максимальное */
        const { maxTariffMap, maxDelta } = cur.tariffs.reduce<{
          maxTariffMap: TariffMap
          maxDelta: number
        }>(
          (tariffAcc, tariff) => {
            const oldTariff = tariffAcc.maxTariffMap[tariff.tariffId]
            if (oldTariff && tariff.rateDelta > oldTariff.rateDelta) {
              tariffAcc.maxTariffMap[tariff.tariffId] = tariff
            } else {
              tariffAcc.maxTariffMap[tariff.tariffId] = tariff
            }

            if (tariff.rateDelta > tariffAcc.maxDelta) {
              tariffAcc.maxDelta = tariff.rateDelta
            }

            return tariffAcc
          },
          {
            maxTariffMap: oldValue?.maxTariffMap ?? {},
            maxDelta: oldValue?.maxDelta ?? 0,
          },
        )

        /* Формируем объект с максимальным значением rateDelta и мапой максимальных тарифов */
        acc[cur.optionId] = {
          optionId: cur.optionId,
          maxDelta,
          maxTariffMap,
        }

        return acc
      }, {}),
    [allRateMods],
  )

  const isShouldShowDiscountNotification = useMemo(
    () => allRateMods.some(rateMod => rateMod.tariffs.some(tariffs => tariffs.rateDelta)),
    [allRateMods],
  )

  // Если продукт выбран, то берем его rateMod, если есть.
  const currentRateMod = useMemo(() => currentProduct?.conditions[0].rateMod, [currentProduct?.conditions])

  const requiredServiceRateMod = useMemo(
    () => (currentRateMod?.requiredService ? currentRateMod : null),
    [currentRateMod],
  )

  const isRequiredOptionSelected = values.bankAdditionalServices.some(
    service =>
      service.productType === requiredServiceRateMod?.optionId &&
      requiredServiceRateMod?.tariffs.some(tariff => tariff.tariffId === service.tariff),
  )

  /* Находим вреди всез доп. опций ту, которая в текущем кредитном продукте (если выбран)
  является обязательной. находим в ней тариф, указанный как обязательный для данного кредитного продукта  */
  const requiredTariffId = useMemo(() => {
    const option = additionalOptionsMap[requiredServiceRateMod?.optionId || '']
    const tariff = option?.tariffs?.find(optionTariff =>
      requiredServiceRateMod?.tariffs.some(tariff => tariff.tariffId === optionTariff.tariffId),
    )

    return tariff?.tariffId
  }, [additionalOptionsMap, requiredServiceRateMod?.optionId, requiredServiceRateMod?.tariffs])

  // проверяем, что в ручке есть доп. подходящий под обязательный RateMod
  const isHasRequiredOptionsInData = isVendorOptionsSuccess && requiredServiceRateMod && requiredTariffId

  useEffect(() => {
    if (isHasRequiredOptionsInData && !isRequiredOptionSelected) {
      /* Отфильтровываем пустые значения в форме (например, если она была пустой) и
      значения опций с тем же productType, т.к. они будут заменяться */
      const currentBankAdditionalServices = values.bankAdditionalServices.filter(
        service => !!service.productType && requiredServiceRateMod?.optionId !== service.productType,
      )

      setFieldValue(ServicesGroupName.bankAdditionalServices, [
        ...currentBankAdditionalServices,
        {
          ...initialBankAdditionalService,
          productType: requiredServiceRateMod.optionId,
          tariff: requiredTariffId,
        },
      ])
    }
  }, [
    initialBankAdditionalService,
    isHasRequiredOptionsInData,
    isRequiredOptionSelected,
    requiredServiceRateMod?.optionId,
    requiredTariffId,
    setFieldValue,
    values.bankAdditionalServices,
  ])

  return { currentRateMod, isShouldShowDiscountNotification, maxRateModsMap }
}
