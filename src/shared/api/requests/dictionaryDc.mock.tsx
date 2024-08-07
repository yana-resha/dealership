import {
  CalculatedProduct,
  GetCreditProductListResponse,
  GetVendorOptionsListResponse,
  OptionType,
} from '@sberauto/dictionarydc-proto/public'

export interface ModelInfo {
  model?: string
  govprogramFlag?: boolean
  govprogramDfoFlag?: boolean
  mass?: number
}

export interface BrandInfo {
  modelInfo?: Record<string, ModelInfo | null> | null
  brand?: string
  maxCarAge?: number
  madeIn?: string
  autoCategory?: string
}

export const CAR_BRANDS = {
  BMW: {
    brand: 'BMW',
    modelInfo: {
      '1 series': {
        model: '1 series',
        govprogramFlag: false,
        govprogramDfoFlag: false,
        mass: 1,
      },
      '3 series': {
        model: '3 series',
        govprogramFlag: true,
        govprogramDfoFlag: false,
        mass: 2,
      },
      '5 series': {
        model: '5 series',
        govprogramFlag: true,
        govprogramDfoFlag: true,
        mass: 3,
      },
    },
    maxCarAge: 20,
    madeIn: 'GERMANY',
    autoCategory: 'B',
  },
  Fiat: {
    brand: 'Fiat',
    modelInfo: {
      Punto: {
        model: 'Punto',
        govprogramFlag: false,
        govprogramDfoFlag: false,
        mass: 1,
      },
      500: {
        model: '500',
        govprogramFlag: false,
        govprogramDfoFlag: false,
        mass: 2,
      },
      Ducato: {
        model: 'Ducato',
        govprogramFlag: false,
        govprogramDfoFlag: false,
        mass: 3,
      },
    },
    maxCarAge: 1,
    madeIn: 'ITALY',
    autoCategory: 'B',
  },
  KIA: {
    brand: 'KIA',
    modelInfo: {
      Picanto: {
        model: 'Picanto',
        govprogramFlag: false,
        govprogramDfoFlag: false,
        mass: 1,
      },
      Rio: {
        model: 'Rio',
        govprogramFlag: true,
        govprogramDfoFlag: false,
        mass: 2,
      },
      Ceed: {
        model: 'Ceed',
        govprogramFlag: true,
        govprogramDfoFlag: true,
        mass: 3,
      },
    },
    maxCarAge: 19,
    madeIn: 'KOREA',
    autoCategory: 'B',
  },
  Toyota: {
    brand: 'Toyota',
    modelInfo: {
      Camry: {
        model: 'Camry',
        govprogramFlag: false,
        govprogramDfoFlag: false,
        mass: 1,
      },
      Corolla: {
        model: 'Corolla',
        govprogramFlag: true,
        govprogramDfoFlag: false,
        mass: 2,
      },
    },
    maxCarAge: 21,
    madeIn: 'JAPAN',
    autoCategory: 'B',
  },
  Skoda: {
    brand: 'Skoda',
    modelInfo: {
      Rapid: {
        model: 'Rapid',
        govprogramFlag: false,
        govprogramDfoFlag: false,
        mass: 1,
      },
      Octavia: {
        model: 'Octavia',
        govprogramFlag: false,
        govprogramDfoFlag: false,
        mass: 2,
      },
      Superb: {
        model: 'Superb',
        govprogramFlag: false,
        govprogramDfoFlag: false,
        mass: 3,
      },
    },
    maxCarAge: 2,
    madeIn: 'CZECH',
    autoCategory: 'B',
  },
}

export const creditProductListRsData: GetCreditProductListResponse = {
  fullDownpaymentMin: 20,
  fullDownpaymentMax: 60,
  fullDurationMin: 12,
  fullDurationMax: 72,
  creditProducts: [
    {
      productCode: 3,
      productName: 'Лайт A',
      productId: '3',
      conditions: [
        {
          downpaymentMin: 30,
          downpaymentMax: 70,
          durationMin: 24,
          durationMax: 72,
        },
      ],
    },
    {
      productCode: 2,
      productId: '2',
      productName: 'Лайт В',
      conditions: [
        {
          downpaymentMin: 10,
          downpaymentMax: 50,
          durationMin: 12,
          durationMax: 36,
        },
      ],
    },
  ],
}

export const mockGetVendorOptionsResponse: GetVendorOptionsListResponse = {
  additionalOptions: [
    {
      optionId: '1',
      optionType: OptionType.DEALER,
      optionName: 'ОСАГО',
    },
    {
      optionId: '15',
      optionType: OptionType.DEALER,
      optionName: 'КАСКО',
    },
    {
      optionId: '3',
      optionType: OptionType.DEALER,
      optionName: 'Перекрасить авто',
    },
    {
      optionId: '4',
      optionType: OptionType.DEALER,
      optionName: 'Графика на кузове',
    },
    {
      optionId: '5',
      optionType: OptionType.EQUIPMENT,
      optionName: 'Адаптация и подготовка автомобиля',
    },
    {
      optionId: '6',
      optionType: OptionType.EQUIPMENT,
      optionName: 'Автосигнализация, автозапуск/установка',
    },
    {
      optionId: '7',
      optionType: OptionType.EQUIPMENT,
      optionName: 'Акустическая система, автозвук/установка',
    },
    {
      optionId: '8',
      optionType: OptionType.EQUIPMENT,
      optionName: 'Видеорегистратор/установка',
    },
    {
      optionId: '9',
      optionType: OptionType.EQUIPMENT,
      optionName: 'Диски/резина/колеса',
    },
    {
      optionId: '10',
      optionType: OptionType.EQUIPMENT,
      optionName: 'Защита картера, коробки передач/установка',
    },
    {
      optionId: '11',
      optionType: OptionType.EQUIPMENT,
      optionName: 'Защита решётки радиатора, защитные плёнки/установка',
    },
    {
      optionId: '12',
      optionType: OptionType.EQUIPMENT,
      optionName: 'Ковры в салон/багажник',
    },
    {
      optionId: '13',
      optionType: OptionType.EQUIPMENT,
      optionName: 'Комплект для обработки автомобиля',
    },
    {
      optionId: '14',
      optionType: OptionType.EQUIPMENT,
      optionName: 'Обработка антишум, антикоррозия, полировка',
    },
    {
      optionId: '15',
      optionType: OptionType.EQUIPMENT,
      optionName: 'Подкрылки,брызговики, дуги поперечные,рейлинги /установка',
    },
    {
      optionId: '16',
      optionType: OptionType.EQUIPMENT,
      optionName: 'Тюнинг автомобиля',
    },
  ],
}

export const mockedCalculatedProducts: CalculatedProduct[] = [
  {
    productCodeName: 'ACDE',
    productCode: 10,
    productName: 'Максимум: Без Каско',
    productId: '1',
    downpayment: 1000500,
    term: 84,
    monthlyPayment: 19820.47,
    lastPayment: 0,
    overpayment: 762419.48,
    currentRate: 0.159,
    totalSum: 1664919.48,
    incomeFlag: false,
    amountWithoutPercent: 1002500,
    amountWithoutOptions: 1659937.44,
    servicesInCreditPrice: 2000,
    equipmentInCreditPrice: 1000,
  },
  {
    productCodeName: 'AKPE',
    productCode: 10,
    productName: 'Комфорт Плюс: без Каско',
    productId: '2',
    downpayment: 1000500,
    term: 84,
    monthlyPayment: 20301.93,
    lastPayment: 0,
    overpayment: 502862.12,
    currentRate: 0.167,
    totalSum: 1705362.12,
    incomeFlag: false,
    amountWithoutPercent: 1002500,
    amountWithoutOptions: 1700258.28,
    servicesInCreditPrice: 2000,
    equipmentInCreditPrice: 1000,
  },
  {
    productCodeName: 'AMRE',
    productCode: 10,
    productName: 'Лайт: Драйв без Каско',
    productId: '3',
    downpayment: 1000500,
    term: 84,
    monthlyPayment: 19820.47,
    lastPayment: 0,
    overpayment: 462419.48,
    currentRate: 0.159,
    totalSum: 1664919.48,
    incomeFlag: false,
    amountWithoutPercent: 1002500,
    amountWithoutOptions: 1659937.44,
    servicesInCreditPrice: 2000,
    equipmentInCreditPrice: 1000,
  },
  {
    productCodeName: 'AVHE',
    productCode: 10,
    productName: 'Комфорт: без Каско',
    productId: '4',
    downpayment: 1000500,
    term: 84,
    monthlyPayment: 20163.76,
    lastPayment: 0,
    overpayment: 991255.84,
    currentRate: 0.164,
    totalSum: 1693755.84,
    incomeFlag: false,
    amountWithoutPercent: 1002500,
    amountWithoutOptions: 1688687.28,
    servicesInCreditPrice: 2000,
    equipmentInCreditPrice: 1000,
  },
  {
    productCodeName: 'AVTE',
    productCode: 10,
    productName: 'Комфорт: Драйв без Каско',
    productId: '5',
    downpayment: 1000500,
    term: 84,
    monthlyPayment: 20301.93,
    lastPayment: 0,
    overpayment: 702862.12,
    currentRate: 0.167,
    totalSum: 1705362.12,
    incomeFlag: false,
    amountWithoutPercent: 1002500,
    amountWithoutOptions: 1700258.28,
    servicesInCreditPrice: 2000,
    equipmentInCreditPrice: 1000,
  },
  {
    productCodeName: 'LUBE',
    productCode: 10,
    productName: 'Лайт: без Каско',
    productId: '6',
    downpayment: 1000500,
    term: 84,
    monthlyPayment: 19009.08,
    lastPayment: 0,
    overpayment: 594262.72,
    currentRate: 0.144,
    totalSum: 1596762.72,
    incomeFlag: false,
    amountWithoutPercent: 1002500,
    amountWithoutOptions: 1591983.96,
    servicesInCreditPrice: 2000,
    equipmentInCreditPrice: 1000,
  },
]
