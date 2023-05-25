export { AdditionalServicesContainer } from './ui/AdditionalServicesContainer/AdditionalServicesContainer'
export { AreaFooter } from './ui/AreaFooter/AreaFooter'

export { useAdditionalServices } from './hooks/useAdditionalServices'
export { useAdditionalServiceIds } from './hooks/useAdditionalServiceIds'

export { useInitialPaymentFullCalc, useInitialPayment } from './hooks/useInitialPayment'
export { useGetCreditProductListQuery } from './hooks/useGetCreditProductListQuery'
export { useGetCarListQuery } from './hooks/useGetCarListQuery'

export {
  baseFormValidation,
  additionalServiceBaseValidation,
  checkAdditionalEquipmentsLimit,
  checkDealerAdditionalServicesLimit,
  checkBankAdditionalServicesLimit,
} from './utils/baseFormValidation'
export { prepearCreditProduct, prepearBankOptions } from './utils/prepearCreditProductListData'

export {
  CAR_CONDITIONS,
  carYears,
  LOAN_TERM,
  CAR_PASSPORT_TYPE,
  INITIAL_CAR_ID_TYPE,
  FormFieldNameMap,
  initialValueMap,
  fullInitialValueMap,
  formMessages,
  ADDITIONAL_EQUIPMENTS,
} from './config'

export type {
  OrderCalculatorFields,
  OrderCalculatorAdditionalService,
  CommonError,
  FormMessages,
} from './config'

export type {
  RequiredProduct,
  ProductsMap,
  RequiredBankOption,
  BankOptionsMap,
} from './utils/prepearCreditProductListData'
