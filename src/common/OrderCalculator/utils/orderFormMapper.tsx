import {
  AdditionalOption,
  AdditionalOptionCalculateCredit,
  CalculateCreditRequest,
  LoanCar,
  OptionType,
} from '@sberauto/dictionarydc-proto/public'

import { ServicesGroupName } from 'entities/application/AdditionalOptionsRequisites/configs/additionalOptionsRequisites.config'
import { getPointOfSaleFromCookies } from 'entities/pointOfSale'
import { ProductsMap } from 'entities/reduxStore/orderSlice'
import { stringToNumber } from 'shared/utils/stringToNumber'

import {
  FormFieldNameMap,
  FullOrderCalculatorFields,
  OrderCalculatorAdditionalService,
  BriefOrderCalculatorFields,
  OrderCalculatorBankAdditionalService,
} from '../types'

const mapAdditionalOption = (
  option: AdditionalOption,
  orderFormOption: OrderCalculatorAdditionalService | OrderCalculatorBankAdditionalService,
) => ({
  optionId: option.optionId,
  optionType: option.optionType,
  optionName: option.optionName,
  price: stringToNumber(orderFormOption?.productCost),
})

const mapAdditionalOptions = (
  additionalOptions: OrderCalculatorAdditionalService[],
  vendorOptionsMap: Record<string, AdditionalOption>,
): AdditionalOptionCalculateCredit[] => {
  const filteredOptions = additionalOptions.filter(
    (option): option is Omit<typeof option, 'productType'> & { productType: string } => !!option.productType,
  )

  return filteredOptions.map(filterOption => {
    const option = vendorOptionsMap[filterOption.productType]
    const additionalOption: AdditionalOptionCalculateCredit = {
      ...mapAdditionalOption(option, filterOption),
      inCreditFlag: filterOption.isCredit,
    }

    return additionalOption
  })
}

const mapBankAdditionalOptions = (
  additionalOptions: OrderCalculatorBankAdditionalService[],
  vendorOptionsMap: Record<string, AdditionalOption>,
): AdditionalOptionCalculateCredit[] => {
  const filteredOptions = additionalOptions.filter(option => !!option.productType)

  return filteredOptions.map(filterOption => {
    const option = vendorOptionsMap[filterOption.productType || '']
    const additionalOption: AdditionalOptionCalculateCredit = {
      ...mapAdditionalOption(option, filterOption),
      tariffId: filterOption.tariff ?? undefined,
    }

    return additionalOption
  })
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
    ...mapBankAdditionalOptions(values[ServicesGroupName.bankAdditionalServices], vendorOptionsMap),
  ]

  const loanCar: LoanCar = {
    isCarNew: !!values[FormFieldNameMap.carCondition],
    autoCreateYear: values[FormFieldNameMap.carYear] ?? undefined,
    mileage: stringToNumber(values[FormFieldNameMap.carMileage]),
    brand: values[FormFieldNameMap.carBrand] || '',
    model: values[FormFieldNameMap.carModel] || '',
    autoPrice: stringToNumber(values[FormFieldNameMap.carCost]),
    equipmentPrice: getAdditionalOptionsPrice(additionalOptions),
    equipmentPriceInCredit: getAdditionalOptionsPriceInCredit(additionalOptions),
  }

  const calculateCreditRequest: CalculateCreditRequest = {
    vendorCode,
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
