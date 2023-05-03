import { getCarYears } from './OrderCalculator.utils'

const CAR_YEARS_LENGTH = 30

export const CAR_CONDITIONS = ['Новый', 'Б/У']
export const carYears = getCarYears(CAR_YEARS_LENGTH)
export const LOAN_TERM = ['12', '24', '36', '48']

const INITIAL_ADDITIONAL_SERVICE = {
  productType: '',
  productCost: '',
  isCredit: false,
}

export enum FormFieldNameMap {
  carCondition = 'carCondition',
  carBrand = 'carBrand',
  carModel = 'carModel',
  carYear = 'carYear',
  carCost = 'carCost',
  carMileage = 'carMileage',
  creditProduct = 'creditProduct',
  initialPayment = 'initialPayment',
  loanTerm = 'loanTerm',
  additionalEquipments = 'additionalEquipments',
  dealerAdditionalServices = 'dealerAdditionalServices',
  bankAdditionalServices = 'bankAdditionalServices',
  specialMark = 'specialMark',
}

export const initialValueMap = {
  [FormFieldNameMap.carCondition]: CAR_CONDITIONS[0],
  [FormFieldNameMap.carBrand]: null,
  [FormFieldNameMap.carModel]: null,
  [FormFieldNameMap.carYear]: carYears[0],
  [FormFieldNameMap.carCost]: '',
  [FormFieldNameMap.carMileage]: '',
  [FormFieldNameMap.creditProduct]: '',
  [FormFieldNameMap.initialPayment]: '',
  [FormFieldNameMap.loanTerm]: LOAN_TERM[0],
  [FormFieldNameMap.additionalEquipments]: [INITIAL_ADDITIONAL_SERVICE],
  [FormFieldNameMap.dealerAdditionalServices]: [INITIAL_ADDITIONAL_SERVICE],
  [FormFieldNameMap.bankAdditionalServices]: [INITIAL_ADDITIONAL_SERVICE],
  [FormFieldNameMap.specialMark]: null,
}
