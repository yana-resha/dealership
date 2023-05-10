import { FormFieldNameMap } from 'entities/OrderCalculator'

type InitialAdditionalServiceData = {
  productType: string
  productCost: string
  isCredit: boolean
}

export type OrderCalculatorData = {
  [FormFieldNameMap.carCondition]: string
  [FormFieldNameMap.carBrand]: string
  [FormFieldNameMap.carModel]: string
  [FormFieldNameMap.carYear]: string
  [FormFieldNameMap.carCost]: string
  [FormFieldNameMap.carMileage]: string
  [FormFieldNameMap.creditProduct]: string
  [FormFieldNameMap.initialPayment]: string
  [FormFieldNameMap.loanTerm]: string
  [FormFieldNameMap.additionalEquipments]: InitialAdditionalServiceData[]
  [FormFieldNameMap.dealerAdditionalServices]: InitialAdditionalServiceData[]
  [FormFieldNameMap.bankAdditionalServices]: InitialAdditionalServiceData[]
  [FormFieldNameMap.specialMark]: string
}
