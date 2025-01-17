import { useCallback } from 'react'

import { AdditionalOptionsFrontdc, OptionType } from '@sberauto/loanapplifecycledc-proto/public'
import { useDispatch } from 'react-redux'

import { AnketaType } from 'entities/applications/application.utils'
import { updateApplication } from 'entities/order'
import { getPointOfSaleFromCookies } from 'entities/pointOfSale'
import { stringToNumber } from 'shared/utils/stringToNumber'

import { BriefOrderCalculatorFields, OrderCalculatorAdditionalService } from '../types'
import { mapCommonApplicationValues } from '../utils/mapApplication'
import { getBankOptionInsuredAmount } from '../utils/orderFormMapper'
import { useGetCarsListQuery } from './useGetCarsListQuery'
import { NonNullableAdditionalOption, useGetVendorOptionsQuery } from './useGetVendorOptionsQuery'

const mapAdditionalOptionsForBriefCalculator = (
  additionalOptions: OrderCalculatorAdditionalService[],
  additionalOptionsMap: Record<string, NonNullableAdditionalOption> | undefined,
  bankOptionType: OptionType,
) =>
  additionalOptions.reduce((acc: AdditionalOptionsFrontdc[], option) => {
    const { productCost, productType, isCredit, cascoLimit } = option

    const additionalOption: AdditionalOptionsFrontdc = {
      bankOptionType: bankOptionType,
      type: productType ?? undefined,
      name: additionalOptionsMap?.[productType ?? '']?.optionName,
      inCreditFlag: isCredit,
      price: stringToNumber(productCost),
      cascoLimit: stringToNumber(cascoLimit),
    }
    if (additionalOption.type) {
      acc.push(additionalOption)
    }

    return acc
  }, [])

export function useMapApplicationFromBriefCalculator() {
  const dispatch = useDispatch()

  const { vendorCode } = getPointOfSaleFromCookies()
  const { data: vendorOptions } = useGetVendorOptionsQuery({ vendorCode }, { enabled: false })
  const { data: carsData } = useGetCarsListQuery({ vendorCode }, { enabled: false })

  const remapAdditionalOptionsForBriefCalculator = useCallback(
    (values: BriefOrderCalculatorFields) => {
      const {
        carCost,
        initialPayment,
        additionalEquipments,
        dealerAdditionalServices,
        bankAdditionalServices,
      } = values

      const additionalEquipmentForApplication = mapAdditionalOptionsForBriefCalculator(
        additionalEquipments,
        vendorOptions?.additionalOptionsMap,
        OptionType.EQUIPMENT,
      )

      const dealerAdditionalServicesForApplication = mapAdditionalOptionsForBriefCalculator(
        dealerAdditionalServices,
        vendorOptions?.additionalOptionsMap,
        OptionType.DEALER,
      )

      const bankAdditionalServicesForApplication = bankAdditionalServices.reduce(
        (acc: AdditionalOptionsFrontdc[], option) => {
          const { productCost, productType, tariff, loanTerm } = option
          const vendorOption = vendorOptions?.additionalOptionsMap[productType ?? '']
          const currentTariff = vendorOption?.tariffs?.find(t => t.tariffId === tariff)
          const tariffCode = currentTariff?.tariffCode
          const additionalOption: AdditionalOptionsFrontdc = {
            bankOptionType: OptionType.BANK,
            type: productType ?? undefined,
            name: vendorOption?.optionName,
            inCreditFlag: true, // Банковские допы всегда в кредит
            price: stringToNumber(productCost),
            tariffId: tariff ?? undefined,
            tariff: currentTariff?.tariff,
            tariffCode,
            insuredAmount: getBankOptionInsuredAmount(tariffCode, carCost, initialPayment),
            term: loanTerm ?? undefined,
            code: vendorOption?.optionCode,
          }
          if (additionalOption.type) {
            acc.push(additionalOption)
          }

          return acc
        },
        [],
      )

      return [
        ...additionalEquipmentForApplication,
        ...dealerAdditionalServicesForApplication,
        ...bankAdditionalServicesForApplication,
      ]
    },
    [vendorOptions?.additionalOptionsMap],
  )

  const remapApplicationValuesForBriefCalculator = useCallback(
    (values: BriefOrderCalculatorFields) => {
      const { commonLoanCar, commonLoanData } = mapCommonApplicationValues(values, carsData)
      const newApplicationData = {
        loanCar: commonLoanCar,
        loanData: {
          ...commonLoanData,
          additionalOptions: remapAdditionalOptionsForBriefCalculator(values),
        },
        /* Если попали на короткий калькулятор, то выйти из него можно с anketaType=0 или anketaType=1,
        в зависимости от полноты данных, даже если до этого в заявке был anketaType=2.
        Потому тут изначально ставим 0, а на этапе сохранения выбираем 0 или 1 */
        anketaType: AnketaType.Incomplete,
      }

      dispatch(updateApplication(newApplicationData))
    },
    [carsData, dispatch, remapAdditionalOptionsForBriefCalculator],
  )

  return {
    remapApplicationValues: remapApplicationValuesForBriefCalculator,
  }
}
