import {
  AdditionalOption,
  AdditionalOptionCalculateCredit,
  CalculateCreditRequest,
  LoanCar,
} from '@sberauto/dictionarydc-proto/public'

import { ServicesGroupName } from 'entities/application/AdditionalOptionsRequisites/configs/additionalOptionsRequisites.config'
import { getPointOfSaleFromCookies } from 'entities/pointOfSale'
import { ProductsMap } from 'entities/reduxStore/orderSlice'
import { checkIsNumber } from 'shared/lib/helpers'
import { stringToNumber } from 'shared/utils/stringToNumber'

import {
  FormFieldNameMap,
  FullOrderCalculatorFields,
  OrderCalculatorAdditionalService,
  BriefOrderCalculatorFields,
} from '../types'

const mapAdditionalOptions = (
  additionalOptions: OrderCalculatorAdditionalService[],
  vendorOptionsMap: Record<string, AdditionalOption>,
): AdditionalOptionCalculateCredit[] => {
  const filteredOptions = additionalOptions.filter(
    (option): option is Omit<typeof option, 'productType'> & { productType: number } =>
      checkIsNumber(option.productType),
  )

  const additionalOptionsFormatted: AdditionalOptionCalculateCredit[] = filteredOptions.map(filterOption => {
    const option = vendorOptionsMap[filterOption.productType]

    const additionalOption: AdditionalOptionCalculateCredit = {
      optionId: option.optionId,
      optionType: option.optionType,
      optionName: option.optionName,
      tariffId: option.tariff,
      price: parseFloat(filterOption?.productCost || '0'),
      inCreditFlag: filterOption.isCredit,
    }

    return additionalOption
  })

  return additionalOptionsFormatted
}

const getAdditionalOptionsPrice = (options: AdditionalOptionCalculateCredit[]) =>
  options.reduce((acc: number, element) => acc + (element.price || 0), 0)

const getAdditionalOptionsPriceInCredit = (options: AdditionalOptionCalculateCredit[]) =>
  options.reduce((acc: number, element) => acc + (element.inCreditFlag ? element.price || 0 : 0), 0)

export const mapValuesForCalculateCreditRequest = (
  values: BriefOrderCalculatorFields | FullOrderCalculatorFields,
  vendorOptionsMap: Record<string, AdditionalOption>,
  productsMap?: ProductsMap,
): CalculateCreditRequest => {
  const { vendorCode } = getPointOfSaleFromCookies()

  const additionalOptions: AdditionalOptionCalculateCredit[] = [
    ...mapAdditionalOptions(values[ServicesGroupName.additionalEquipments], vendorOptionsMap),
    ...mapAdditionalOptions(values[ServicesGroupName.dealerAdditionalServices], vendorOptionsMap),
  ]

  const loanCar: LoanCar = {
    isCarNew: !!values[FormFieldNameMap.carCondition],
    autoCreateYear: values[FormFieldNameMap.carYear],
    mileage: stringToNumber(values[FormFieldNameMap.carMileage]),
    brand: values[FormFieldNameMap.carBrand] || '',
    model: values[FormFieldNameMap.carModel] || '',
    autoPrice: stringToNumber(values[FormFieldNameMap.carCost]),
    equipmentPrice: getAdditionalOptionsPrice(additionalOptions),
    equipmentPriceInCredit: getAdditionalOptionsPriceInCredit(additionalOptions),
  }

  const calculateCreditRequest: CalculateCreditRequest = {
    vendorCode: stringToNumber(vendorCode),
    productId: values[FormFieldNameMap.creditProduct] || undefined,
    productCodeName: productsMap?.[`${values[FormFieldNameMap.creditProduct]}`]?.productCodeName,
    productName: productsMap?.[`${values[FormFieldNameMap.creditProduct]}`]?.productName,
    downpayment: stringToNumber(values[FormFieldNameMap.initialPayment]),
    term: values[FormFieldNameMap.loanTerm] ?? undefined,
    additionalOptions: additionalOptions,
    loanCar: loanCar,
  }

  return calculateCreditRequest
}
