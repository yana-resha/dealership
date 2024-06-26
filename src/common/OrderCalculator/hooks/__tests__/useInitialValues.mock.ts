export const EXPECTED_FULL_DATA = {
  additionalEquipments: [
    {
      bankAccountNumber: '40702810038000017241',
      bankIdentificationCode: '646494334',
      beneficiaryBank: 'Сбербанк',
      correspondentAccount: '40702810038000017243',
      documentDate: new Date('2023-04-23T00:00:00.000Z'),
      documentNumber: '32ук23к22',
      documentType: 2,
      isCredit: true,
      isCustomFields: false,
      legalPersonCode: '123234',
      productCost: '20',
      productType: 2,
      taxPercent: null,
      taxValue: null,
      taxation: '13.5',
    },
  ],
  bankAccountNumber: '40702810038000017240',
  bankAdditionalServices: [
    {
      agent: '',
      agentTaxPercent: null,
      agentTaxValue: null,
      bankAccountNumber: '',
      bankIdentificationCode: '',
      beneficiaryBank: '',
      correspondentAccount: undefined,
      documentDate: null,
      documentNumber: '',
      documentType: null,
      isCredit: false,
      isCustomFields: false,
      loanTerm: undefined,
      productCost: '',
      productType: null,
      provider: '',
      taxPresence: undefined,
      taxation: undefined,
    },
  ],
  bankIdentificationCode: '646494331',
  beneficiaryBank: 'Сбербанк',
  carBrand: 'Skoda',
  carCondition: 1,
  carCost: '1345333',
  carId: '12341234123412341',
  carIdType: 0,
  carMileage: '9',
  carModel: 'Octavia',
  carPassportCreationDate: new Date('2021-05-10T00:00:00.000Z'),
  carPassportId: '12ФЫ123456',
  carPassportType: 0,
  carYear: 2021,
  commonError: {
    isExceededAdditionalEquipmentsLimit: false,
    isExceededBankAdditionalServicesLimit: false,
    isExceededDealerAdditionalServicesLimit: false,
    isExceededServicesTotalLimit: false,
    isHasNotCascoOption: false,
  },
  correspondentAccount: '40702810038000017249',
  creditProduct: '3',
  dealerAdditionalServices: [
    {
      agent: '123234',
      agentTaxPercent: null,
      agentTaxValue: null,
      bankAccountNumber: '40702810038000017241',
      bankIdentificationCode: '646494334',
      beneficiaryBank: 'Сбербанк',
      correspondentAccount: '40702810038000017243',
      documentDate: new Date('2022-01-20T00:00:00.000Z'),
      documentNumber: 'gfdgsdfgf',
      documentType: 2,
      isCredit: true,
      isCustomFields: false,
      loanTerm: 24,
      productCost: '21',
      productType: 1,
      provider: '123',
      taxation: '13.5',
    },
  ],
  initialPayment: '410000',
  initialPaymentPercent: '',
  isCustomFields: false,
  legalPersonCode: '2000000',
  loanAmount: '12121.33',
  loanTerm: 36,
  salesContractDate: new Date('2021-05-10T00:00:00.000Z'),
  salesContractId: 'DC32567',
  taxPercent: null,
  taxPresence: true,
  taxValue: null,
  taxation: '18',
  validationParams: {},
}

export const EXPECTED_REMAPPED_FULL_DATA = {
  status: 2,
  anketaType: 2,
  appType: 'CARLOANAPPLICATIONDC',
  dcAppId: '544545',
  unit: 'unit',
  createdDate: '2023-06-08T07:44:00.355Z',
  applicant: {
    lastName: 'Иванов',
    firstName: 'Иван',
    middleName: 'Иванович',
    prevLastName: 'Иванова',
    prevFirstName: 'Ивана',
    prevMiddleName: 'Ивановна',
    birthDate: '2000-01-01',
    birthPlace: 'Саратов',
    sex: 0,
    email: 'mail@mail.ru',
    marital: 1,
    children: 5,
    publicPerson: true,
    documents: [
      {
        type: 21,
        series: '1234',
        number: '123456',
        issuedBy: 'МВД',
        issuedCode: '123-456',
        issuedDate: '2023-12-15',
      },
      {
        type: 15,
        series: '1234',
        number: '123456',
        issuedBy: 'МВД',
        issuedCode: '123-456',
        issuedDate: '2023-12-15',
      },
    ],
    phones: [
      {
        type: 1,
        countryPrefix: '7',
        prefix: '903',
        number: '3800013',
      },
      {
        type: 5,
        countryPrefix: '7',
        prefix: '903',
        number: '3800013',
      },
      {
        type: 4,
        countryPrefix: '7',
        prefix: '903',
        number: '3800013',
      },
    ],
    addresses: [
      {
        type: 1,
        country: 'Россия',
        postalCode: '410055',
        regCode: '77',
        region: 'Москва',
        areaType: '55',
        area: 'Усть-Курдюмский',
        cityType: '77',
        city: 'Москва',
        settlementType: '45',
        settlement: 'Курдюм',
        streetType: '34',
        street: 'Севастопольская',
        house: '17',
        houseExt: '5',
        unit: 'ж',
        unitNum: '174',
      },
      {
        type: 2,
        country: 'Россия',
        postalCode: '410055',
        regCode: '77',
        region: 'Москва',
        areaType: '55',
        area: 'Усть-Курдюмский',
        cityType: '77',
        city: 'Москва',
        settlementType: '45',
        settlement: 'Курдюм',
        streetType: '34',
        street: 'Севастопольская',
        house: '17',
        houseExt: '5',
        unit: 'ж',
        unitNum: '174',
      },
      {
        type: 4,
        country: 'Россия',
        postalCode: '410055',
        regCode: '77',
        region: 'Москва',
        areaType: '55',
        area: 'Усть-Курдюмский',
        cityType: '77',
        city: 'Москва',
        settlementType: '45',
        settlement: 'Курдюм',
        streetType: '34',
        street: 'Севастопольская',
        house: '17',
        houseExt: '5',
        unit: 'ж',
        office: '15',
      },
    ],
    employment: {
      occupation: 2,
      currentWorkExperience: 21,
      orgName: 'ДрайвКликБанк',
      inn: '123123123',
    },
    income: {
      incomeVerify: true,
      incomeDocumentType: 3,
      basicIncome: 1000.45,
      addIncome: 1000.47,
      familyIncome: 44000.82,
      expenses: 12005.2,
    },
  },
  employees: {
    fioActual: 'Иванов Иван Иванович',
    tabNumActual: 'employee№1',
  },
  loanCar: {
    brand: 'Skoda',
    isCarNew: true,
    autoPrice: 1345333,
    mileage: '9',
    model: 'Octavia',
    autoCreateYear: 2021,
    ptsNumber: '12ФЫ123456',
    ptsDate: '2021-05-10',
    carBody: '12341234123412341',
    dkpNumber: 'DC32567',
    dkpDate: '2021-05-10',
    mark: 2,
  },
  loanData: {
    productId: '3',
    downpayment: 410000,
    downpaymentInPercent: undefined,
    term: 36,
    amount: 12121,
    additionalOptions: [
      {
        bankOptionType: 2,
        type: 2,
        name: 'Акустическая система, автозвук/установка',
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
        type: 1,
        name: 'Автосигнализация, автозапуск/установка',
        inCreditFlag: true,
        price: 21,
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
            },
          },
          taxInfo: {},
        },
        term: 24,
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
  scans: [
    {
      type: 3,
      extension: '.pdf',
      name: '2НДФЛ',
    },
    {
      type: 2,
      extension: '.pdf',
      name: 'Договор (ИУК).pdf',
    },
    {
      type: 8,
      extension: '.pdf',
      name: 'Заявление на открытие счёта.pdf',
    },
    {
      type: 9,
      extension: '.pdf',
      name: 'Заявление на выдачу кредита.pdf',
    },
  ],
  specialMark: 'Находится в нетрезвом состоянии',
}

export const EXPECTED_REMAPPED_BRIEF_DATA = {
  status: 2,
  anketaType: 0,
  appType: 'CARLOANAPPLICATIONDC',
  dcAppId: '544545',
  unit: 'unit',
  createdDate: '2023-06-08T07:44:00.355Z',
  applicant: {
    lastName: 'Иванов',
    firstName: 'Иван',
    middleName: 'Иванович',
    prevLastName: 'Иванова',
    prevFirstName: 'Ивана',
    prevMiddleName: 'Ивановна',
    birthDate: '2000-01-01',
    birthPlace: 'Саратов',
    sex: 0,
    email: 'mail@mail.ru',
    marital: 1,
    children: 5,
    publicPerson: true,
    documents: [
      {
        type: 21,
        series: '1234',
        number: '123456',
        issuedBy: 'МВД',
        issuedCode: '123-456',
        issuedDate: '2023-12-15',
      },
      {
        type: 15,
        series: '1234',
        number: '123456',
        issuedBy: 'МВД',
        issuedCode: '123-456',
        issuedDate: '2023-12-15',
      },
    ],
    phones: [
      {
        type: 1,
        countryPrefix: '7',
        prefix: '903',
        number: '3800013',
      },
      {
        type: 5,
        countryPrefix: '7',
        prefix: '903',
        number: '3800013',
      },
      {
        type: 4,
        countryPrefix: '7',
        prefix: '903',
        number: '3800013',
      },
    ],
    addresses: [
      {
        type: 1,
        country: 'Россия',
        postalCode: '410055',
        regCode: '77',
        region: 'Москва',
        areaType: '55',
        area: 'Усть-Курдюмский',
        cityType: '77',
        city: 'Москва',
        settlementType: '45',
        settlement: 'Курдюм',
        streetType: '34',
        street: 'Севастопольская',
        house: '17',
        houseExt: '5',
        unit: 'ж',
        unitNum: '174',
      },
      {
        type: 2,
        country: 'Россия',
        postalCode: '410055',
        regCode: '77',
        region: 'Москва',
        areaType: '55',
        area: 'Усть-Курдюмский',
        cityType: '77',
        city: 'Москва',
        settlementType: '45',
        settlement: 'Курдюм',
        streetType: '34',
        street: 'Севастопольская',
        house: '17',
        houseExt: '5',
        unit: 'ж',
        unitNum: '174',
      },
      {
        type: 4,
        country: 'Россия',
        postalCode: '410055',
        regCode: '77',
        region: 'Москва',
        areaType: '55',
        area: 'Усть-Курдюмский',
        cityType: '77',
        city: 'Москва',
        settlementType: '45',
        settlement: 'Курдюм',
        streetType: '34',
        street: 'Севастопольская',
        house: '17',
        houseExt: '5',
        unit: 'ж',
        office: '15',
      },
    ],
    employment: {
      occupation: 2,
      currentWorkExperience: 21,
      orgName: 'ДрайвКликБанк',
      inn: '123123123',
    },
    income: {
      incomeVerify: true,
      incomeDocumentType: 3,
      basicIncome: 1000.45,
      addIncome: 1000.47,
      familyIncome: 44000.82,
      expenses: 12005.2,
    },
  },
  employees: {
    fioActual: 'Иванов Иван Иванович',
    tabNumActual: 'employee№1',
  },
  loanCar: {
    brand: 'Skoda',
    isCarNew: true,
    autoPrice: 1345333,
    mileage: '9',
    model: 'Octavia',
    autoCreateYear: 2021,
    mark: 2,
  },
  loanData: {
    productId: '3',
    downpayment: 410000,
    downpaymentInPercent: undefined,
    term: 36,
    additionalOptions: [
      {
        bankOptionType: 2,
        type: 2,
        name: 'Акустическая система, автозвук/установка',
        inCreditFlag: true,
        price: 20,
      },
      {
        bankOptionType: 1,
        type: 1,
        name: 'Автосигнализация, автозапуск/установка',
        inCreditFlag: true,
        price: 21,
      },
    ],
  },
  vendor: {
    vendorCode: '2002703288',
    vendorName: 'Сармат',
    vendorType: 'true',
    vendorRegion: '77',
    riskCode: '202/e',
    netCode: '200223',
    address: 'Г Счастья ул радости дом 7',
    broker: {
      vendorCode: '2000000',
      vendorName: 'Юр лицо Сармата',
      taxInfo: {
        amount: 18,
      },
      requisites: {
        accountRequisite: {
          accountNumber: '40702810038000017240',
          accountCorrNumber: '40702810038000017249',
          inn: '12345678901',
          kpp: '12345678',
          ogrn: '1234567890123456789011',
          bic: '646494331',
          bank: 'Сбербанк',
        },
      },
    },
  },
  scans: [
    {
      type: 3,
      extension: '.pdf',
      name: '2НДФЛ',
    },
    {
      type: 2,
      extension: '.pdf',
      name: 'Договор (ИУК).pdf',
    },
    {
      type: 8,
      extension: '.pdf',
      name: 'Заявление на открытие счёта.pdf',
    },
    {
      type: 9,
      extension: '.pdf',
      name: 'Заявление на выдачу кредита.pdf',
    },
  ],
  specialMark: 'Находится в нетрезвом состоянии',
}
