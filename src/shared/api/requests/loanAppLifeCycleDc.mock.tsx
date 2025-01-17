import {
  OptionType,
  GetFullApplicationResponse,
  PhoneType,
  StatusCode,
  DocType,
  DocumentType,
} from '@sberauto/loanapplifecycledc-proto/public'

export const fullApplicationData: GetFullApplicationResponse = {
  moratoryEndDate: '2023-06-21',
  targetDcAppId: '2023062280224',
  application: {
    status: StatusCode.APPROVED,
    anketaType: 1,
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
          type: PhoneType.MOBILE,
          countryPrefix: '7',
          prefix: '903',
          number: '3800013',
        },
        {
          type: PhoneType.ADDITIONAL,
          countryPrefix: '7',
          prefix: '903',
          number: '3800013',
        },
        {
          type: PhoneType.WORKING,
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
        incomeDocumentType: DocumentType.TWO_NDFL,
        basicIncome: 1000.45,
        addIncome: 1000.47,
        familyIncome: 44000.82,
      },
    },
    employees: {
      fioActual: 'Иванов Иван Иванович',
      tabNumActual: 'employee№1',
    },
    loanCar: {
      isCarNew: false,
      autoCreateYear: 2021,
      mileage: '9',
      brand: 'Skoda',
      model: 'Octavia',
      autoPrice: 1345333,
      // vinNumber: '12341234123412341',
      carBody: '12341234123412341', // номер кузова
      // ptsNumber: '123123412341234',
      ptsNumber: '12ФЫ123456',
      ptsDate: '2021-05-10',
      dkpNumber: 'DC32567',
      dkpDate: '2021-05-10',
    },
    loanData: {
      productId: '3',
      productCode: 3,
      productName: 'Купи сейчас плати потом',
      downpayment: 410000,
      downpaymentInPercent: 30.48,
      term: 36,
      monthlyPayment: 32000,
      dateStart: '2000-01-01',
      dateEnd: '2099-01-01',
      crMinValue: 100000,
      crMaxValue: 12000000,
      crMinDuration: 12,
      crMaxDuration: 48,
      npllzp: 3223.2,
      npllzak: 10000.99,
      approvalValidity: 45,
      cascoInProduct: false,
      termsLoanCode: 2,
      productRates: {
        baseRate: 7.55,
        rateGrntyPeriod: 2,
        rateNewGrnty: 54.55,
        rateNonGrnty: 7.55,
        rateDiscountCpi: 1.35,
      },
      incomeProduct: true,
      amount: 12121.33,
      amountWithoutOptions: 3242.2342,
      additionalOptions: [
        {
          type: '2',
          name: 'Ароматная елочка',
          vendor: {
            vendorCode: '123',
            vendorName: 'Arex',
            requisites: {
              accountRequisite: {
                accountNumber: '40702810038000017241',
                accountCorrNumber: '40702810038000017243',
                inn: '12345678901',
                kpp: '12345678',
                ogrn: '1234567890123',
                bank: 'Сбербанк',
                bic: '646494334',
                accManualEnter: false,
              },
            },
            taxInfo: {
              amount: 13.5,
              percent: 12,
            },
          },
          broker: {
            vendorCode: '123234',
            vendorName: 'Arex2',
            requisites: {
              accountRequisite: {
                accountNumber: '40702810038000017241',
                accountCorrNumber: '40702810038000017243',
                inn: '12345678901',
                kpp: '12345678',
                ogrn: '1234567890123',
                bank: 'Сбербанк',
                bic: '646494334',
                accManualEnter: false,
              },
            },
            taxInfo: {
              amount: 13.5,
              percent: 12,
            },
          },
          inCreditFlag: true,
          inServicePackageFlag: false,
          price: 20,
          tariff: 'string',
          term: 36,
          bankOptionType: OptionType.EQUIPMENT,
          cascoLimit: 0,
          docType: DocType.INSURANCE_POLICY,
          certNumber: 'ув3а3а3а3м3',
          docNumber: '32ук23к22',
          docDate: '2023-04-23',
          dateStart: '2020-04-23',
          dateEnd: '2025-04-23',
        },
        {
          type: '1',
          name: 'ОСАГО',
          vendor: {
            vendorCode: '123',
            vendorName: 'РосГосСтрах',
            requisites: {
              accountRequisite: {
                accountNumber: '40702810038000017241',
                accountCorrNumber: '40702810038000017243',
                inn: '12345678901',
                kpp: '12345678',
                ogrn: '1234567890123',
                bank: 'Сбербанк',
                bic: '646494334',
                accManualEnter: false,
              },
            },
            taxInfo: {
              amount: 13.5,
              percent: 12,
            },
          },
          broker: {
            vendorCode: '123234',
            vendorName: 'Почта Банк',
            requisites: {
              accountRequisite: {
                accountNumber: '40702810038000017241',
                accountCorrNumber: '40702810038000017243',
                inn: '12345678901',
                kpp: '12345678',
                ogrn: '1234567890123',
                bank: 'Сбербанк',
                bic: '646494334',
                accManualEnter: false,
              },
            },
            taxInfo: {
              amount: 13.5,
              percent: 12,
            },
          },
          inCreditFlag: true,
          inServicePackageFlag: false,
          price: 21,
          tariff: 'string',
          term: 24,
          bankOptionType: OptionType.DEALER,
          cascoLimit: 0,
          docType: DocType.INSURANCE_POLICY,
          certNumber: 'ув3а3а3а3м3',
          docNumber: 'gfdgsdfgf',
          docDate: '2022-01-20',
          dateStart: '2020-04-23',
          dateEnd: '2025-04-23',
        },
      ],
    },

    vendor: {
      vendorCode: '2002703288',
      vendorName: 'Сармат',
      vendorType: 'true',
      vendorRegion: '77',
      riskCode: '202/e',
      unit: undefined,
      netCode: '200223',
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
        type: DocumentType.TWO_NDFL,
        extension: '.pdf',
        name: '2НДФЛ',
      },
      {
        type: DocumentType.CREDIT_CONTRACT,
        extension: '.pdf',
        name: 'Договор (ИУК).pdf',
      },
      {
        type: DocumentType.ACCOUNT_OPEN_FORM,
        extension: '.pdf',
        name: 'Заявление на открытие счёта.pdf',
      },
      {
        type: DocumentType.STATEMENT_FORM,
        extension: '.pdf',
        name: 'Заявление на выдачу кредита.pdf',
      },
    ],

    specialMark: 'Находится в нетрезвом состоянии',
  },
}
