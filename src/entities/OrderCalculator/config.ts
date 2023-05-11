const CAR_YEARS_LENGTH = 30

function getCarYears(yearsLength: number) {
  const currentYear = new Date().getFullYear()
  const years = Array.from(new Array(yearsLength), (_, index) => `${currentYear - index}`)

  return years
}

export const CAR_CONDITIONS = ['Новый', 'Б/У']
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

export interface OrderCalculatorFields {
  [FormFieldNameMap.carCondition]: string
  [FormFieldNameMap.carBrand]: string | null
  [FormFieldNameMap.carModel]: string | null
  [FormFieldNameMap.carYear]: string
  [FormFieldNameMap.carCost]: string
  [FormFieldNameMap.carMileage]: string
  [FormFieldNameMap.creditProduct]: string
  [FormFieldNameMap.initialPayment]: string
  [FormFieldNameMap.loanTerm]: string
  [FormFieldNameMap.additionalEquipments]: OrderCalculatorAdditionalService[]
  [FormFieldNameMap.dealerAdditionalServices]: OrderCalculatorAdditionalService[]
  [FormFieldNameMap.bankAdditionalServices]: OrderCalculatorAdditionalService[]
  [FormFieldNameMap.specialMark]: string | null
}

export const initialValueMap: OrderCalculatorFields = {
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
