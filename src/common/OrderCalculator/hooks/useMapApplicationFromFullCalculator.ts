import { useCallback } from 'react'

import {
  AdditionalOptionsFrontdc,
  OptionType,
  LoanCarFrontdc,
  LoanDataFrontdc,
  VendorFrontdc,
} from '@sberauto/loanapplifecycledc-proto/public'
import { DateTime } from 'luxon'
import { useDispatch } from 'react-redux'

import { AnketaType } from 'entities/application/application.utils'
import { getPointOfSaleFromCookies } from 'entities/pointOfSale'
import { updateApplication } from 'entities/reduxStore/orderSlice'
import { useAppSelector } from 'shared/hooks/store/useAppSelector'
import { convertedDateToString } from 'shared/utils/dateTransform'
import { stringToNumber } from 'shared/utils/stringToNumber'

import {
  FullOrderCalculatorFields,
  FullInitialAdditionalEquipments,
  FullInitialAdditionalService,
  FullInitialBankAdditionalService,
} from '../types'
import { mapCommonApplicationValues } from '../utils/mapApplication'
import { useGetCarsListQuery } from './useGetCarsListQuery'
import { NonNullableAdditionalOption, useGetVendorOptionsQuery } from './useGetVendorOptionsQuery'

enum BankOptionProductType {
  FIRST = '26',
  SECOND = '27',
  THIRD = '28',
  FOURTH = '29',
}
enum BankOptionTariffId {
  FIRST = '100',
  SECOND = '101',
  THIRD = '102',
  FOURTH = '103',
  FIFTH = '104',
}
// Значения прописаны в статье https://wiki.x.sberauto.com/pages/viewpage.action?pageId=1071122571
const INSURED_AMOUNT_VALUE_MAP: Record<string, Record<string, number>> = {
  [BankOptionProductType.FIRST]: {
    [BankOptionTariffId.FIRST]: 700000,
    [BankOptionTariffId.SECOND]: 1200000,
  },
  [BankOptionProductType.SECOND]: {
    [BankOptionTariffId.THIRD]: 510000,
  },
  [BankOptionProductType.THIRD]: {
    [BankOptionTariffId.FOURTH]: 1200000,
  },
  [BankOptionProductType.FOURTH]: {
    [BankOptionTariffId.FIFTH]: 510000,
  },
}

const getBankOptionDocNumber = (optionType: string | null, dcAppId: string | undefined) => {
  switch (optionType) {
    case BankOptionProductType.FIRST:
    case BankOptionProductType.THIRD:
      return '008SE054' + (dcAppId || '').slice(0, 18)
    case BankOptionProductType.SECOND:
    case BankOptionProductType.FOURTH:
      return '077SE680' + (dcAppId || '').slice(0, 18)
    default:
      return ''
  }
}

type MapCommonValueParams = {
  option: FullInitialAdditionalEquipments | FullInitialAdditionalService | FullInitialBankAdditionalService
  additionalOptionsMap: Record<string, NonNullableAdditionalOption> | undefined
  bankOptionType: OptionType
  isCredit: boolean
  provider: string | null
  providerName: string | undefined
  isCustomFields?: boolean
  loanTerm?: number | null
}
const mapCommonValues = ({
  option,
  additionalOptionsMap,
  bankOptionType,
  isCredit,
  isCustomFields,
  loanTerm = null,
  provider,
  providerName,
}: MapCommonValueParams) => {
  const {
    productCost,
    taxValue,
    taxPercent,
    bankAccountNumber,
    correspondentAccount,
    broker,
    brokerName,
    bankIdentificationCode,
    beneficiaryBank,
    inn,
    ogrn,
    kpp,
    productType,
  } = option

  const additionalOption: AdditionalOptionsFrontdc = {
    bankOptionType,
    type: productType ?? undefined,
    name: additionalOptionsMap?.[productType ?? '']?.optionName,
    inCreditFlag: isCredit,
    price: stringToNumber(productCost),
    term: loanTerm ?? undefined,
    vendor: {
      vendorCode: provider || undefined,
      vendorName: providerName,
    },
    broker: {
      vendorCode: broker || undefined,
      vendorName: brokerName,
      requisites: {
        accountRequisite: {
          accountNumber: bankAccountNumber,
          accountCorrNumber: correspondentAccount,
          bank: beneficiaryBank,
          bic: bankIdentificationCode,
          inn: inn,
          ogrn: ogrn,
          kpp: kpp,
          accManualEnter: isCustomFields,
        },
      },
      taxInfo: {
        amount: taxValue,
        percent: taxPercent,
      },
    },
  }

  return additionalOption
}

export function useMapApplicationFromFullCalculator() {
  const dcAppId = useAppSelector(state => state.order.order?.orderData?.application?.dcAppId)
  const dispatch = useDispatch()

  const { vendorCode, vendorName } = getPointOfSaleFromCookies()
  const { data: vendorOptions } = useGetVendorOptionsQuery({ vendorCode }, { enabled: false })
  const { data: carsData } = useGetCarsListQuery({ vendorCode }, { enabled: false })

  const remapAdditionalOptionsForFullCalculator = useCallback(
    (values: FullOrderCalculatorFields) => {
      const { additionalEquipments, dealerAdditionalServices, bankAdditionalServices } = values

      const additionalEquipmentForApplication = additionalEquipments.reduce(
        (acc: AdditionalOptionsFrontdc[], option) => {
          const commonValues = mapCommonValues({
            option,
            additionalOptionsMap: vendorOptions?.additionalOptionsMap,
            bankOptionType: OptionType.EQUIPMENT,
            isCredit: option.isCredit,
            isCustomFields: option.isCustomFields,
            provider: option.isCredit ? vendorCode || null : null,
            providerName: option.isCredit ? vendorName : undefined,
          })

          const additionalOption = {
            ...commonValues,
            docType: option.documentType,
            docNumber: option.documentNumber,
            docDate: convertedDateToString(option.documentDate),
          }

          if (additionalOption.type !== undefined) {
            acc.push(additionalOption)
          }

          return acc
        },
        [],
      )

      const additionalDealerServicesForApplication = dealerAdditionalServices.reduce(
        (acc: AdditionalOptionsFrontdc[], option) => {
          const { provider, providerName, loanTerm, documentDate, cascoLimit } = option
          const docDate = convertedDateToString(documentDate) || undefined
          const dateEnd = documentDate
            ? loanTerm
              ? DateTime.fromJSDate(documentDate).plus({ months: loanTerm }).toFormat('yyyy-LL-dd')
              : docDate
            : undefined

          const commonValues = mapCommonValues({
            option,
            additionalOptionsMap: vendorOptions?.additionalOptionsMap,
            bankOptionType: OptionType.DEALER,
            isCredit: option.isCredit,
            isCustomFields: option.isCustomFields,
            provider,
            providerName,
            loanTerm,
          })
          const additionalOption: AdditionalOptionsFrontdc = {
            ...commonValues,
            docType: option.documentType,
            docNumber: option.documentNumber,
            docDate,
            dateStart: docDate,
            dateEnd,
            cascoLimit: stringToNumber(cascoLimit),
          }

          if (additionalOption.type) {
            acc.push(additionalOption)
          }

          return acc
        },
        [],
      )

      const bankAdditionalServicesForApplication = bankAdditionalServices.reduce(
        (acc: AdditionalOptionsFrontdc[], option) => {
          const { productType, tariff, loanTerm, provider, providerName } = option
          const vendorOption = vendorOptions?.additionalOptionsMap[productType ?? '']

          const commonValues = mapCommonValues({
            option,
            additionalOptionsMap: vendorOptions?.additionalOptionsMap,
            bankOptionType: OptionType.BANK,
            isCredit: true,
            provider,
            providerName,
            loanTerm,
          })
          const additionalOption: AdditionalOptionsFrontdc = {
            ...commonValues,
            tariffId: tariff ?? undefined,
            tariff: vendorOption?.tariffs?.find(t => t.tariffId === tariff)?.tariff,
            // insuredAmount: INSURED_AMOUNT_VALUE_MAP[productType ?? '']?.[tariff ?? ''],
            insuredAmount: INSURED_AMOUNT_VALUE_MAP[productType ?? '']?.[tariff ?? ''],
            docType: 2, // Для услуг OptionType.BANK, всегда 2 (из аналитики)
            // Для услуг OptionType.BANK, фронт заполняет сам, по шаблону
            docNumber: getBankOptionDocNumber(productType, dcAppId),
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
        ...additionalDealerServicesForApplication,
        ...bankAdditionalServicesForApplication,
      ]
    },
    [dcAppId, vendorCode, vendorName, vendorOptions?.additionalOptionsMap],
  )

  const remapApplicationValuesForFullCalculator = useCallback(
    (values: FullOrderCalculatorFields) => {
      const {
        carId,
        taxValue,
        taxPercent,
        bankAccountNumber,
        carIdType,
        bankIdentificationCode,
        beneficiaryBank,
        inn,
        ogrn,
        kpp,
        carPassportId,
        carPassportCreationDate,
        correspondentAccount,
        legalPersonCode,
        legalPersonName,
        loanAmount,
        salesContractDate,
        salesContractId,
      } = values

      const { commonLoanCar, commonLoanData } = mapCommonApplicationValues(values, carsData)

      const newLoanCar: LoanCarFrontdc = {
        ...commonLoanCar,
        ptsNumber: carPassportId,
        ptsDate: convertedDateToString(carPassportCreationDate),
        vinNumber: carIdType === 1 ? carId : undefined,
        carBody: carIdType === 0 ? carId : undefined,
        dkpNumber: salesContractId,
        dkpDate: convertedDateToString(salesContractDate),
      }
      const newVendor: VendorFrontdc = {
        /* Не нужно на этапе калькулятора передвать в этот объект данные из pointOfSale,
        т.к. из-за этого на этапе анкеты будет не ясно, что заявка была заведена под другим вендором.
        Инфо о текущем вендоре будет передано в заявку только на этапе ее сохранения (черновик или скоринг) */
        broker: {
          vendorCode: `${legalPersonCode ?? ''}` || undefined,
          vendorName: legalPersonName,
          requisites: {
            accountRequisite: {
              bank: beneficiaryBank,
              bic: bankIdentificationCode,
              accountNumber: bankAccountNumber,
              accountCorrNumber: correspondentAccount,
              inn: inn,
              ogrn: ogrn,
              kpp: kpp,
            },
          },
          taxInfo: {
            amount: taxValue,
            percent: taxPercent,
          },
        },
      }
      const newLoanData: LoanDataFrontdc = {
        ...commonLoanData,
        amount: stringToNumber(loanAmount) ?? 0,
        additionalOptions: remapAdditionalOptionsForFullCalculator(values),
      }

      const newApplicationData = {
        loanCar: newLoanCar,
        loanData: newLoanData,
        vendor: newVendor,
        // Если попали на большой калькулятор, то выйти из него можно только заполнив все поля
        // большого калькулятора и анкеты, а это как раз anketaType=2
        anketaType: AnketaType.Full,
      }
      dispatch(updateApplication(newApplicationData))
    },
    [carsData, dispatch, remapAdditionalOptionsForFullCalculator],
  )

  return {
    remapApplicationValues: remapApplicationValuesForFullCalculator,
  }
}
