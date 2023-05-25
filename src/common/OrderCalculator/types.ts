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
  productCost = 'productCost',
  isCredit = 'isCredit',
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
  validationParams = 'validationParams',
}

export interface OrderCalculatorAdditionalService {
  [FormFieldNameMap.productType]: string
  [FormFieldNameMap.productCost]: string
  [FormFieldNameMap.isCredit]: boolean
}

export interface InitialBankDetailsValue {
  [FormFieldNameMap.bankIdentificationCode]: string
  [FormFieldNameMap.beneficiaryBank]: string
  [FormFieldNameMap.bankAccountNumber]: string
  [FormFieldNameMap.isCustomFields]: boolean
  [FormFieldNameMap.correspondentAccount]?: string
  [FormFieldNameMap.taxation]?: string
}

export interface FullInitialAdditionalEquipments
  extends OrderCalculatorAdditionalService,
    InitialBankDetailsValue {
  [FormFieldNameMap.legalPerson]: string
}

export interface FullInitialAdditionalService
  extends OrderCalculatorAdditionalService,
    InitialBankDetailsValue {
  [FormFieldNameMap.provider]: string
  [FormFieldNameMap.agent]: string
  [FormFieldNameMap.loanTerm]: string
  [FormFieldNameMap.documentId]: string
}

export interface CommonError {
  isExceededServicesTotalLimit: boolean
  isExceededAdditionalEquipmentsLimit: boolean
  isExceededDealerAdditionalServicesLimit: boolean
  isExceededBankAdditionalServicesLimit: boolean
}

export interface ValidationParams {
  maxInitialPayment?: number
  maxInitialPaymentPercent?: number
  minInitialPayment?: number
  minInitialPaymentPercent?: number
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
  [FormFieldNameMap.validationParams]: ValidationParams
}

export interface FullOrderCalculatorFields
  extends InitialBankDetailsValue,
    Omit<
      OrderCalculatorFields,
      | FormFieldNameMap.specialMark
      | FormFieldNameMap.additionalEquipments
      | FormFieldNameMap.dealerAdditionalServices
      | FormFieldNameMap.bankAdditionalServices
    > {
  [FormFieldNameMap.carPassportType]: number
  [FormFieldNameMap.carPassportId]: string
  [FormFieldNameMap.carPassportCreationDate]: string
  [FormFieldNameMap.carIdType]: number
  [FormFieldNameMap.carId]: string
  [FormFieldNameMap.salesContractId]: string
  [FormFieldNameMap.salesContractDate]: string
  [FormFieldNameMap.legalPerson]: string
  [FormFieldNameMap.loanAmount]: string
  [FormFieldNameMap.additionalEquipments]: FullInitialAdditionalEquipments[]
  [FormFieldNameMap.dealerAdditionalServices]: FullInitialAdditionalService[]
  [FormFieldNameMap.bankAdditionalServices]: FullInitialAdditionalService[]
}

export type FormMessages = {
  [FormFieldNameMap.isExceededServicesTotalLimit]: string
  [FormFieldNameMap.isExceededAdditionalEquipmentsLimit]: string
  [FormFieldNameMap.isExceededDealerAdditionalServicesLimit]: string
  [FormFieldNameMap.isExceededBankAdditionalServicesLimit]: string
}
