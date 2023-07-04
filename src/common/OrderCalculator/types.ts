import { OptionID } from '@sberauto/dictionarydc-proto/public'
import { DocType } from '@sberauto/loanapplifecycledc-proto/public'

import { ServicesGroupName } from 'entities/application/DossierAreas/hooks/useAdditionalServicesOptions'

export enum FormFieldNameMap {
  carCondition = 'carCondition', //Состояние
  carBrand = 'carBrand', //Марка
  carModel = 'carModel', //Модель
  carYear = 'carYear', //Год выпуска
  carCost = 'carCost', //Стоимость
  carMileage = 'carMileage', //Пробег
  creditProduct = 'creditProduct', //Кредитный продукт
  initialPayment = 'initialPayment', //Первоначальный взнос
  initialPaymentPercent = 'initialPaymentPercent', //Первоначальный взнос в %
  loanTerm = 'loanTerm', //Срок
  productType = 'productType', //Вип оборудования / Тип продукта доп. услуги
  productCost = 'productCost', //Стоимость доп. услуги
  isCredit = 'isCredit', //В кредит
  specialMark = 'specialMark', //Специальная отметка
  carPassportType = 'carPassportType', //Тип ПТС
  carPassportId = 'carPassportId', //Серия и номер ПТС
  carPassportCreationDate = 'carPassportCreationDate', //Дата выдачи ПТС
  carIdType = 'carIdType', //VIN или номер кузова
  carId = 'carId', //Номер кузова/VIN
  salesContractId = 'salesContractId', //Номер ДКП
  salesContractDate = 'salesContractDate', //Дата ДКП
  legalPerson = 'legalPerson', //Юридическое лицо
  loanAmount = 'loanAmount', //Сумма кредита
  taxValue = 'taxValue', //НДС вендора
  taxPercent = 'taxPercent', //НДС вендора в %
  providerTaxValue = 'providerTaxValue', //НДС страховой компании или поставщика доп. услуги дилера
  providerTaxPercent = 'providerTaxPercent', //НДС страховой компании или поставщика доп. услуги дилера в %
  agentTaxValue = 'agentTaxValue', //НДС агента доп. услуги дилера
  agentTaxPercent = 'agentTaxPercent', //НДС агента доп. услуги дилера в %
  beneficiaryBank = 'beneficiaryBank', //Банк получатель денежных средств
  bankAccountNumber = 'bankAccountNumber', //Номер счета банка
  documentType = 'documentType', //Тип документа
  documentNumber = 'documentNumber', //Номер документа
  documentDate = 'documentDate', //Дата документа
  bankIdentificationCode = 'bankIdentificationCode', //БИК
  correspondentAccount = 'correspondentAccount', //Корреспондентский счет
  taxation = 'taxation', //Налог
  provider = 'provider', //Страховая компания или поставщик
  agent = 'agent', //Агент получатель
  isCustomFields = 'isCustomFields', //Ручной ввод
  commonError = 'commonError',
  isExceededServicesTotalLimit = 'isExceededServicesTotalLimit',
  isExceededAdditionalEquipmentsLimit = 'isExceededAdditionalEquipmentsLimit',
  isExceededDealerAdditionalServicesLimit = 'isExceededDealerAdditionalServicesLimit',
  isExceededBankAdditionalServicesLimit = 'isExceededBankAdditionalServicesLimit',
  validationParams = 'validationParams',
}

export interface OrderCalculatorAdditionalService {
  [FormFieldNameMap.productType]: OptionID | string
  [FormFieldNameMap.productCost]: string
  [FormFieldNameMap.isCredit]: boolean
}

export interface OrderCalculatorAdditionalServiceDocInfo {
  [FormFieldNameMap.documentType]: DocType | null
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
    OrderCalculatorAdditionalServiceDocInfo,
    InitialBankDetailsValue {
  [FormFieldNameMap.legalPerson]: string
  [FormFieldNameMap.taxValue]: number | null
  [FormFieldNameMap.taxPercent]: number | null
}

export interface FullInitialAdditionalService
  extends OrderCalculatorAdditionalService,
    OrderCalculatorAdditionalServiceDocInfo,
    InitialBankDetailsValue {
  [FormFieldNameMap.provider]: string
  [FormFieldNameMap.agent]: string
  [FormFieldNameMap.loanTerm]: number | undefined
  [FormFieldNameMap.providerTaxValue]: number | null
  [FormFieldNameMap.providerTaxPercent]: number | null
  [FormFieldNameMap.agentTaxValue]: number | null
  [FormFieldNameMap.agentTaxPercent]: number | null
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
  [FormFieldNameMap.taxValue]: number | null
  [FormFieldNameMap.taxPercent]: number | null
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

export type CreditProductParams = Partial<
  Pick<
    OrderCalculatorFields,
    | FormFieldNameMap.carCondition
    | FormFieldNameMap.carBrand
    | FormFieldNameMap.carModel
    | FormFieldNameMap.carYear
  >
>
