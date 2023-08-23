import { ServicesGroupName } from 'entities/application/AdditionalOptionsRequisites/hooks/useAdditionalServicesOptions'

import {
  OrderCalculatorAdditionalService,
  CommonError,
  FormFieldNameMap,
  FullInitialAdditionalEquipments,
  FullInitialAdditionalService,
  FullOrderCalculatorFields,
  InitialBankDetailsValue,
  OrderCalculatorFields,
  ValidationParams,
  OrderCalculatorAdditionalServiceDocInfo,
  AutoCategory,
} from './types'

const CAR_YEARS_LENGTH = 20
const CAR_YEARS_LENGTH_FOR_NEW_CAR = 2
export const MIN_LOAN_YEAR_TERM = 1

export function getCarYears(isNewCar = false) {
  const currentYear = new Date().getFullYear()
  const years = Array.from(
    new Array(isNewCar ? CAR_YEARS_LENGTH_FOR_NEW_CAR : CAR_YEARS_LENGTH),
    (_, index) => ({ value: currentYear - index }),
  )

  return years
}

export const CAR_CONDITIONS = [
  {
    value: 1,
    label: 'Новый',
  },
  {
    value: 0,
    label: 'Б/У',
  },
]

export const CAR_PASSPORT_TYPE = [
  {
    value: 1,
    label: 'ЭПТС',
  },
  {
    value: 0,
    label: 'Бумажный',
  },
]

export const INITIAL_CAR_ID_TYPE = [
  {
    value: 1,
    label: 'VIN',
  },
  {
    value: 0,
    label: 'Номер кузова',
  },
]

export const INITIAL_ADDITIONAL_SERVICE: OrderCalculatorAdditionalService = {
  productType: null,
  productCost: '',
  isCredit: false,
}

export const INITIAL_ADDITIONAL_SERVICE_DOC_INFO: OrderCalculatorAdditionalServiceDocInfo = {
  [FormFieldNameMap.documentType]: null,
  [FormFieldNameMap.documentNumber]: '',
  [FormFieldNameMap.documentDate]: null,
}

const INITIAL_BANK_DETAILS_VALUE: InitialBankDetailsValue = {
  [FormFieldNameMap.bankIdentificationCode]: '',
  [FormFieldNameMap.beneficiaryBank]: '',
  [FormFieldNameMap.bankAccountNumber]: '',
  [FormFieldNameMap.isCustomFields]: false,
  [FormFieldNameMap.correspondentAccount]: undefined,
  [FormFieldNameMap.taxPresence]: undefined,
  [FormFieldNameMap.taxation]: undefined,
}

export const FULL_INITIAL_ADDITIONAL_EQUIPMENTS: FullInitialAdditionalEquipments = {
  ...INITIAL_ADDITIONAL_SERVICE,
  ...INITIAL_ADDITIONAL_SERVICE_DOC_INFO,
  [FormFieldNameMap.legalPerson]: '',
  [FormFieldNameMap.taxValue]: null,
  [FormFieldNameMap.taxPercent]: null,
  ...INITIAL_BANK_DETAILS_VALUE,
}

export const FULL_INITIAL_ADDITIONAL_SERVICE: FullInitialAdditionalService = {
  ...INITIAL_ADDITIONAL_SERVICE,
  ...INITIAL_ADDITIONAL_SERVICE_DOC_INFO,
  [FormFieldNameMap.provider]: '',
  [FormFieldNameMap.agent]: '',
  [FormFieldNameMap.loanTerm]: undefined,
  [FormFieldNameMap.providerTaxValue]: null,
  [FormFieldNameMap.providerTaxPercent]: null,
  [FormFieldNameMap.agentTaxValue]: null,
  [FormFieldNameMap.agentTaxPercent]: null,
  ...INITIAL_BANK_DETAILS_VALUE,
}

const INITIAL_COMMON_ERROR: CommonError = {
  isExceededServicesTotalLimit: false,
  isExceededAdditionalEquipmentsLimit: false,
  isExceededDealerAdditionalServicesLimit: false,
  isExceededBankAdditionalServicesLimit: false,
  isHasNotCascoOption: false,
}

const INITIAL_VALIDATION_PARAMS: ValidationParams = {}

const initialCarCondition = CAR_CONDITIONS[0].value

export const initialValueMap: OrderCalculatorFields = {
  [FormFieldNameMap.carCondition]: initialCarCondition,
  [FormFieldNameMap.carBrand]: null,
  [FormFieldNameMap.carModel]: null,
  [FormFieldNameMap.carYear]: getCarYears(!!initialCarCondition)[0].value,
  [FormFieldNameMap.carCost]: '',
  [FormFieldNameMap.carMileage]: '',
  [FormFieldNameMap.creditProduct]: '',
  [FormFieldNameMap.initialPayment]: '',
  [FormFieldNameMap.initialPaymentPercent]: '',
  [FormFieldNameMap.loanTerm]: '',
  [ServicesGroupName.additionalEquipments]: [INITIAL_ADDITIONAL_SERVICE],
  [ServicesGroupName.dealerAdditionalServices]: [INITIAL_ADDITIONAL_SERVICE],
  [ServicesGroupName.bankAdditionalServices]: [INITIAL_ADDITIONAL_SERVICE],
  [FormFieldNameMap.commonError]: INITIAL_COMMON_ERROR,
  [FormFieldNameMap.validationParams]: INITIAL_VALIDATION_PARAMS,
}

export const fullInitialValueMap: FullOrderCalculatorFields = {
  ...initialValueMap,
  [FormFieldNameMap.carPassportType]: CAR_PASSPORT_TYPE[0].value,
  [FormFieldNameMap.carPassportId]: '',
  [FormFieldNameMap.carPassportCreationDate]: null,
  [FormFieldNameMap.carIdType]: INITIAL_CAR_ID_TYPE[0].value,
  [FormFieldNameMap.carId]: '',
  [FormFieldNameMap.salesContractId]: '',
  [FormFieldNameMap.salesContractDate]: null,
  [FormFieldNameMap.legalPerson]: '',
  [FormFieldNameMap.loanAmount]: '',
  [FormFieldNameMap.taxValue]: null,
  [FormFieldNameMap.taxPercent]: null,
  ...INITIAL_BANK_DETAILS_VALUE,
  [ServicesGroupName.additionalEquipments]: [FULL_INITIAL_ADDITIONAL_EQUIPMENTS],
  [ServicesGroupName.dealerAdditionalServices]: [FULL_INITIAL_ADDITIONAL_SERVICE],
  [ServicesGroupName.bankAdditionalServices]: [FULL_INITIAL_ADDITIONAL_SERVICE],
}

export const formMessages = {
  [FormFieldNameMap.isExceededServicesTotalLimit]:
    'Общая стоимость дополнительных услуг и оборудования не должна превышать 45% от стоимости авто',
  [FormFieldNameMap.isExceededAdditionalEquipmentsLimit]:
    'Общая стоимость дополнительного оборудования не должна превышать 30% от стоимости авто',
  [FormFieldNameMap.isExceededDealerAdditionalServicesLimit]:
    'Общая стоимость дополнительных услуг дилера не должна превышать 45% от стоимости авто',
  [FormFieldNameMap.isExceededBankAdditionalServicesLimit]:
    'Общая стоимость дополнительных услуг банка не должна превышать 30% от стоимости авто',
  [FormFieldNameMap.isHasNotCascoOption]:
    'Выбран кредитный продукт с обязательным КАСКО. Необходимо добавить дополнительную услугу КАСКО',
}

export const CREDIT_PRODUCT_PARAMS_FIELDS = [
  FormFieldNameMap.carCondition,
  FormFieldNameMap.carBrand,
  FormFieldNameMap.carModel,
  FormFieldNameMap.carYear,
]

export const AUTO_TYPE_MAP = {
  [AutoCategory.A]: '3',
  [AutoCategory.B]: '1',
  [AutoCategory.C]: '2',
}
