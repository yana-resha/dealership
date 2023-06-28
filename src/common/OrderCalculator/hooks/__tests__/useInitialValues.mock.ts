import { OptionType } from '@sberauto/dictionarydc-proto/public'

export const EXPECTED_FULL_DATA = {
  carCondition: 1,
  carBrand: 'Skoda',
  carModel: 'Octavia',
  carYear: 2021,
  carCost: '1345333.54',
  carMileage: '9',
  creditProduct: 3,
  initialPayment: '410000',
  initialPaymentPercent: '',
  loanTerm: 36,
  carPassportType: 0,
  carPassportId: '12ФЫ123456',
  carPassportCreationDate: new Date('2021-05-10T00:00:00.000Z'),
  carIdType: 0,
  carId: '12341234123412341',
  salesContractId: 'DC32567',
  salesContractDate: new Date('2021-05-10T00:00:00.000Z'),
  legalPerson: '2002703288',
  loanAmount: '3242.2342',
  bankIdentificationCode: '12345678',
  beneficiaryBank: 'Сбербанк',
  bankAccountNumber: '40702810038000017240',
  isCustomFields: false,
  correspondentAccount: '12345678901234567890',
  taxation: '11.1',
  additionalEquipments: [
    {
      productType: OptionType.EQUIPMENT,
      productCost: '20',
      isCredit: true,
      legalPerson: 'Arex',
      bankIdentificationCode: '12345678',
      beneficiaryBank: 'Росбанк',
      bankAccountNumber: '12345678901234567890',
      isCustomFields: false,
      correspondentAccount: '12345678901234567899',
      taxation: '13.5',
    },
  ],
  dealerAdditionalServices: [
    {
      productType: OptionType.ADDITIONAL,
      productCost: '21',
      isCredit: true,
      provider: 'РосГосСтрах',
      agent: '043432323',
      loanTerm: 24,
      documentId: '32ук23к22',
      bankIdentificationCode: '12345678',
      beneficiaryBank: 'Росбанк',
      bankAccountNumber: '12345678901234567890',
      isCustomFields: false,
      correspondentAccount: '12345678901234567891',
      taxation: '13.5',
    },
  ],
  bankAdditionalServices: [
    {
      productCost: '',
      isCredit: false,
      provider: '',
      agent: '',
      documentId: '',
      bankIdentificationCode: '',
      beneficiaryBank: '',
      bankAccountNumber: '',
      isCustomFields: false,
    },
  ],
  commonError: {
    isExceededServicesTotalLimit: false,
    isExceededAdditionalEquipmentsLimit: false,
    isExceededDealerAdditionalServicesLimit: false,
    isExceededBankAdditionalServicesLimit: false,
  },
  validationParams: {},
}

// 1
