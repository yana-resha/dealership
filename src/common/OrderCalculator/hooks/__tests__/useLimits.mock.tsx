import { fullInitialValueMap } from 'common/OrderCalculator/config'
import { BriefOrderCalculatorFields, OrderCalculatorAdditionalService } from 'common/OrderCalculator/types'

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
    productType: 1,
    productCost: '10',
    isCredit: true,
  },
  {
    productType: 1,
    productCost: '20',
    isCredit: true,
  },
]

export const DEALER_ADDITIONAL_SERVICES: OrderCalculatorAdditionalService[] = [
  {
    productType: 1,
    productCost: '15',
    isCredit: true,
  },
  {
    productType: 1,
    productCost: '30',
    isCredit: true,
  },
]

export const BANK_ADDITIONAL_SERVICES: OrderCalculatorAdditionalService[] = [
  {
    productType: 1,
    productCost: '10',
    isCredit: true,
  },
  {
    productType: 1,
    productCost: '20',
    isCredit: false,
  },
]

export const initialData: BriefOrderCalculatorFields = {
  ...fullInitialValueMap,
  carBrand: 'KIA',
  carYear: currentYear,
  carCost: '100',
  creditProduct: '',
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
