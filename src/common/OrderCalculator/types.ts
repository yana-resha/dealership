import { OptionID } from '@sberauto/dictionarydc-proto/public'

import { ServicesGroupName } from 'entities/application/DossierAreas/hooks/useAdditionalServicesOptions'

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
  documentType = 'documentType',
  documentNumber = 'documentNumber',
  documentDate = 'documentDate',
  bankIdentificationCode = 'bankIdentificationCode',
  correspondentAccount = 'correspondentAccount',
  taxation = 'taxation',
  provider = 'provider',
  agent = 'agent',
  isCustomFields = 'isCustomFields',
  commonError = 'commonError',
  isExceededServicesTotalLimit = 'isExceededServicesTotalLimit',
  isExceededAdditionalEquipmentsLimit = 'isExceededAdditionalEquipmentsLimit',
  isExceededDealerAdditionalServicesLimit = 'isExceededDealerAdditionalServicesLimit',
  isExceededBankAdditionalServicesLimit = 'isExceededBankAdditionalServicesLimit',
  validationParams = 'validationParams',
}

export interface OrderCalculatorAdditionalService {
  [FormFieldNameMap.productType]: OptionID | undefined
  [FormFieldNameMap.productCost]: string
  [FormFieldNameMap.isCredit]: boolean
  [FormFieldNameMap.documentType]: number | string
  [FormFieldNameMap.documentNumber]: string
  [FormFieldNameMap.documentDate]: Date | null
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
  [FormFieldNameMap.loanTerm]: number | undefined
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
  [FormFieldNameMap.carYear]: number
  [FormFieldNameMap.carCost]: string
  [FormFieldNameMap.carMileage]: string
  [FormFieldNameMap.creditProduct]: string
  [FormFieldNameMap.initialPayment]: string
  [FormFieldNameMap.initialPaymentPercent]: string
  [FormFieldNameMap.loanTerm]: number | string
  [ServicesGroupName.additionalEquipments]: OrderCalculatorAdditionalService[]
  [ServicesGroupName.dealerAdditionalServices]: OrderCalculatorAdditionalService[]
  [ServicesGroupName.bankAdditionalServices]: OrderCalculatorAdditionalService[]
  [FormFieldNameMap.specialMark]: string | null
  [FormFieldNameMap.commonError]: CommonError
  [FormFieldNameMap.validationParams]: ValidationParams
}

export interface FullOrderCalculatorFields
  extends InitialBankDetailsValue,
    Omit<
      OrderCalculatorFields,
      | FormFieldNameMap.specialMark
      | ServicesGroupName.additionalEquipments
      | ServicesGroupName.dealerAdditionalServices
      | ServicesGroupName.bankAdditionalServices
    > {
  [FormFieldNameMap.carPassportType]: number
  [FormFieldNameMap.carPassportId]: string
  [FormFieldNameMap.carPassportCreationDate]: Date | null
  [FormFieldNameMap.carIdType]: number
  [FormFieldNameMap.carId]: string
  [FormFieldNameMap.salesContractId]: string
  [FormFieldNameMap.salesContractDate]: Date | null
  [FormFieldNameMap.legalPerson]: string
  [FormFieldNameMap.loanAmount]: string
  [ServicesGroupName.additionalEquipments]: FullInitialAdditionalEquipments[]
  [ServicesGroupName.dealerAdditionalServices]: FullInitialAdditionalService[]
  [ServicesGroupName.bankAdditionalServices]: FullInitialAdditionalService[]
}

export type FormMessages = {
  [FormFieldNameMap.isExceededServicesTotalLimit]: string
  [FormFieldNameMap.isExceededAdditionalEquipmentsLimit]: string
  [FormFieldNameMap.isExceededDealerAdditionalServicesLimit]: string
  [FormFieldNameMap.isExceededBankAdditionalServicesLimit]: string
}
