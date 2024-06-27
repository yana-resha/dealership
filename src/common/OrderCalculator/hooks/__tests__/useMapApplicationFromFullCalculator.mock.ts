import { ApplicationFrontdc } from '@sberauto/loanapplifecycledc-proto/public'

export const EXPECTED_REMAPPED_APPLICATION: ApplicationFrontdc = {
  loanCar: {
    brand: 'Skoda',
    isCarNew: false,
    autoPrice: 1345333,
    mileage: '9',
    model: 'Octavia',
    autoCreateYear: 2021,
    mark: 2,
    countryMade: 'CZECH',
    type: '1',
    category: 'B',
    ptsNumber: '12ФЫ123456',
    ptsDate: '2021-05-10',
    carBody: '12341234123412341',
    dkpNumber: 'DC32567',
    dkpDate: '2021-05-10',
  },
  loanData: {
    productId: '3',
    downpayment: 410000,
    downpaymentInPercent: 30.48,
    term: 36,
    amount: 12121.33,
    additionalOptions: [
      {
        bankOptionType: 2,
        type: '2',
        name: 'Перекрасить авто',
        inCreditFlag: true,
        price: 20,
        vendor: {},
        broker: {
          vendorCode: '123234',
          requisites: {
            accountRequisite: {
              accountNumber: '40702810038000017241',
              accountCorrNumber: '40702810038000017243',
              bank: 'Сбербанк',
              bic: '646494334',
              accManualEnter: false,
            },
          },
          taxInfo: {},
        },
        docType: 2,
        docNumber: '32ук23к22',
        docDate: '2023-04-23',
      },
      {
        bankOptionType: 1,
        type: '1',
        name: 'ОСАГО',
        inCreditFlag: true,
        price: 21,
        term: 24,
        vendor: {
          vendorCode: '123',
        },
        broker: {
          vendorCode: '123234',
          requisites: {
            accountRequisite: {
              accountNumber: '40702810038000017241',
              accountCorrNumber: '40702810038000017243',
              bank: 'Сбербанк',
              bic: '646494334',
              accManualEnter: false,
            },
          },
          taxInfo: {},
        },
        docType: 2,
        docNumber: 'gfdgsdfgf',
        docDate: '2022-01-20',
        dateStart: '2022-01-20',
        dateEnd: '2024-01-20',
      },
    ],
  },
  vendor: {
    broker: {
      vendorCode: '2000000',
      requisites: {
        accountRequisite: {
          bank: 'Сбербанк',
          bic: '646494331',
          accountNumber: '40702810038000017240',
          accountCorrNumber: '40702810038000017249',
        },
      },
      taxInfo: {},
    },
  },
  anketaType: 2,
}
