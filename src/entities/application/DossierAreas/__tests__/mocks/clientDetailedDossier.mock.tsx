import { StatusCode } from '@sberauto/loanapplifecycledc-proto/public'

import { sleep } from 'shared/lib/sleep'

export interface RequisitesBanks {
  bankName: string
  bankBik: string
  bankCorrAccount: string
  accountNumbers: string[]
}

export interface RequisitesAdditionalOptions {
  legalEntityName: string
  banks: RequisitesBanks[]
}

export interface RequisitesAgents {
  agentName: string
  banks: RequisitesBanks[]
}

export interface RequisitesDealerServices {
  provider: string
  agents: RequisitesAgents[]
}

export interface Requisites {
  dealerCenterRequisites: RequisitesAdditionalOptions[]
  dealerServicesRequisites: RequisitesDealerServices[]
  additionalEquipmentRequisites: RequisitesAdditionalOptions[]
}

export interface AdditionalOptions {
  bankOptionType: number
  productType: any
  legalPerson: string
  provider: string
  agent: string
  productCost: number
  bankIdentificationCode: string
  loanTerm: number
  documentId: string
  beneficiaryBank: string
  correspondentAccount: string
  bankAccountNumber: string
  taxPresence: boolean
  taxation: string
  isCredit: boolean
}

export interface ClientDossier {
  applicationId: string
  status: StatusCode
  dealerCenterNumber: string
  dealerCenterName: string
  dealerCenterAddress: string
  applicationNumber: string
  clientName: string
  passport: string
  carBrand: string
  carModel: string
  creditSum: number
  creditLegalEntity: string
  creditReceiverBank: string
  creditBankAccountNumber: string
  monthlyPayment: number
  downPayment: number
  overdraft: number
  rate: number
  productSum: number
  term: number
  productName: string
  additionalOptions: AdditionalOptions[]
}

export const mockRequisites = (): Requisites => ({
  dealerCenterRequisites: [
    {
      legalEntityName: 'Anex',
      banks: [
        {
          bankName: 'Сбербанк',
          bankBik: '646494331',
          bankCorrAccount: '40702810038000017249',
          accountNumbers: ['40702810038000017240', '40702810038000017241', '40702810038000017242'],
        },
        {
          bankName: 'Альфабанк',
          bankBik: '646495442',
          bankCorrAccount: '40702810038000014270',
          accountNumbers: ['40702810038000014268', '40702810038000024369'],
        },
        {
          bankName: 'Тинькофф Банк',
          bankBik: '646496553',
          bankCorrAccount: '40702810038000062390',
          accountNumbers: ['40702810038000015243', '40702810038000062389'],
        },
      ],
    },
    {
      legalEntityName: 'САРМАТ',
      banks: [
        {
          bankName: 'ДальКомБанк',
          bankBik: '646497664',
          bankCorrAccount: '40702810038000011112',
          accountNumbers: ['40702810038000011111'],
        },
      ],
    },
  ],
  dealerServicesRequisites: [
    {
      provider: 'РосГосСтрах',
      agents: [
        {
          agentName: 'Райффайзен Банк',
          banks: [
            {
              bankName: 'МТС Банк',
              bankBik: '642674335',
              bankCorrAccount: '40702810038000015433',
              accountNumbers: ['40702810038000011532', '40702810038000052379', '40702810038000015432'],
            },
            {
              bankName: 'Альфабанк',
              bankBik: '646495446',
              bankCorrAccount: '40702810038000024370',
              accountNumbers: ['40702810038000014268', '40702810038000024369'],
            },
            {
              bankName: 'Банк Открытие',
              bankBik: '527494327',
              bankCorrAccount: '40702810038000054322',
              accountNumbers: ['40702810038000012345', '40702810038000054321'],
            },
          ],
        },
        {
          agentName: 'Почта Банк',
          banks: [
            {
              bankName: 'Альфабанк',
              bankBik: '646495448',
              bankCorrAccount: '40702810038000024374',
              accountNumbers: ['40702810038000014262', '40702810038000024363'],
            },
            {
              bankName: 'Банк Открытие',
              bankBik: '527494329',
              bankCorrAccount: '40702810038000054323',
              accountNumbers: ['40702810038000012344', '40702810038000054329'],
            },
          ],
        },
        {
          agentName: 'Сбербанк',
          banks: [
            {
              bankName: 'Банк Открытие',
              bankBik: '527494320',
              bankCorrAccount: '40702810038000054367',
              accountNumbers: ['40702810038000012357'],
            },
          ],
        },
      ],
    },
    {
      provider: 'Газпром страхование',
      agents: [
        {
          agentName: 'МТС Банк',
          banks: [
            {
              bankName: 'Банк Русский Стандарт',
              bankBik: '642639081',
              bankCorrAccount: '40702810038000063479',
              accountNumbers: ['40702810038000011532', '40702810038000042389', '40702810038000063478'],
            },
          ],
        },
        {
          agentName: 'Qiwi Банк',
          banks: [
            {
              bankName: 'Webmoney',
              bankBik: '642635462',
              bankCorrAccount: '40702810038000063367',
              accountNumbers: ['40702810038000011537', '40702810038000042471', '40702810038000063934'],
            },
          ],
        },
      ],
    },
    {
      provider: 'Ингосстрах',
      agents: [
        {
          agentName: 'ЛокоБанк',
          banks: [
            {
              bankName: 'ДальКомБанк',
              bankBik: '646418563',
              bankCorrAccount: '40702810038000012223',
              accountNumbers: ['40702810038000012222'],
            },
          ],
        },
      ],
    },
  ],
  additionalEquipmentRequisites: [
    {
      legalEntityName: 'Arex',
      banks: [
        {
          bankName: 'Сбербанк',
          bankBik: '646494334',
          bankCorrAccount: '40702810038000017243',
          accountNumbers: ['40702810038000017240', '40702810038000017241', '40702810038000017242'],
        },
        {
          bankName: 'Тинькофф Банк',
          bankBik: '646496555',
          bankCorrAccount: '40702810038000062390',
          accountNumbers: ['40702810038000015243', '40702810038000062389'],
        },
      ],
    },
    {
      legalEntityName: 'САРМАТ',
      banks: [
        {
          bankName: 'ДальКомБанк',
          bankBik: '646497666',
          bankCorrAccount: '40702810038000011112',
          accountNumbers: ['40702810038000011111'],
        },
      ],
    },
  ],
})

export const mockRequisitesForTest = (): Requisites => ({
  dealerCenterRequisites: [
    {
      legalEntityName: 'Anex',
      banks: [
        {
          bankName: 'Сбербанк',
          bankBik: '646494337',
          bankCorrAccount: '40702810038000017249',
          accountNumbers: ['40702810038000017240'],
        },
      ],
    },
  ],
  dealerServicesRequisites: [
    {
      provider: 'РосГосСтрах',
      agents: [
        {
          agentName: 'Райффайзен Банк',
          banks: [
            {
              bankName: 'МТС Банк',
              bankBik: '642674338',
              bankCorrAccount: '40702810038000015433',
              accountNumbers: ['40702810038000011532'],
            },
          ],
        },
      ],
    },
  ],
  additionalEquipmentRequisites: [
    {
      legalEntityName: 'Arex',
      banks: [
        {
          bankName: 'Сбербанк',
          bankBik: '646494339',
          bankCorrAccount: '40702810038000017243',
          accountNumbers: ['40702810038000017240'],
        },
      ],
    },
  ],
})

const mockClientDossier: ClientDossier[] = [
  {
    applicationId: '1',
    status: StatusCode.INITIAL,
    dealerCenterNumber: '2003023272',
    dealerCenterName: 'ANEX TOUR',
    dealerCenterAddress: 'Хорошёвское шоссе, д.16, стр.3 ТЦ «На Беговой», 2 этаж',
    applicationNumber: '545544',
    clientName: 'Терентьев Михаил Павлович',
    passport: '0604060423',
    carBrand: 'KIA',
    carModel: 'RIO',
    creditSum: 2000000,
    creditLegalEntity: 'Anex',
    creditReceiverBank: 'Сбербанк',
    creditBankAccountNumber: '40702810038000017240',
    monthlyPayment: 10400,
    downPayment: 200000,
    overdraft: 0,
    rate: 9.8,
    productSum: 300000,
    term: 5,
    productName: 'Драйв В',
    additionalOptions: [
      {
        bankOptionType: 1,
        productType: 'Название продукта',
        legalPerson: '',
        provider: 'РосГосСтрах',
        agent: 'Имя агента',
        productCost: 400000,
        loanTerm: 24,
        bankIdentificationCode: '',
        documentId: '6566644-33',
        beneficiaryBank: 'ФК Открытие',
        correspondentAccount: '40702810038000017240',
        bankAccountNumber: '40702810038000017240',
        taxPresence: false,
        taxation: '0',
        isCredit: true,
      },
      {
        bankOptionType: 2,
        productType: 'Коврики',
        legalPerson: 'Arex',
        provider: '',
        agent: '',
        productCost: 10000,
        loanTerm: 0,
        bankIdentificationCode: '',
        documentId: '',
        beneficiaryBank: 'Тинькофф Банк',
        correspondentAccount: '40702810038000062390',
        bankAccountNumber: '40702810038000015243',
        taxPresence: false,
        taxation: '0',
        isCredit: true,
      },
      {
        bankOptionType: 2,
        productType: 'Сигнализация',
        legalPerson: 'САРМАТ',
        provider: '',
        agent: '',
        productCost: 15000,
        loanTerm: 0,
        bankIdentificationCode: '',
        documentId: '',
        beneficiaryBank: 'ДальКомБанк',
        correspondentAccount: '40702810038000011112',
        bankAccountNumber: '40702810038000011111',
        taxPresence: true,
        taxation: '25000',
        isCredit: false,
      },
    ],
  },
  {
    applicationId: '2',
    status: StatusCode.PROCESSED,
    dealerCenterNumber: '2003023272',
    dealerCenterName: 'ANEX TOUR',
    dealerCenterAddress: 'Хорошёвское шоссе, д.16, стр.3 ТЦ «На Беговой», 2 этаж',
    applicationNumber: '137645',
    clientName: 'Карасева Мелания Данииловна',
    passport: '7456164098',
    carBrand: 'HYUNDAI',
    carModel: 'SOLARIS',
    creditSum: 1600000,
    creditLegalEntity: 'Anex',
    creditReceiverBank: 'Сбербанк',
    creditBankAccountNumber: '40702810038000017240',
    monthlyPayment: 20000,
    downPayment: 210000,
    overdraft: 15000,
    rate: 9.8,
    productSum: 350000,
    term: 3,
    productName: 'Драйв C',
    additionalOptions: [],
  },
  {
    applicationId: '3',
    status: StatusCode.APPROVED,
    dealerCenterNumber: '2003023272',
    dealerCenterName: 'ANEX TOUR',
    dealerCenterAddress: 'Хорошёвское шоссе, д.16, стр.3 ТЦ «На Беговой», 2 этаж',
    applicationNumber: '734972',
    clientName: 'Смирнов Александр Александрович',
    passport: '2649673766',
    carBrand: 'BMW',
    carModel: 'M2',
    creditSum: 5000000,
    monthlyPayment: 32500,
    downPayment: 1000000,
    overdraft: 500000,
    rate: 15.0,
    productSum: 500000,
    creditLegalEntity: 'Anex',
    creditReceiverBank: 'Сбербанк',
    creditBankAccountNumber: '40702810038000017240',
    term: 12,
    productName: 'Драйв D',
    additionalOptions: [],
  },
  {
    applicationId: '4',
    status: StatusCode.FINALLY_APPROVED,
    dealerCenterNumber: '2003023272',
    dealerCenterName: 'ANEX TOUR',
    dealerCenterAddress: 'Хорошёвское шоссе, д.16, стр.3 ТЦ «На Беговой», 2 этаж',
    applicationNumber: '100234',
    clientName: 'Медведев Али Денисович',
    passport: '4536465774',
    carBrand: 'ACURA',
    carModel: 'Integra',
    creditSum: 1900000,
    creditLegalEntity: 'Anex',
    creditReceiverBank: 'Сбербанк',
    creditBankAccountNumber: '40702810038000017240',
    monthlyPayment: 25400,
    downPayment: 100000,
    overdraft: 10000,
    rate: 10.0,
    productSum: 250000,
    term: 1,
    productName: 'Драйв E',
    additionalOptions: [
      {
        bankOptionType: 1,
        productType: 'Перекраска',
        legalPerson: '',
        provider: 'РосГосСтрах',
        agent: 'Райффайзен Банк',
        productCost: 400000,
        loanTerm: 24,
        bankIdentificationCode: '',
        documentId: '6566644-33',
        beneficiaryBank: 'МТС Банк',
        correspondentAccount: '40702810038000011532',
        bankAccountNumber: '40702810038000011532',
        taxPresence: false,
        taxation: '0',
        isCredit: true,
      },
      {
        bankOptionType: 2,
        productType: 'Коврики',
        legalPerson: 'Arex',
        provider: '',
        agent: '',
        productCost: 10000,
        loanTerm: 0,
        bankIdentificationCode: '',
        documentId: '',
        beneficiaryBank: 'Тинькофф Банк',
        correspondentAccount: '40702810038000062390',
        bankAccountNumber: '40702810038000062389',
        taxPresence: false,
        taxation: '0',
        isCredit: false,
      },
    ],
  },
  {
    applicationId: '5',
    status: StatusCode.FORMATION,
    dealerCenterNumber: '2003023272',
    dealerCenterName: 'ANEX TOUR',
    dealerCenterAddress: 'Хорошёвское шоссе, д.16, стр.3 ТЦ «На Беговой», 2 этаж',
    applicationNumber: '667843',
    clientName: 'Поляков Виктор Николевич',
    passport: '4385623090',
    carBrand: 'Lexus',
    carModel: 'LS',
    creditSum: 6100000,
    creditLegalEntity: 'Anex',
    creditReceiverBank: 'Сбербанк',
    creditBankAccountNumber: '40702810038000017240',
    monthlyPayment: 43550,
    downPayment: 1500000,
    overdraft: 1000000,
    rate: 9.8,
    productSum: 400000,
    term: 7,
    productName: 'Драйв F',
    additionalOptions: [
      {
        bankOptionType: 1,
        productType: 'Перекраска',
        legalPerson: '',
        provider: 'РосГосСтрах',
        agent: 'Райффайзен Банк',
        productCost: 400000,
        loanTerm: 24,
        bankIdentificationCode: '',
        documentId: '6566644-33',
        beneficiaryBank: 'МТС Банк',
        correspondentAccount: '40702810038000011532',
        bankAccountNumber: '40702810038000011532',
        taxPresence: false,
        taxation: '0',
        isCredit: true,
      },
    ],
  },
  {
    applicationId: '6',
    status: StatusCode.REJECTED,
    dealerCenterNumber: '2003023272',
    dealerCenterName: 'ANEX TOUR',
    dealerCenterAddress: 'Хорошёвское шоссе, д.16, стр.3 ТЦ «На Беговой», 2 этаж',
    applicationNumber: '342657',
    clientName: 'Смирнова Галина Васильевна',
    passport: '4645334641',
    carBrand: 'Suzuki',
    carModel: 'Vitara',
    creditSum: 1400000,
    creditLegalEntity: 'Anex',
    creditReceiverBank: 'Сбербанк',
    creditBankAccountNumber: '40702810038000017240',
    monthlyPayment: 20000,
    downPayment: 100000,
    overdraft: 0,
    rate: 11.1,
    productSum: 50000,
    term: 3,
    productName: 'Драйв G',
    additionalOptions: [],
  },
  {
    applicationId: '7',
    status: StatusCode.CANCELED_DEAL,
    dealerCenterNumber: '2003023272',
    dealerCenterName: 'ANEX TOUR',
    dealerCenterAddress: 'Хорошёвское шоссе, д.16, стр.3 ТЦ «На Беговой», 2 этаж',
    applicationNumber: '265644',
    clientName: 'Крылова Елена Сергеевна',
    passport: '1123045489',
    carBrand: 'Suzuki',
    carModel: 'Jimny',
    creditSum: 3000000,
    creditLegalEntity: 'Anex',
    creditReceiverBank: 'Сбербанк',
    creditBankAccountNumber: '40702810038000017240',
    monthlyPayment: 33400,
    downPayment: 500000,
    overdraft: 0,
    rate: 12.2,
    productSum: 70000,
    term: 4,
    productName: 'Драйв H',
    additionalOptions: [],
  },
  {
    applicationId: '8',
    status: StatusCode.CANCELED,
    dealerCenterNumber: '2003023272',
    dealerCenterName: 'ANEX TOUR',
    dealerCenterAddress: 'Хорошёвское шоссе, д.16, стр.3 ТЦ «На Беговой», 2 этаж',
    applicationNumber: '774654',
    clientName: 'Морозов Максим Петрович',
    passport: '3764912328',
    carBrand: 'Audi',
    carModel: 'S5',
    creditSum: 3300000,
    monthlyPayment: 39900,
    downPayment: 500000,
    overdraft: 250000,
    rate: 9.8,
    productSum: 250000,
    creditLegalEntity: 'Anex',
    creditReceiverBank: 'Сбербанк',
    creditBankAccountNumber: '40702810038000017240',
    term: 8,
    productName: 'Драйв I',
    additionalOptions: [],
  },
  {
    applicationId: '9',
    status: StatusCode.SIGNED,
    dealerCenterNumber: '2003023272',
    dealerCenterName: 'ANEX TOUR',
    dealerCenterAddress: 'Хорошёвское шоссе, д.16, стр.3 ТЦ «На Беговой», 2 этаж',
    applicationNumber: '384399',
    clientName: 'Вершинина Мария Владимировна',
    passport: '5238452543',
    carBrand: 'Fiat',
    carModel: '500',
    creditSum: 900000,
    monthlyPayment: 15700,
    downPayment: 200000,
    overdraft: 45000,
    rate: 8.8,
    productSum: 20000,
    creditLegalEntity: 'Anex',
    creditReceiverBank: 'Сбербанк',
    creditBankAccountNumber: '40702810038000017240',
    term: 3,
    productName: 'Драйв J',
    additionalOptions: [
      {
        bankOptionType: 1,
        productType: 'Перекраска',
        legalPerson: '',
        provider: 'РосГосСтрах',
        agent: 'Райффайзен Банк',
        productCost: 400000,
        loanTerm: 24,
        bankIdentificationCode: '',
        documentId: '6566644-33',
        beneficiaryBank: 'МТС Банк',
        correspondentAccount: '40702810038000011532',
        bankAccountNumber: '40702810038000011532',
        taxPresence: false,
        taxation: '0',
        isCredit: true,
      },
      {
        bankOptionType: 1,
        productType: 'Тонирование стекол',
        legalPerson: '',
        provider: 'Ингосстрах',
        agent: 'ЛокоБанк',
        productCost: 550000,
        loanTerm: 36,
        bankIdentificationCode: '',
        documentId: '6566345-45',
        beneficiaryBank: 'ДальКомБанк',
        correspondentAccount: '40702810038000012222',
        bankAccountNumber: '40702810038000012222',
        taxPresence: true,
        taxation: '3500',
        isCredit: false,
      },
      {
        bankOptionType: 2,
        productType: 'Коврики',
        legalPerson: 'САРМАТ',
        provider: '',
        agent: '',
        productCost: 10000,
        loanTerm: 0,
        bankIdentificationCode: '',
        documentId: '',
        beneficiaryBank: 'ДальКомБанк',
        correspondentAccount: '40702810038000011112',
        bankAccountNumber: '40702810038000011111',
        taxPresence: false,
        taxation: '0',
        isCredit: false,
      },
      {
        bankOptionType: 2,
        productType: 'Сигнализация',
        legalPerson: 'Arex',
        provider: '',
        agent: '',
        productCost: 15000,
        loanTerm: 0,
        bankIdentificationCode: '',
        documentId: '',
        beneficiaryBank: 'Тинькофф Банк',
        correspondentAccount: '40702810038000062390',
        bankAccountNumber: '40702810038000062389',
        taxPresence: true,
        taxation: '1000',
        isCredit: true,
      },
    ],
  },
  {
    applicationId: '10',
    status: StatusCode.AUTHORIZED,
    dealerCenterNumber: '2003023272',
    dealerCenterName: 'ANEX TOUR',
    dealerCenterAddress: 'Хорошёвское шоссе, д.16, стр.3 ТЦ «На Беговой», 2 этаж',
    applicationNumber: '476239',
    clientName: 'Афанасьев Иван Савельевич',
    passport: '6349284509',
    carBrand: 'Exeed',
    carModel: 'TXL',
    creditSum: 1700000,
    monthlyPayment: 37000,
    downPayment: 100000,
    overdraft: 150000,
    rate: 13.0,
    productSum: 110000,
    creditLegalEntity: 'Anex',
    creditReceiverBank: 'Сбербанк',
    creditBankAccountNumber: '40702810038000017240',
    term: 6,
    productName: 'Драйв K',
    additionalOptions: [],
  },
  {
    applicationId: '11',
    status: StatusCode.ISSUED,
    dealerCenterNumber: '2003023272',
    dealerCenterName: 'ANEX TOUR',
    dealerCenterAddress: 'Хорошёвское шоссе, д.16, стр.3 ТЦ «На Беговой», 2 этаж',
    applicationNumber: '158734',
    clientName: 'Шевцов Илья Иванович',
    passport: '3867295811',
    carBrand: 'Volvo',
    carModel: 'S90',
    creditSum: 4300000,
    monthlyPayment: 44400,
    downPayment: 600000,
    overdraft: 300000,
    rate: 9.8,
    productSum: 300000,
    creditLegalEntity: 'Anex',
    creditReceiverBank: 'Сбербанк',
    creditBankAccountNumber: '40702810038000017240',
    term: 9,
    productName: 'Драйв L',
    additionalOptions: [],
  },
  {
    applicationId: '12',
    status: StatusCode.ERROR,
    dealerCenterNumber: '2003023272',
    dealerCenterName: 'ANEX TOUR',
    dealerCenterAddress: 'Хорошёвское шоссе, д.16, стр.3 ТЦ «На Беговой», 2 этаж',
    applicationNumber: '538744',
    clientName: 'Реброва Маргарита Александровна',
    passport: '1763497865',
    carBrand: 'Citroen',
    carModel: 'C4',
    creditSum: 2200000,
    monthlyPayment: 22399,
    downPayment: 130000,
    overdraft: 123000,
    rate: 10.5,
    productSum: 100000,
    creditLegalEntity: 'Anex',
    creditReceiverBank: 'Сбербанк',
    creditBankAccountNumber: '40702810038000017240',
    term: 5,
    productName: 'Драйв M',
    additionalOptions: [],
  },
  {
    applicationId: '13',
    status: StatusCode.APPROVED,
    dealerCenterNumber: '2003023272',
    dealerCenterName: 'ANEX TOUR',
    dealerCenterAddress: 'Хорошёвское шоссе, д.16, стр.3 ТЦ «На Беговой», 2 этаж',
    applicationNumber: '347645',
    clientName: 'Сомова Анна Павловна',
    passport: '2856318544',
    carBrand: 'Renault',
    carModel: 'Logan',
    creditSum: 2500000,
    monthlyPayment: 100000,
    downPayment: 1000000,
    overdraft: 0,
    rate: 9.8,
    productSum: 300000,
    creditLegalEntity: 'Anex',
    creditReceiverBank: 'Сбербанк',
    creditBankAccountNumber: '40702810038000017240',
    term: 1,
    productName: 'Драйв N',
    additionalOptions: [],
  },
  {
    applicationId: '14',
    status: StatusCode.CANCELED,
    dealerCenterNumber: '2003023272',
    dealerCenterName: 'ANEX TOUR',
    dealerCenterAddress: 'Хорошёвское шоссе, д.16, стр.3 ТЦ «На Беговой», 2 этаж',
    applicationNumber: '374987',
    clientName: 'Ребров Игорь Семенович',
    passport: '2748365923',
    carBrand: 'Volkswagen',
    carModel: 'Polo',
    creditSum: 3000000,
    monthlyPayment: 30000,
    downPayment: 300000,
    overdraft: 300000,
    rate: 13.3,
    productSum: 300000,
    creditLegalEntity: 'Anex',
    creditReceiverBank: 'Сбербанк',
    creditBankAccountNumber: '40702810038000017240',
    term: 3,
    productName: 'Драйв O',
    additionalOptions: [],
  },
  {
    applicationId: '15',
    status: StatusCode.REJECTED,
    dealerCenterNumber: '2003023272',
    dealerCenterName: 'ANEX TOUR',
    dealerCenterAddress: 'Хорошёвское шоссе, д.16, стр.3 ТЦ «На Беговой», 2 этаж',
    applicationNumber: '476389',
    clientName: 'Зимовский Антон Владимирович',
    passport: '4738725987',
    carBrand: 'Rover',
    carModel: '500',
    creditSum: 1250000,
    monthlyPayment: 43500,
    downPayment: 250000,
    overdraft: 70000,
    rate: 9.8,
    productSum: 200000,
    creditLegalEntity: 'Anex',
    creditReceiverBank: 'Сбербанк',
    creditBankAccountNumber: '40702810038000017240',
    term: 3,
    productName: 'Драйв P',
    additionalOptions: [],
  },
  {
    applicationId: '16',
    status: StatusCode.APPROVED,
    dealerCenterNumber: '2003023272',
    dealerCenterName: 'ANEX TOUR',
    dealerCenterAddress: 'Хорошёвское шоссе, д.16, стр.3 ТЦ «На Беговой», 2 этаж',
    applicationNumber: '486734',
    clientName: 'Калугин Андрей Николаевич',
    passport: '4632974876',
    carBrand: 'KIA',
    carModel: 'Cerato',
    creditSum: 1500000,
    creditLegalEntity: 'Anex',
    creditReceiverBank: 'Сбербанк',
    creditBankAccountNumber: '40702810038000017240',
    monthlyPayment: 15000,
    downPayment: 250000,
    overdraft: 0,
    rate: 9.8,
    productSum: 300000,
    term: 10,
    productName: 'Драйв Q',
    additionalOptions: [],
  },
]

export function getMockedClientDossier(applicationId: string): ClientDossier {
  const dossier = mockClientDossier.find(application => application.applicationId == applicationId)
  if (!dossier) {
    return mockClientDossier[0]
  }

  return dossier
}

export async function getMockAgreement() {
  const files = []
  await sleep(1000)
  const mockFile = mockCreditAgreementFile
  const blob = await fetch(`data:${mockFile.type};base64,${mockFile.content}`).then(response =>
    response.blob(),
  )
  files.push(new File([blob], mockFile.name, { type: mockFile.type }))
  files.push(new File([blob], 'Еще документ', { type: mockFile.type }))

  return files
}

export async function getMockQuestionnaire(applicationId: string) {
  await sleep(3000)
  const application = getMockedClientDossier(applicationId)
  if (application == undefined || application.status == StatusCode.INITIAL) {
    return undefined
  }
  const mockFile = mockQuestionnaire
  const blob = await fetch(`data:${mockFile.type};base64,${mockFile.content}`).then(response =>
    response.blob(),
  )

  return new File([blob], mockFile.name, { type: mockFile.type })
}

const mockCreditAgreementFile = {
  name: 'Кредитный договор',
  type: 'application/pdf',
  content:
    'JVBERi0xLjcKJeLjz9MKNCAwIG9iago8PAovVHlwZSAvWE9iamVjdAovU3VidHlwZSAvSW1hZ2UKL1dpZHRoIDUwCi9IZWlnaHQgNTAKL0JpdHNQZXJDb21wb25lbnQgOAovQ29sb3JTcGFjZSAvRGV2aWNlUkdCCi9GaWx0ZXIgWy9GbGF0ZURlY29kZSAvRENURGVjb2RlXQovTGVuZ3RoIDgzOQovRGVjb2RlUGFybXMgW251bGwgPDwKL1F1YWxpdHkgNjAKPj5dCj4+CnN0cmVhbQp4nPt/4/9tBmcGXk4ubi4OXm4ubj4+Xn5hBVFhISFhdRk5cQU9TUMDPU1dHWMrLztjMzdzHV2HcEc3H7+g4CAju6jEqIAEr8Agf5AhjHx8fMKCwmqiomr+prqm/iSD/wcYBDkYjBiMmBmVGJgEGZkFGf8fYZBnYGBkZQQDBihgZGJmYWVj5wA6GqhgqwADEyMzMxMLMysrCwtQthYoz8AiyCqkaOjIJhyYyK5UKGLUOHEhh7LTxoOiQRc/qBgnFTVxcomJS0hKqaqpa2hqmZiamVtYWjm7uLq5e3h6BYeEhoVHREYlp6SmpWdkZhWXlJaVV1RWNbe0trV3dHZNmjxl6rTpM2bOWrR4ydJly1esXLVp85at27bv2Lnr0OEjR48dP3Hy1KXLV65eu37j5q2Hjx4/efrs+YuXrz5++vzl67fvP37+AvmLkYGZEQaw+ksQ6C8mFhZmFnaQvxiZykEKBFlYFQ3ZhBwD2RMLhZWMGjlEnCYu3HiQU9k46INoUtFFLjEVk4eqH0FeA/uMOI81keUzuMcQ/rrFwMPMCIw8ZkEGe4Y3rtZbDYJ8TQLUXi4JkXs2k+XQ9L3px9fc2FeozSobOeFBbdahLLOcp2GPjNyj5pXeWW10VWPJ68ts01Y4XXQVORbCwucvH/U476tybdWTfeIqCl+Yt5aaq8VvNnaV1GELSdrzKd/oUMXTidsqdzIIfvctDplu1nFrju5qE+VdXdqnu4MN3Q/csc16fF7qUORTjnV2eYUTIwui14h3a0w4den5c2Xb7Kgnt05zbJmtmiLtf7KBrbZyTey63PTkZOc9Cg6LnD6cmz29/LJC171w3u9+roUX/WXXHknwOJ/P5nHoQ7PE2z+mVyM32e6yyZ2qHR08d4vhXOtXEYv6j3XdenF8ak+AtnH4BZ2vHl5euyvvcH1sfh0l7zXVz930XIlcpXmLabb5fwbn6Wf9bpquTn541q0i/LfT91OBfwwXsH9ed6TI8tHiIoYlF67MbJdv11HqWBlWZmO8O+Xa3l0clzMsZfeuEjqyfatP+46FvHffRZwVOfP7YnhRjlvV5ctrRUIYtsrs1VjUvuFi/F6fuSsWTdKcFOgqmiL//yYAmziQggplbmRzdHJlYW0KZW5kb2JqCjUgMCBvYmoKPDwKL0ZpbHRlciAvRmxhdGVEZWNvZGUKL0xlbmd0aCAzNAo+PgpzdHJlYW0KeJwr5DI21zNVMABCMMPEAISSc7n0IwwUXPK5ArkAdCEGxwplbmRzdHJlYW0KZW5kb2JqCjMgMCBvYmoKPDwKL1R5cGUgL1BhZ2UKL01lZGlhQm94IFswIDAgMTE3LjUgMTE3LjVdCi9SZXNvdXJjZXMgPDwKL1hPYmplY3QgPDwKL1gwIDQgMCBSCj4+Cj4+Ci9Db250ZW50cyA1IDAgUgovUGFyZW50IDIgMCBSCj4+CmVuZG9iagoyIDAgb2JqCjw8Ci9UeXBlIC9QYWdlcwovS2lkcyBbMyAwIFJdCi9Db3VudCAxCj4+CmVuZG9iagoxIDAgb2JqCjw8Ci9UeXBlIC9DYXRhbG9nCi9QYWdlcyAyIDAgUgo+PgplbmRvYmoKNiAwIG9iago8PAovUHJvZHVjZXIgKGlMb3ZlUERGKQovTW9kRGF0ZSAoRDoyMDIzMDQwNzEyMDUwMFopCj4+CmVuZG9iago3IDAgb2JqCjw8Ci9TaXplIDgKL1Jvb3QgMSAwIFIKL0luZm8gNiAwIFIKL0lEIFs8N0I4MzAzMDFGNkZGMzE3RTc4NzMwOTQ0NDg3RkQ5RUE+IDxFQkQ1Rjc5NzExRThCOERBRENFNDFFRUYxMTE3MTFEMz5dCi9UeXBlIC9YUmVmCi9XIFsxIDIgMl0KL0ZpbHRlciAvRmxhdGVEZWNvZGUKL0luZGV4IFswIDhdCi9MZW5ndGggMzkKPj4Kc3RyZWFtCnicY2Bg+P+fkTWcgYGRVQ5IsMwEEgz8IJYBSKwDRJxnYAAAcegExgplbmRzdHJlYW0KZW5kb2JqCnN0YXJ0eHJlZgoxNDg3CiUlRU9GCg==',
}

const mockQuestionnaire = {
  name: 'Анкета',
  type: 'image/jpeg',
  content:
    '/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAQDAwQDAwQEAwQFBAQFBgoHBgYGBg0JCggKDw0QEA8NDw4RExgUERIXEg4PFRwVFxkZGxsbEBQdHx0aHxgaGxr/2wBDAQQFBQYFBgwHBwwaEQ8RGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhr/wAARCAAyADIDASIAAhEBAxEB/8QAHAAAAQUBAQEAAAAAAAAAAAAAAAQFBgcIAgMB/8QAMRAAAQMDAQUHAQkAAAAAAAAAAQIDBAAFEQYHEiExQRMiMkJRYWIWCBQVI0NxgZLB/8QAGAEAAwEBAAAAAAAAAAAAAAAAAgQFAwH/xAAiEQACAQMFAAMBAAAAAAAAAAAAAQIREjEDBBMhIjJCUaH/2gAMAwEAAhEDEQA/ANPoNe/lpM3XFxusGzxw9dJbMRvkC4rGT6AczWjaXbFUm3RIcUV7DxCoTC2p6Yk75TNebabOHHXYqwhJ+Rxwp6j6406++401d4qltkBfPAJ9TisVr6b+yGOOaWCQ12iuAQsApKVAjIIrsCtEzJOnR1iivtFaVCqiOIcSgb6yEjqVVlvUGvF6w1HKcW+Exy4tERHVKE8AkfvzJrRF8cnfg77tuiuOyEJK2kbvHIHDhWJbmZmjLnCnzXhDE4OIQ2tBy0onBOfbqOlQt3rc3iJV2m3s9yyTOHqGDA1BerEu4uRpYSj7w30cBGeXUjrUolXiKxAcdkz24jMlvD53yneQBzOKry1WZm06hjzmpS7jInFWZCkhWQvieHX+TVkXxdjuUBFguxcUxNbDSyIpQlCd7lvZVj2qPKy9UwVlpztdUWfsr1SpLdnaRKXJtV2jh2OXcnGU7yVJJ6GrialtvjLS95PrWXoF4iaeukJtqY9JstrKnGwlruR0BO55eTQzz9a0Vpt9iXaokiG72rK2gQarbTcuKtyq/wAJWvtbvT6Y9Zoox8qKr8kP0mcM/wAEbCUkYwMVAdomxjT20S3LjXJksHeLqFtd3dcPnA9fWpuMA908aXNL7RHeNQFQtNtGJ7n9mLXml5B+l54uEQHuBSv8NWHpbYXrC7wGvrTUYtzSBjsIUVCXP7Vp9shbeVYSaSSXEtoNclFPtmsdaSVEVFE2GaWgQ3GlNPzHnO47IkvlbhB9zVmWaMiAx2LSyprP5Y6NgDAA9qbHHVOu/CnKMsABSTQwpXoKblJemPO9RSftPkKKcuQvaIleOlUfxGiilWdeD0FIJ/hNFFDL4hRyM36lOcfy0UUOnkYngWUUUU0Kn//Z',
}
