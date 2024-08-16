import { ServicesGroupName } from 'entities/applications/AdditionalOptionsRequisites/configs/additionalOptionsRequisites.config'

import {
  OrderCalculatorAdditionalService,
  CommonError,
  FormFieldNameMap,
  FullInitialAdditionalEquipments,
  FullInitialAdditionalService,
  FullOrderCalculatorFields,
  InitialBankDetailsValue,
  BriefOrderCalculatorFields,
  ValidationParams,
  OrderCalculatorAdditionalServiceDocInfo,
  AutoCategory,
  OrderCalculatorBankAdditionalService,
  FullInitialBankAdditionalService,
  CreditProductParams,
} from './types'

export const CAR_YEARS_LENGTH = 20
const CAR_YEARS_LENGTH_FOR_NEW_CAR = 2
export const MIN_LOAN_YEAR_TERM = 1
export const CASCO_OPTION_ID = '15'

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
  [FormFieldNameMap.productType]: null,
  [FormFieldNameMap.productCost]: '',
  [FormFieldNameMap.isCredit]: false,
  [FormFieldNameMap.cascoLimit]: '',
}

export const INITIAL_BANK_ADDITIONAL_SERVICE: OrderCalculatorBankAdditionalService = {
  [FormFieldNameMap.productType]: null,
  [FormFieldNameMap.productCost]: '',
  [FormFieldNameMap.loanTerm]: null,
  [FormFieldNameMap.tariff]: null,
}

export const INITIAL_ADDITIONAL_SERVICE_DOC_INFO: OrderCalculatorAdditionalServiceDocInfo = {
  [FormFieldNameMap.documentType]: null,
  [FormFieldNameMap.documentNumber]: '',
  [FormFieldNameMap.documentDate]: null,
}

export const INITIAL_BANK_DETAILS_VALUE: InitialBankDetailsValue = {
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
  ...INITIAL_BANK_DETAILS_VALUE,
  [FormFieldNameMap.broker]: null,
}

export const FULL_INITIAL_ADDITIONAL_SERVICE: FullInitialAdditionalService = {
  ...INITIAL_ADDITIONAL_SERVICE,
  ...INITIAL_ADDITIONAL_SERVICE_DOC_INFO,
  [FormFieldNameMap.provider]: null,
  [FormFieldNameMap.broker]: null,
  [FormFieldNameMap.loanTerm]: null,
  ...INITIAL_BANK_DETAILS_VALUE,
}

export const FULL_INITIAL_BANK_ADDITIONAL_SERVICE: FullInitialBankAdditionalService = {
  ...INITIAL_BANK_ADDITIONAL_SERVICE,
  [FormFieldNameMap.provider]: null,
}

const INITIAL_COMMON_ERROR: CommonError = {
  isExceededServicesTotalLimit: false,
  isExceededAdditionalEquipmentsLimit: false,
  isExceededDealerAdditionalServicesLimit: false,
  isExceededBankAdditionalServicesLimit: false,
  isHasNotCascoOption: false,
  isCurrentGovProgramNotFoundInList: false,
  isCurrentCreditProductNotFoundInList: false,
}

const INITIAL_VALIDATION_PARAMS: ValidationParams = {}

const initialCarCondition = CAR_CONDITIONS[0].value

export const initialValueMap: BriefOrderCalculatorFields = {
  [FormFieldNameMap.IS_GOVERNMENT_PROGRAM]: false,
  [FormFieldNameMap.IS_DFO_PROGRAM]: false,
  [FormFieldNameMap.carCondition]: initialCarCondition,
  [FormFieldNameMap.carBrand]: null,
  [FormFieldNameMap.carModel]: null,
  [FormFieldNameMap.carYear]: null,
  [FormFieldNameMap.carCost]: '',
  [FormFieldNameMap.carMileage]: '',
  [FormFieldNameMap.GOVERNMENT_PROGRAM]: null,
  [FormFieldNameMap.GOVERNMENT_NAME]: null,
  [FormFieldNameMap.GOVERNMENT_DISCOUNT]: '',
  [FormFieldNameMap.GOVERNMENT_DISCOUNT_PERCENT]: '',
  [FormFieldNameMap.creditProduct]: null,
  [FormFieldNameMap.initialPayment]: '',
  [FormFieldNameMap.initialPaymentPercent]: '',
  [FormFieldNameMap.loanTerm]: null,
  [ServicesGroupName.additionalEquipments]: [INITIAL_ADDITIONAL_SERVICE],
  [ServicesGroupName.dealerAdditionalServices]: [INITIAL_ADDITIONAL_SERVICE],
  [ServicesGroupName.bankAdditionalServices]: [INITIAL_BANK_ADDITIONAL_SERVICE],
  [FormFieldNameMap.commonError]: INITIAL_COMMON_ERROR,
  [FormFieldNameMap.validationParams]: INITIAL_VALIDATION_PARAMS,
}

export const fullInitialValueMap: FullOrderCalculatorFields = {
  ...initialValueMap,
  [FormFieldNameMap.carPassportType]: null,
  [FormFieldNameMap.carPassportId]: '',
  [FormFieldNameMap.carPassportCreationDate]: null,
  [FormFieldNameMap.carIdType]: null,
  [FormFieldNameMap.carId]: '',
  [FormFieldNameMap.salesContractId]: '',
  [FormFieldNameMap.salesContractDate]: null,
  [FormFieldNameMap.loanAmount]: '',
  ...INITIAL_BANK_DETAILS_VALUE,
  [ServicesGroupName.additionalEquipments]: [FULL_INITIAL_ADDITIONAL_EQUIPMENTS],
  [ServicesGroupName.dealerAdditionalServices]: [FULL_INITIAL_ADDITIONAL_SERVICE],
  [ServicesGroupName.bankAdditionalServices]: [FULL_INITIAL_BANK_ADDITIONAL_SERVICE],
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

export const CREDIT_PRODUCT_PARAMS_FIELDS: (keyof CreditProductParams)[] = [
  FormFieldNameMap.IS_GOVERNMENT_PROGRAM,
  FormFieldNameMap.IS_DFO_PROGRAM,
  FormFieldNameMap.carCondition,
  FormFieldNameMap.carBrand,
  FormFieldNameMap.carModel,
  FormFieldNameMap.carYear,
  FormFieldNameMap.carCost,
  FormFieldNameMap.carPassportCreationDate,
]

export const AUTO_TYPE_MAP = {
  [AutoCategory.A]: '3',
  [AutoCategory.B]: '1',
  [AutoCategory.C]: '2',
}

export enum BankOptionTariffCode {
  FIRST = '100',
  SECOND = '101',
  THIRD = '102',
  FOURTH = '103',
}

export const INSURED_AMOUNT_VALUE_MAP: Record<string, number> = {
  [BankOptionTariffCode.FIRST]: 700000,
  [BankOptionTariffCode.SECOND]: 1200000,
  [BankOptionTariffCode.THIRD]: 510000,
}
