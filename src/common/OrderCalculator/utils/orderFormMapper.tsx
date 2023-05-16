import { AdditionalOption, CalculateCreditRequest, LoanCar } from '@sberauto/dictionarydc-proto/public'

import {
  FormFieldNameMap,
  OrderCalculatorAdditionalService,
  OrderCalculatorFields,
} from 'entities/OrderCalculator/config'

export const mapValuesForCalculateCreditRequest = (values: OrderCalculatorFields): CalculateCreditRequest => {
  const additionalOptions: AdditionalOption[] = [
    ...mapAdditionalOptions(values[FormFieldNameMap.additionalEquipments], 'additionalEquipment'),
    ...mapAdditionalOptions(values[FormFieldNameMap.dealerAdditionalServices], 'dealerServices'),
  ]
  const loanCar: LoanCar = {
    isCarNew: values[FormFieldNameMap.carCondition] === 'Новый' ? true : false,
    autoCreateYear: Number(values[FormFieldNameMap.carYear]),
    mileage: Number(values[FormFieldNameMap.carMileage]),
    brand: values[FormFieldNameMap.carBrand] || '',
    model: values[FormFieldNameMap.carModel] || '',
    autoPrice: Number(values[FormFieldNameMap.carCost]),
    equipmentPrice: getAdditionalOptionsPrice(additionalOptions),
    equipmentPriceInCredit: getAdditionalOptionsPriceInCredit(additionalOptions),
  }
  const calculateCreditRequest: CalculateCreditRequest = {
    productName: values[FormFieldNameMap.creditProduct],
    downpayment: Number(values[FormFieldNameMap.initialPayment]),
    term: Number(values[FormFieldNameMap.loanTerm]),
    creditAmountWithAddons:
      Number(values[FormFieldNameMap.carCost]) +
      Number(getAdditionalOptionsPrice(additionalOptions)) -
      Number(values[FormFieldNameMap.initialPayment]),
    creditAmountWithoutAddons:
      Number(values[FormFieldNameMap.carCost]) - Number(values[FormFieldNameMap.initialPayment]),
    additionalOptions: additionalOptions,
    loanCar: loanCar,
  }

  return calculateCreditRequest
}

const mapAdditionalOptions = (
  additionalOptions: OrderCalculatorAdditionalService[],
  type: string,
): AdditionalOption[] => {
  const filteredOptions = additionalOptions.filter(option => option.productType !== '')
  const additionalOptionsFormatted: AdditionalOption[] = filteredOptions.map(option => {
    const additionalOption: AdditionalOption = {
      type: type,
      name: option.productType,
      price: Number(option.productCost),
      inCreditFlag: option.isCredit,
    }

    return additionalOption
  })

  return additionalOptionsFormatted
}

const getAdditionalOptionsPrice = (options: AdditionalOption[]) =>
  options.reduce((acc: number, element: AdditionalOption) => acc + (element.price || 0), 0)

const getAdditionalOptionsPriceInCredit = (options: AdditionalOption[]) =>
  options.reduce(
    (acc: number, element: AdditionalOption) => acc + (element.inCreditFlag ? element.price || 0 : 0),
    0,
  )
