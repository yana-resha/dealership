import { SaleMethod } from '@sberauto/dictionarydc-proto/public'

import {
  fullInitialValueMap,
  INITIAL_ADDITIONAL_SERVICE,
  INITIAL_BANK_ADDITIONAL_SERVICE,
} from 'common/OrderCalculator/config'
import {
  BriefOrderCalculatorFields,
  FormFieldNameMap,
  FullOrderCalculatorFields,
} from 'common/OrderCalculator/types'
import { MAX_AGE, MIN_AGE } from 'shared/config/client.config'

export const INITIAL_FORMIK_DATA: FullOrderCalculatorFields = {
  ...fullInitialValueMap,
  creditProduct: '',
}

export const MOCKED_FORMIK_CONTEXT = {
  values: {} as FullOrderCalculatorFields | BriefOrderCalculatorFields,
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => {},
}

export const BANK_ADDITIONAL_VENDOR_OPTIONS = [
  {
    saleMethod: SaleMethod.STAND_ALONE,
    optionId: '26',
    optionType: 0,
    optionCode: 'ZVP',
    optionName: 'Защита в пути',
    minTerm: 0,
    maxTerm: 0,
    tariffs: [
      {
        tariffId: '100',
        tariff: 'Базовая',
        tariffCode: '100',
        optionId: '26',
        activeDateFrom: '2024-07-23',
        activeDateTo: '2099-01-01',
        minClientAge: MIN_AGE,
        maxClientAge: MAX_AGE,
        minTerm: 12,
        maxTerm: 60,
        price: 6000,
        calcType: 1,
        serviceStartDate: '0001-01-01',
      },
      {
        tariffId: '101',
        tariff: 'Расширенная',
        tariffCode: '101',
        optionId: '26',
        activeDateFrom: '2024-07-23',
        activeDateTo: '2099-01-01',
        minClientAge: MIN_AGE,
        maxClientAge: MAX_AGE,
        minTerm: 12,
        maxTerm: 84,
        price: 10000,
        calcType: 1,
        serviceStartDate: '0001-01-01',
      },
    ],
  },

  {
    saleMethod: SaleMethod.STAND_ALONE,
    optionId: '30',
    optionType: 0,
    optionCode: 'ZVPKV',
    optionName: 'Защита в пути К',
    minTerm: 0,
    maxTerm: 0,
    tariffs: [
      {
        tariffId: '105',
        tariff: 'Базовая',
        tariffCode: '100',
        optionId: '30',
        activeDateFrom: '2024-07-23',
        activeDateTo: '2099-01-01',
        minClientAge: MIN_AGE,
        maxClientAge: MAX_AGE,
        minTerm: 12,
        maxTerm: 84,
        price: 6000,
        calcType: 1,
        serviceStartDate: '0001-01-01',
      },
      {
        tariffId: '106',
        tariff: 'Расширенная',
        tariffCode: '101',
        optionId: '30',
        activeDateFrom: '2024-07-23',
        activeDateTo: '2099-01-01',
        minClientAge: MIN_AGE,
        maxClientAge: MAX_AGE,
        minTerm: 12,
        maxTerm: 84,
        price: 10000,
        calcType: 1,
        serviceStartDate: '0001-01-01',
      },
    ],
  },
  {
    saleMethod: SaleMethod.STAND_ALONE,
    optionId: '31',
    optionType: 0,
    optionCode: 'SBZ',
    optionName: 'Здоровье в пути',
    minTerm: 12,
    maxTerm: 84,
    tariffs: [
      {
        tariffId: '115',
        tariff: 'Здоровый водитель',
        tariffCode: '115',
        optionId: '31',
        activeDateFrom: '2024-09-16',
        activeDateTo: '2099-01-01',
        minClientAge: MIN_AGE,
        maxClientAge: MAX_AGE,
        minTerm: 12,
        maxTerm: 84,
        price: 500,
        calcType: 1,
        serviceStartDate: '0001-01-01',
      },
      {
        tariffId: '116',
        tariff: 'Здоровье в пути',
        tariffCode: '116',
        optionId: '31',
        activeDateFrom: '2024-09-16',
        activeDateTo: '2099-01-01',
        minClientAge: MIN_AGE,
        maxClientAge: MAX_AGE,
        minTerm: 12,
        maxTerm: 84,
        price: 833.33,
        calcType: 1,
        serviceStartDate: '0001-01-01',
      },
      {
        tariffId: '117',
        tariff: 'Здоровье в пути+',
        tariffCode: '117',
        optionId: '31',
        activeDateFrom: '2024-09-16',
        activeDateTo: '2099-01-01',
        minClientAge: MIN_AGE,
        maxClientAge: MAX_AGE,
        minTerm: 12,
        maxTerm: 84,
        price: 1666.67,
        calcType: 1,
        serviceStartDate: '0001-01-01',
      },
      {
        tariffId: '118',
        tariff: 'Здоровье максимум',
        tariffCode: '118',
        optionId: '31',
        activeDateFrom: '2024-09-16',
        activeDateTo: '2099-01-01',
        minClientAge: MIN_AGE,
        maxClientAge: MAX_AGE,
        minTerm: 12,
        maxTerm: 84,
        price: 2666.67,
        calcType: 1,
        serviceStartDate: '0001-01-01',
      },
    ],
  },

  {
    saleMethod: SaleMethod.PROMO,
    optionId: '27',
    optionType: 0,
    optionCode: 'MLT',
    optionName: 'Мультиполис Авто',
    minTerm: 0,
    maxTerm: 0,
    tariffs: [
      {
        tariffId: '102',
        tariff: 'Стандартная',
        tariffCode: '102',
        optionId: '27',
        activeDateFrom: '2024-07-01',
        activeDateTo: '2099-01-01',
        minClientAge: MIN_AGE,
        maxClientAge: MAX_AGE,
        minTerm: 12,
        maxTerm: 12,
        price: 5500,
        calcType: 1,
        serviceStartDate: '0001-01-01',
      },
    ],
  },
]

export const EXPECTED_BANK_FILTER_OPTIONS = BANK_ADDITIONAL_VENDOR_OPTIONS.filter(
  el => el.saleMethod === SaleMethod.STAND_ALONE,
)
export const BANK_ADDITIONAL_FORMIK_VALUE = [
  {
    [FormFieldNameMap.productType]: '26',
    [FormFieldNameMap.productCost]: '',
    [FormFieldNameMap.loanTerm]: null,
    [FormFieldNameMap.tariff]: null,
    [FormFieldNameMap.provider]: null,
  },
]

export const EQUIPMENTS_ADDITIONAL_FORMIK_VALUE = [
  {
    [FormFieldNameMap.broker]: null,
    [FormFieldNameMap.productCost]: '',
    [FormFieldNameMap.isCredit]: true,
    [FormFieldNameMap.cascoLimit]: '',
    [FormFieldNameMap.documentType]: null,
    [FormFieldNameMap.documentNumber]: '',
    [FormFieldNameMap.documentDate]: null,
    [FormFieldNameMap.bankIdentificationCode]: '',
    [FormFieldNameMap.beneficiaryBank]: '',
    [FormFieldNameMap.bankAccountNumber]: '',
    [FormFieldNameMap.isCustomFields]: false,
    [FormFieldNameMap.productType]: '18',
  },
]

export const EQUIPMENT_ADDITIONAL_VENDOR_OPTIONS = [
  {
    optionId: '1',
    optionType: 2,
    optionCode: '',
    optionName: 'Автосигнализация, автозапуск/установка',
    minTerm: 0,
    maxTerm: 0,
    tariffs: [],
  },

  {
    optionId: '0',
    optionType: 2,
    optionCode: '',
    optionName: 'Адаптация и подготовка автомобиля',
    minTerm: 0,
    maxTerm: 0,
    tariffs: [],
  },

  {
    optionId: '2',
    optionType: 2,
    optionCode: '',
    optionName: 'Акустическая система, автозвук/установка',
    minTerm: 0,
    maxTerm: 0,
    tariffs: [],
  },

  {
    optionId: '3',
    optionType: 2,
    optionCode: '',
    optionName: 'Видеорегистратор/установка',
    minTerm: 0,
    maxTerm: 0,
    tariffs: [],
  },
]

export const DEALER_ADDITIONAL_VENDOR_OPTIONS = [
  {
    optionId: '18',
    optionType: 1,
    optionCode: 'AAS',
    optionName: 'Продленная гарантия',
    minTerm: 12,
    maxTerm: 84,
    tariffs: [],
  },
  {
    optionId: '19',
    optionType: 1,
    optionCode: 'AAT',
    optionName: 'Сервисная карта',
    minTerm: 12,
    maxTerm: 84,
    tariffs: [],
  },

  {
    optionId: '20',
    optionType: 1,
    optionCode: 'AAU',
    optionName: 'Страхование жизни и здоровья',
    minTerm: 12,
    maxTerm: 84,
    tariffs: [],
  },

  {
    optionId: '16',
    optionType: 1,
    optionCode: 'AAQ',
    optionName: 'Карта помощи на дороге',
    minTerm: 12,
    maxTerm: 84,
    tariffs: [],
  },
]

export const DEALER_ADDITIONAL_SERVICES_FORMIK_VALUE = [
  {
    [FormFieldNameMap.broker]: null,
    [FormFieldNameMap.productCost]: '',
    [FormFieldNameMap.isCredit]: false,
    [FormFieldNameMap.cascoLimit]: '',
    [FormFieldNameMap.documentType]: null,
    [FormFieldNameMap.documentNumber]: '',
    [FormFieldNameMap.documentDate]: null,
    [FormFieldNameMap.bankIdentificationCode]: '',
    [FormFieldNameMap.beneficiaryBank]: '',
    [FormFieldNameMap.bankAccountNumber]: '',
    [FormFieldNameMap.isCustomFields]: false,
    [FormFieldNameMap.provider]: null,
    [FormFieldNameMap.loanTerm]: null,
    [FormFieldNameMap.productType]: '18',
  },
]

export const ADDITIONAL_SERVICES_PARAMS = {
  vendorOptions: {
    additionalOptions: [
      ...BANK_ADDITIONAL_VENDOR_OPTIONS,
      ...EQUIPMENT_ADDITIONAL_VENDOR_OPTIONS,
      ...DEALER_ADDITIONAL_VENDOR_OPTIONS,
    ],
    additionalOptionsMap: {},
  },
  isLoadedCreditProducts: true,
  creditProductListData: undefined,
  clientAge: 24,
  currentRateMod: undefined,
  initialDealerAdditionalService: INITIAL_ADDITIONAL_SERVICE,
  initialAdditionalEquipment: INITIAL_ADDITIONAL_SERVICE,
  initialBankAdditionalService: INITIAL_BANK_ADDITIONAL_SERVICE,
}
