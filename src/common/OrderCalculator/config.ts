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
  const years = Array.from(new Array(yearsLength), (_, index) => ({ value: `${currentYear - index}` }))

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

export const ADDITIONAL_EQUIPMENTS = [
  { type: 1, optionName: 'Адаптация и подготовка автомобиля' },
  { type: 2, optionName: 'Автосигнализация, автозапуск/установка' },
  { type: 3, optionName: 'Акустическая система, автозвук/установка' },
  { type: 4, optionName: 'Видеорегистратор/установка' },
  { type: 5, optionName: 'Диски/резина/колеса' },
  { type: 6, optionName: 'Защита картера, коробки передач/установка' },
  { type: 7, optionName: 'Защита решётки радиатора, защитные плёнки/установка' },
  { type: 8, optionName: 'Ковры в салон/багажник' },
  { type: 9, optionName: 'Комплект для обработки автомобиля' },
  { type: 10, optionName: 'Обработка антишум, антикоррозия, полировка' },
  { type: 11, optionName: 'Подкрылки,брызговики, дуги поперечные,рейлинги /установка' },
  { type: 12, optionName: 'Тонировка, покраска, колеровка' },
  { type: 13, optionName: 'Тюнинг автомобиля' },
  { type: 14, optionName: 'Прочее' },
]

const INITIAL_ADDITIONAL_SERVICE: OrderCalculatorAdditionalService = {
  productType: '',
  productCost: '',
  isCredit: false,
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
  ...INITIAL_BANK_DETAILS_VALUE,
}

const FULL_INITIAL_ADDITIONAL_SERVICE: FullInitialAdditionalService = {
  ...INITIAL_ADDITIONAL_SERVICE,
  [FormFieldNameMap.provider]: '',
  [FormFieldNameMap.agent]: '',
  [FormFieldNameMap.loanTerm]: '',
  [FormFieldNameMap.documentId]: '',
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
  ...initialValueMap,
  [FormFieldNameMap.carPassportType]: CAR_PASSPORT_TYPE[0].value,
  [FormFieldNameMap.carPassportId]: '',
  [FormFieldNameMap.carPassportCreationDate]: '',
  [FormFieldNameMap.carIdType]: INITIAL_CAR_ID_TYPE[0].value,
  [FormFieldNameMap.carId]: '',
  [FormFieldNameMap.salesContractId]: '',
  [FormFieldNameMap.salesContractDate]: '',
  [FormFieldNameMap.legalPerson]: '',
  [FormFieldNameMap.loanAmount]: '',
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
