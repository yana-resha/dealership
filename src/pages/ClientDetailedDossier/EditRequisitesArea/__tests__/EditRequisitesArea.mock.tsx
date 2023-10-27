import { OptionType } from '@sberauto/dictionarydc-proto/public'
import { StatusCode } from '@sberauto/loanapplifecycledc-proto/public'

export interface RequisitesBanks {
  bankName: string
  bankBik: string
  bankCorrAccount: string
  accountNumbers: string[]
}

export interface RequisitesAdditionalOptions {
  legalEntityName: string
  tax: number
  banks: RequisitesBanks[]
}

export interface RequisitesAgents {
  agentName: string
  tax: number
  banks: RequisitesBanks[]
}

export interface RequisitesDealerServices {
  provider: string
  tax: number
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
  legalPersonCode: string
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
      legalEntityName: '2002985190',
      tax: 0.146,
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
      tax: 0.134,
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
      tax: 0.158,
      agents: [
        {
          agentName: 'Райффайзен Банк',
          tax: 0.195,
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
          tax: 0.166,
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
          tax: 0.137,
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
      tax: 0.101,
      agents: [
        {
          agentName: 'МТС Банк',
          tax: 0.127,
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
          tax: 0.14,
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
      tax: 0.199,
      agents: [
        {
          agentName: 'ЛокоБанк',
          tax: 0.178,
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
      tax: 0.161,
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
      tax: 0.119,
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
    creditLegalEntity: '2002703288',
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
        bankOptionType: OptionType.DEALER,
        productType: 'Название продукта',
        legalPersonCode: '',
        provider: 'РосГосСтрах',
        agent: 'Почта Банк',
        productCost: 400000,
        loanTerm: 24,
        bankIdentificationCode: '',
        documentId: '6566644-33',
        beneficiaryBank: 'Альфабанк',
        correspondentAccount: '40702810038000014263',
        bankAccountNumber: '40702810038000014262',
        taxPresence: false,
        taxation: '0',
        isCredit: true,
      },
      {
        bankOptionType: OptionType.EQUIPMENT,
        productType: 'Коврики',
        legalPersonCode: 'Arex',
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
        bankOptionType: OptionType.EQUIPMENT,
        productType: 'Сигнализация',
        legalPersonCode: 'САРМАТ',
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
        bankOptionType: OptionType.DEALER,
        productType: 'Перекраска',
        legalPersonCode: '',
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
        bankOptionType: OptionType.EQUIPMENT,
        productType: 'Коврики',
        legalPersonCode: 'Arex',
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
        bankOptionType: OptionType.DEALER,
        productType: 'Перекраска',
        legalPersonCode: '',
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
        bankOptionType: OptionType.DEALER,
        productType: 'Перекраска',
        legalPersonCode: '',
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
        bankOptionType: OptionType.DEALER,
        productType: 'Тонирование стекол',
        legalPersonCode: '',
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
        bankOptionType: OptionType.EQUIPMENT,
        productType: 'Коврики',
        legalPersonCode: 'САРМАТ',
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
        bankOptionType: OptionType.EQUIPMENT,
        productType: 'Сигнализация',
        legalPersonCode: 'Arex',
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
