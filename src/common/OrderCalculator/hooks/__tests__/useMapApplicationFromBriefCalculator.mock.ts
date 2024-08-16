import { ApplicationFrontdc } from '@sberauto/loanapplifecycledc-proto/public'

export const EXPECTED_REMAPPED_BRIEF_DATA: ApplicationFrontdc = {
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
  },
  loanData: {
    productId: '3',
    downpayment: 410000,
    downpaymentInPercent: 30.48,
    govprogramDfoFlag: false,
    term: 36,
    additionalOptions: [
      {
        bankOptionType: 2,
        type: '2',
        name: 'Перекрасить авто',
        inCreditFlag: true,
        price: 20,
        cascoLimit: 0,
      },
      {
        bankOptionType: 1,
        type: '1',
        name: 'ОСАГО',
        inCreditFlag: true,
        price: 21,
      },
    ],
  },
  anketaType: 0,
}
