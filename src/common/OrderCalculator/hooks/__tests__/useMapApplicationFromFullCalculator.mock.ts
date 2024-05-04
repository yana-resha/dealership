import { Order } from 'entities/reduxStore/orderSlice'

export const EXPECTED_REMAPPED_FULL_DATA: Order = {
  orderData: {
    moratoryEndDate: '2023-06-21',
    targetDcAppId: '2023062280224',
    application: {
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
        isCarNew: false,
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
        category: 'B',
        countryMade: 'CZECH',
        type: '1',
        vinNumber: undefined,
      },
      loanData: {
        productId: 3,
        downpayment: 410000,
        downpaymentInPercent: undefined,
        term: 36,
        amount: 12121.33,
        additionalOptions: [
          {
            bankOptionType: 2,
            type: 2,
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
              taxInfo: {
                amount: undefined,
                percent: undefined,
              },
            },
            docType: 2,
            docNumber: '32ук23к22',
            docDate: '2023-04-23',
          },
          {
            bankOptionType: 1,
            type: 1,
            name: 'ОСАГО',
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
                  accManualEnter: false,
                },
              },
              taxInfo: {
                amount: undefined,
                percent: undefined,
              },
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
          taxInfo: {
            amount: undefined,
            percent: undefined,
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
    },
  },
}
