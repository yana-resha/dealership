import { Car } from '@sberauto/dictionarydc-proto/public'
import { DocType } from '@sberauto/loanapplifecycledc-proto/public'

import { ServicesGroupName } from 'entities/application/AdditionalOptionsRequisites/configs/additionalOptionsRequisites.config'

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
  carPassportType = 'carPassportType', //Тип ПТС
  carPassportId = 'carPassportId', //Серия и номер ПТС
  carPassportCreationDate = 'carPassportCreationDate', //Дата выдачи ПТС
  carIdType = 'carIdType', //VIN или номер кузова
  carId = 'carId', //Номер кузова/VIN
  salesContractId = 'salesContractId', //Номер ДКП
  salesContractDate = 'salesContractDate', //Дата ДКП
  legalPersonCode = 'legalPersonCode', //Юридическое лицо (код или id)
  legalPersonName = 'legalPersonName', // Название юридического лица
  loanAmount = 'loanAmount', //Сумма кредита
  taxValue = 'taxValue', //НДС вендора или брокера
  taxPercent = 'taxPercent', //НДС вендора или брокера в %
  providerTaxValue = 'providerTaxValue', //НДС страховой компании или поставщика доп. услуги дилера
  providerTaxPercent = 'providerTaxPercent', //НДС страховой компании или поставщика доп. услуги дилера в %
  agentTaxValue = 'agentTaxValue', //НДС агента доп. услуги дилера
  beneficiaryBank = 'beneficiaryBank', //Банк получатель денежных средств
  bankAccountNumber = 'bankAccountNumber', //Расчетный счет
  documentType = 'documentType', //Тип документа
  documentNumber = 'documentNumber', //Номер документа
  documentDate = 'documentDate', //Дата документа
  bankIdentificationCode = 'bankIdentificationCode', //БИК
  correspondentAccount = 'correspondentAccount', //Корреспондентский счет
  taxation = 'taxation', //Налог
  provider = 'provider', //Страховая компания или поставщик (code или id)
  providerName = 'providerName', //Страховая компания или поставщик (название)
  broker = 'broker', //Агент получатель (code или id)
  brokerName = 'brokerName', //Агент получатель (название)
  isCustomFields = 'isCustomFields', //Ручной ввод
  commonError = 'commonError',
  isExceededServicesTotalLimit = 'isExceededServicesTotalLimit',
  isExceededAdditionalEquipmentsLimit = 'isExceededAdditionalEquipmentsLimit',
  isExceededDealerAdditionalServicesLimit = 'isExceededDealerAdditionalServicesLimit',
  isExceededBankAdditionalServicesLimit = 'isExceededBankAdditionalServicesLimit',
  validationParams = 'validationParams',
  cascoLimit = 'cascoLimit',
  isHasNotCascoOption = 'isHasNotCascoOption',
  taxPresence = 'taxPresence',
  inn = 'inn',
  ogrn = 'ogrn',
  kpp = 'kpp',
  tariff = 'tariff',
}

export interface OrderCalculatorAdditionalService {
  [FormFieldNameMap.productType]: string | null
  [FormFieldNameMap.productCost]: string
  [FormFieldNameMap.isCredit]: boolean
  [FormFieldNameMap.cascoLimit]: string
}

export interface OrderCalculatorBankAdditionalService
  extends Omit<
    OrderCalculatorAdditionalService,
    `${FormFieldNameMap.isCredit}` | `${FormFieldNameMap.cascoLimit}`
  > {
  [FormFieldNameMap.tariff]: number | null
  [FormFieldNameMap.loanTerm]: number | null
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
  [FormFieldNameMap.taxPresence]?: boolean
  [FormFieldNameMap.inn]?: string
  [FormFieldNameMap.ogrn]?: string
  [FormFieldNameMap.kpp]?: string
  [FormFieldNameMap.taxation]?: string
}

export interface FullInitialAdditionalEquipments
  extends OrderCalculatorAdditionalService,
    OrderCalculatorAdditionalServiceDocInfo,
    InitialBankDetailsValue {
  [FormFieldNameMap.broker]: number | null
  [FormFieldNameMap.brokerName]?: string
  [FormFieldNameMap.taxValue]?: number
  [FormFieldNameMap.taxPercent]?: number
}

export interface FullInitialAdditionalService
  extends OrderCalculatorAdditionalService,
    OrderCalculatorAdditionalServiceDocInfo,
    InitialBankDetailsValue {
  [FormFieldNameMap.provider]: number | null
  [FormFieldNameMap.providerName]?: string
  [FormFieldNameMap.broker]: number | null
  [FormFieldNameMap.brokerName]?: string
  [FormFieldNameMap.loanTerm]: number | null
  [FormFieldNameMap.taxValue]?: number
  [FormFieldNameMap.taxPercent]?: number
}

export interface FullInitialBankAdditionalService extends OrderCalculatorBankAdditionalService {
  [FormFieldNameMap.provider]: number | null
  [FormFieldNameMap.providerName]?: string
  [FormFieldNameMap.broker]?: number
  [FormFieldNameMap.brokerName]?: string
  [FormFieldNameMap.taxValue]?: number
  [FormFieldNameMap.taxPercent]?: number
  [FormFieldNameMap.bankAccountNumber]?: string
  [FormFieldNameMap.correspondentAccount]?: string
  [FormFieldNameMap.beneficiaryBank]?: string
  [FormFieldNameMap.bankIdentificationCode]?: string
  [FormFieldNameMap.inn]?: string
  [FormFieldNameMap.ogrn]?: string
  [FormFieldNameMap.kpp]?: string
}

export interface CommonError {
  isExceededServicesTotalLimit: boolean
  isExceededAdditionalEquipmentsLimit: boolean
  isExceededDealerAdditionalServicesLimit: boolean
  isExceededBankAdditionalServicesLimit: boolean
  isHasNotCascoOption: boolean
}

export interface ValidationParams {
  maxInitialPayment?: number
  maxInitialPaymentPercent?: number
  minInitialPayment?: number
  minInitialPaymentPercent?: number
  isNecessaryCasco?: boolean
}

export interface BriefOrderCalculatorFields {
  [FormFieldNameMap.carCondition]: number
  [FormFieldNameMap.carBrand]: string | null
  [FormFieldNameMap.carModel]: string | null
  [FormFieldNameMap.carYear]: number | null
  [FormFieldNameMap.carCost]: string
  [FormFieldNameMap.carMileage]: string
  [FormFieldNameMap.creditProduct]: number | null
  [FormFieldNameMap.initialPayment]: string
  [FormFieldNameMap.initialPaymentPercent]: string
  [FormFieldNameMap.loanTerm]: number | null
  [ServicesGroupName.additionalEquipments]: OrderCalculatorAdditionalService[]
  [ServicesGroupName.dealerAdditionalServices]: OrderCalculatorAdditionalService[]
  [ServicesGroupName.bankAdditionalServices]: OrderCalculatorBankAdditionalService[]
  [FormFieldNameMap.commonError]: CommonError
  [FormFieldNameMap.validationParams]: ValidationParams
}

export interface FullOrderCalculatorFields
  extends InitialBankDetailsValue,
    Omit<
      BriefOrderCalculatorFields,
      | ServicesGroupName.additionalEquipments
      | ServicesGroupName.dealerAdditionalServices
      | ServicesGroupName.bankAdditionalServices
    > {
  [FormFieldNameMap.carPassportType]: number | null
  [FormFieldNameMap.carPassportId]: string
  [FormFieldNameMap.carPassportCreationDate]: Date | null
  [FormFieldNameMap.carIdType]: number | null
  [FormFieldNameMap.carId]: string
  [FormFieldNameMap.salesContractId]: string
  [FormFieldNameMap.salesContractDate]: Date | null
  [FormFieldNameMap.legalPersonCode]?: number
  [FormFieldNameMap.legalPersonName]?: string
  [FormFieldNameMap.loanAmount]: string
  [FormFieldNameMap.taxValue]?: number
  [FormFieldNameMap.taxPercent]?: number
  [ServicesGroupName.additionalEquipments]: FullInitialAdditionalEquipments[]
  [ServicesGroupName.dealerAdditionalServices]: FullInitialAdditionalService[]
  [ServicesGroupName.bankAdditionalServices]: FullInitialBankAdditionalService[]
}

export type FormMessages = {
  [FormFieldNameMap.isExceededServicesTotalLimit]: string
  [FormFieldNameMap.isExceededAdditionalEquipmentsLimit]: string
  [FormFieldNameMap.isExceededDealerAdditionalServicesLimit]: string
  [FormFieldNameMap.isExceededBankAdditionalServicesLimit]: string
  [FormFieldNameMap.isHasNotCascoOption]: string
}

export type CreditProductParams = Partial<
  Pick<
    BriefOrderCalculatorFields,
    | FormFieldNameMap.carCondition
    | FormFieldNameMap.carBrand
    | FormFieldNameMap.carModel
    | FormFieldNameMap.carYear
  >
>

export enum CountryMade {
  Domestic = 'DOMESTIC',
  China = 'CHINA',
}

export enum CountryMark {
  Domestic = 1,
  Foreign = 2,
  China = 3,
}

export enum AutoCategory {
  A = 'A',
  B = 'B',
  C = 'C',
}

export interface NormalizedCar extends Car {
  brand: string
  models: string[]
  maxCarAge: number
}

export type NormalizedCars = {
  newCars: Record<string, NormalizedCar>
  usedCars: Record<string, NormalizedCar>
}
