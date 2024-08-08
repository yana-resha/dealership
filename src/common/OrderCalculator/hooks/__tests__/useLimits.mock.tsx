import { fullInitialValueMap } from 'common/OrderCalculator/config'
import {
  BriefOrderCalculatorFields,
  CreditDurationData,
  CreditProductsData,
  InitialPaymentData,
  OrderCalculatorAdditionalService,
  OrderCalculatorBankAdditionalService,
} from 'common/OrderCalculator/types'

export const EXPECTED_LOAN_TERMS = [
  { value: 24 },
  { value: 36 },
  { value: 48 },
  { value: 60 },
  { value: 72 },
  { value: 84 },
]
export const currentYear = new Date().getFullYear()

export const EXPECTED_ADDITIONAL_EQUIPMENTS: OrderCalculatorAdditionalService[] = [
  {
    productType: '1',
    productCost: '10',
    isCredit: true,
    cascoLimit: '',
  },
  {
    productType: '1',
    productCost: '20',
    isCredit: true,
    cascoLimit: '',
  },
]

export const DEALER_ADDITIONAL_SERVICES: OrderCalculatorAdditionalService[] = [
  {
    productType: '1',
    productCost: '15',
    isCredit: true,
    cascoLimit: '',
  },
  {
    productType: '1',
    productCost: '30',
    isCredit: true,
    cascoLimit: '',
  },
]

export const BANK_ADDITIONAL_SERVICES: OrderCalculatorBankAdditionalService[] = [
  {
    productType: '1',
    productCost: '10',
    tariff: '1',
    loanTerm: null,
  },
  {
    productType: '1',
    productCost: '20',
    tariff: '1',
    loanTerm: null,
  },
]

export const initialData: BriefOrderCalculatorFields = {
  ...fullInitialValueMap,
  carBrand: 'KIA',
  carYear: currentYear,
  carCost: '100',
  creditProduct: null,
  loanTerm: 36,
}

export const MOCKED_STATE_WITH_DATA = {
  order: {
    order: {
      passportSeries: '2222',
      passportNumber: '222222',
      lastName: 'lastName',
      firstName: 'firstName',
      middleName: 'middleName',
      birthDate: '2000-01-01',
      phoneNumber: '79999999999',
      fillingProgress: {
        isFilledElementaryClientData: true,
      },
    },
  },
}

export const MOCKED_INITIAL_PAYMENT_DATA: InitialPaymentData = {
  maxInitialPayment: 90,
  maxInitialPaymentPercent: 90,
  minInitialPayment: 0,
  minInitialPaymentPercent: 0,
}

export const MOCKED_INITIAL_PAYMENT_DATA_WITH_CURRENT_PRODUCT: InitialPaymentData = {
  maxInitialPayment: 80,
  maxInitialPaymentPercent: 80,
  minInitialPayment: 20,
  minInitialPaymentPercent: 20,
}

export const MOCKED_CREDIT_DURATION_DATA: CreditDurationData = {
  currentDurationMin: undefined,
  currentDurationMax: undefined,
}

export const MOCKED_CREDIT_PRODUCTS_DATA: CreditProductsData = {
  creditProductListData: {
    fullDurationMax: 84,
    fullDurationMin: 24,
    fullDownpaymentMax: 90,
    fullDownpaymentMin: 0,
    products: [
      {
        productCode: 10,
        productCodeName: 'ACDC',
        productName: 'Максимум: Без Каско',
        productId: '1',
        npllzp: 16000000,
        npllzak: 16000000,
        termsLoanCode: 269,
        approvalValidity: 45,
        incomeFlag: true,
        activeDateFrom: '2023-01-01',
        activeDateTo: '2099-01-01',
        conditions: [
          {
            downpaymentMin: 20,
            downpaymentMax: 80,
            durationMin: 24,
            durationMax: 84,
            rateMods: [],
          },
        ],
      },
      {
        productCode: 10,
        productCodeName: 'AKHC',
        productName: 'Комфорт: Драйв',
        productId: '2',
        npllzp: 16000000,
        npllzak: 16000000,
        termsLoanCode: 269,
        approvalValidity: 45,
        incomeFlag: true,
        activeDateFrom: '2023-01-01',
        activeDateTo: '2099-01-01',
        conditions: [
          {
            downpaymentMin: 0,
            downpaymentMax: 90,
            durationMin: 36,
            durationMax: 72,
            rateMods: [],
          },
        ],
      },
    ],
    productsMap: {
      '1': {
        productCode: 10,
        productCodeName: 'ACDC',
        productName: 'Максимум: Без Каско',
        productId: '1',
        npllzp: 16000000,
        npllzak: 16000000,
        termsLoanCode: 269,
        approvalValidity: 45,
        incomeFlag: true,
        activeDateFrom: '2023-01-01',
        activeDateTo: '2099-01-01',
        conditions: [
          {
            downpaymentMin: 20,
            downpaymentMax: 80,
            durationMin: 24,
            durationMax: 84,
            rateMods: [],
          },
        ],
      },
      '2': {
        productCode: 10,
        productCodeName: 'AKHC',
        productName: 'Комфорт: Драйв',
        productId: '2',
        npllzp: 16000000,
        npllzak: 16000000,
        termsLoanCode: 269,
        approvalValidity: 45,
        incomeFlag: true,
        activeDateFrom: '2023-01-01',
        activeDateTo: '2099-01-01',
        conditions: [
          {
            downpaymentMin: 0,
            downpaymentMax: 90,
            durationMin: 36,
            durationMax: 72,
            rateMods: [],
          },
        ],
      },
    },
  },
  currentProduct: {
    productCode: 10,
    productCodeName: 'AKHC',
    productName: 'Комфорт: Драйв',
    productId: '2',
    npllzp: 16000000,
    npllzak: 16000000,
    termsLoanCode: 269,
    approvalValidity: 45,
    incomeFlag: true,
    activeDateFrom: '2023-01-01',
    activeDateTo: '2099-01-01',
    conditions: [
      {
        downpaymentMin: 0,
        downpaymentMax: 90,
        durationMin: 36,
        durationMax: 72,
        rateMods: [],
      },
    ],
  },
}
