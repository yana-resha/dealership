import { AdditionalOption, OptionID, OptionType } from '@sberauto/dictionarydc-proto/public'

import { ServicesGroupName } from 'entities/application/DossierAreas/hooks/useAdditionalServicesOptions'

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
} from './types'

const CAR_YEARS_LENGTH = 30

function getCarYears(yearsLength: number) {
  const currentYear = new Date().getFullYear()
  const years = Array.from(new Array(yearsLength), (_, index) => ({ value: currentYear - index }))

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
export const carYears = getCarYears(CAR_YEARS_LENGTH)
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

const INITIAL_ADDITIONAL_SERVICE: OrderCalculatorAdditionalService = {
  productType: '',
  productCost: '',
  isCredit: false,
  [FormFieldNameMap.documentType]: '',
  [FormFieldNameMap.documentNumber]: '',
  [FormFieldNameMap.documentDate]: null,
}

const INITIAL_BANK_DETAILS_VALUE: InitialBankDetailsValue = {
  [FormFieldNameMap.bankIdentificationCode]: '',
  [FormFieldNameMap.beneficiaryBank]: '',
  [FormFieldNameMap.bankAccountNumber]: '',
  [FormFieldNameMap.isCustomFields]: false,
  [FormFieldNameMap.correspondentAccount]: undefined,
  [FormFieldNameMap.taxation]: undefined,
}

const FULL_INITIAL_ADDITIONAL_EQUIPMENTS: FullInitialAdditionalEquipments = {
  ...INITIAL_ADDITIONAL_SERVICE,
  [FormFieldNameMap.legalPerson]: '',
  [FormFieldNameMap.taxValue]: null,
  [FormFieldNameMap.taxPercent]: null,
  ...INITIAL_BANK_DETAILS_VALUE,
}

const FULL_INITIAL_ADDITIONAL_SERVICE: FullInitialAdditionalService = {
  ...INITIAL_ADDITIONAL_SERVICE,
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
}

const INITIAL_VALIDATION_PARAMS: ValidationParams = {}

export const initialValueMap: OrderCalculatorFields = {
  [FormFieldNameMap.carCondition]: CAR_CONDITIONS[0].value,
  [FormFieldNameMap.carBrand]: null,
  [FormFieldNameMap.carModel]: null,
  [FormFieldNameMap.carYear]: carYears[0].value,
  [FormFieldNameMap.carCost]: '',
  [FormFieldNameMap.carMileage]: '',
  [FormFieldNameMap.creditProduct]: '',
  [FormFieldNameMap.initialPayment]: '',
  [FormFieldNameMap.initialPaymentPercent]: '',
  [FormFieldNameMap.loanTerm]: '',
  [ServicesGroupName.additionalEquipments]: [INITIAL_ADDITIONAL_SERVICE],
  [ServicesGroupName.dealerAdditionalServices]: [INITIAL_ADDITIONAL_SERVICE],
  [ServicesGroupName.bankAdditionalServices]: [INITIAL_ADDITIONAL_SERVICE],
  [FormFieldNameMap.specialMark]: null,
  [FormFieldNameMap.commonError]: INITIAL_COMMON_ERROR,
  [FormFieldNameMap.validationParams]: INITIAL_VALIDATION_PARAMS,
}

export const fullInitialValueMap: FullOrderCalculatorFields = {
  ...{ ...initialValueMap, [FormFieldNameMap.specialMark]: undefined },
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
}
