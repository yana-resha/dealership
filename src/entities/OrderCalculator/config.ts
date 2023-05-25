const CAR_YEARS_LENGTH = 30

function getCarYears(yearsLength: number) {
  const currentYear = new Date().getFullYear()
  const years = Array.from(new Array(yearsLength), (_, index) => `${currentYear - index}`)

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
// TODO DCB-272 Удалить getCarYears и LOAN_TERM, после интеграции большого калькулятора это будет не нужно
export const carYears = getCarYears(CAR_YEARS_LENGTH)
export const LOAN_TERM = ['12', '24', '36', '48']
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

export enum FormFieldNameMap {
  carCondition = 'carCondition',
  carBrand = 'carBrand',
  carModel = 'carModel',
  carYear = 'carYear',
  carCost = 'carCost',
  carMileage = 'carMileage',
  creditProduct = 'creditProduct',
  initialPayment = 'initialPayment',
  initialPaymentPercent = 'initialPaymentPercent',
  loanTerm = 'loanTerm',
  productType = 'productType',
  additionalEquipments = 'additionalEquipments',
  dealerAdditionalServices = 'dealerAdditionalServices',
  bankAdditionalServices = 'bankAdditionalServices',
  specialMark = 'specialMark',
  carPassportType = 'carPassportType',
  carPassportId = 'carPassportId',
  carPassportCreationDate = 'carPassportCreationDate',
  carIdType = 'carIdType',
  carId = 'carId',
  salesContractId = 'salesContractId',
  salesContractDate = 'salesContractDate',
  legalPerson = 'legalPerson',
  productCost = 'productCost',
  isCreditAdditionalService = 'isCreditAdditionalService',
  loanAmount = 'loanAmount',
  beneficiaryBank = 'beneficiaryBank',
  bankAccountNumber = 'bankAccountNumber',
  bankIdentificationCode = 'bankIdentificationCode',
  correspondentAccount = 'correspondentAccount',
  taxation = 'taxation',
  provider = 'provider',
  agent = 'agent',
  documentId = 'documentId',
  isCustomFields = 'isCustomFields',
  commonError = 'commonError',
  isExceededServicesTotalLimit = 'isExceededServicesTotalLimit',
  isExceededAdditionalEquipmentsLimit = 'isExceededAdditionalEquipmentsLimit',
  isExceededDealerAdditionalServicesLimit = 'isExceededDealerAdditionalServicesLimit',
  isExceededBankAdditionalServicesLimit = 'isExceededBankAdditionalServicesLimit',
}

export interface OrderCalculatorAdditionalService {
  productType: string
  productCost: string
  isCredit: boolean
}

const INITIAL_ADDITIONAL_SERVICE: OrderCalculatorAdditionalService = {
  productType: '',
  productCost: '',
  isCredit: false,
}

const INITIAL_BANK_DETAILS_VALUE = {
  [FormFieldNameMap.bankIdentificationCode]: '',
  [FormFieldNameMap.beneficiaryBank]: '',
  [FormFieldNameMap.bankAccountNumber]: '',
  [FormFieldNameMap.correspondentAccount]: undefined,
  [FormFieldNameMap.taxation]: undefined,
}

const FULL_INITIAL_ADDITIONAL_EQUIPMENTS = {
  ...INITIAL_ADDITIONAL_SERVICE,
  [FormFieldNameMap.legalPerson]: '',
  ...INITIAL_BANK_DETAILS_VALUE,
}

const FULL_INITIAL_ADDITIONAL_SERVICE = {
  ...INITIAL_ADDITIONAL_SERVICE,
  [FormFieldNameMap.provider]: '',
  [FormFieldNameMap.agent]: '',
  [FormFieldNameMap.loanTerm]: '',
  [FormFieldNameMap.documentId]: '',
  ...INITIAL_BANK_DETAILS_VALUE,
}

export interface CommonError {
  [FormFieldNameMap.isExceededServicesTotalLimit]: boolean
  [FormFieldNameMap.isExceededAdditionalEquipmentsLimit]: boolean
  [FormFieldNameMap.isExceededDealerAdditionalServicesLimit]: boolean
  [FormFieldNameMap.isExceededBankAdditionalServicesLimit]: boolean
}

const INITIAL_COMMON_ERROR = {
  [FormFieldNameMap.isExceededServicesTotalLimit]: false,
  [FormFieldNameMap.isExceededAdditionalEquipmentsLimit]: false,
  [FormFieldNameMap.isExceededDealerAdditionalServicesLimit]: false,
  [FormFieldNameMap.isExceededBankAdditionalServicesLimit]: false,
}

export interface OrderCalculatorFields {
  [FormFieldNameMap.carCondition]: number
  [FormFieldNameMap.carBrand]: string | null
  [FormFieldNameMap.carModel]: string | null
  [FormFieldNameMap.carYear]: string
  [FormFieldNameMap.carCost]: string
  [FormFieldNameMap.carMileage]: string
  [FormFieldNameMap.creditProduct]: string
  [FormFieldNameMap.initialPayment]: string
  [FormFieldNameMap.initialPaymentPercent]: string
  [FormFieldNameMap.loanTerm]: string
  [FormFieldNameMap.additionalEquipments]: OrderCalculatorAdditionalService[]
  [FormFieldNameMap.dealerAdditionalServices]: OrderCalculatorAdditionalService[]
  [FormFieldNameMap.bankAdditionalServices]: OrderCalculatorAdditionalService[]
  [FormFieldNameMap.specialMark]: string | null
  [FormFieldNameMap.commonError]: CommonError
}

export const initialValueMap: OrderCalculatorFields = {
  [FormFieldNameMap.carCondition]: CAR_CONDITIONS[0].value,
  [FormFieldNameMap.carBrand]: null,
  [FormFieldNameMap.carModel]: null,
  [FormFieldNameMap.carYear]: carYears[0],
  [FormFieldNameMap.carCost]: '',
  [FormFieldNameMap.carMileage]: '',
  [FormFieldNameMap.creditProduct]: '',
  [FormFieldNameMap.initialPayment]: '',
  [FormFieldNameMap.initialPaymentPercent]: '',
  [FormFieldNameMap.loanTerm]: '',
  [FormFieldNameMap.additionalEquipments]: [INITIAL_ADDITIONAL_SERVICE],
  [FormFieldNameMap.dealerAdditionalServices]: [INITIAL_ADDITIONAL_SERVICE],
  [FormFieldNameMap.bankAdditionalServices]: [INITIAL_ADDITIONAL_SERVICE],
  [FormFieldNameMap.specialMark]: null,
  [FormFieldNameMap.commonError]: INITIAL_COMMON_ERROR,
}

export const fullInitialValueMap = {
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
  [FormFieldNameMap.bankIdentificationCode]: '',
  [FormFieldNameMap.beneficiaryBank]: '',
  [FormFieldNameMap.bankAccountNumber]: '',
  [FormFieldNameMap.isCustomFields]: false,
  [FormFieldNameMap.correspondentAccount]: undefined,
  [FormFieldNameMap.taxation]: undefined,
  [FormFieldNameMap.additionalEquipments]: [FULL_INITIAL_ADDITIONAL_EQUIPMENTS],
  [FormFieldNameMap.dealerAdditionalServices]: [FULL_INITIAL_ADDITIONAL_SERVICE],
  [FormFieldNameMap.bankAdditionalServices]: [FULL_INITIAL_ADDITIONAL_SERVICE],
}

export type FormMessages = {
  [FormFieldNameMap.isExceededServicesTotalLimit]: string
  [FormFieldNameMap.isExceededAdditionalEquipmentsLimit]: string
  [FormFieldNameMap.isExceededDealerAdditionalServicesLimit]: string
  [FormFieldNameMap.isExceededBankAdditionalServicesLimit]: string
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
