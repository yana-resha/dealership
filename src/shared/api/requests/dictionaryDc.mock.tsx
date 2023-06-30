import {
  CalculateCreditResponse,
  Car,
  GetCreditProductListResponse,
  GetVendorOptionsListResponse,
  OptionID,
  OptionType,
} from '@sberauto/dictionarydc-proto/public'

export const carBrands: Car[] = [
  { brand: 'BMW', models: ['1 series', '3 series'] },
  { brand: 'Fiat', models: ['Ducato', 'Punto', '500'] },
  { brand: 'KIA', models: ['Picanto', 'Rio', 'Ceed'] },
  { brand: 'Toyota', models: ['Camry', 'Corolla'] },
  { brand: 'Skoda', models: ['Rapid', 'Octavia', 'Superb'] },
]

export const creditProductListRsData: GetCreditProductListResponse = {
  fullDownpaymentMin: 0.2,
  fullDownpaymentMax: 0.6,
  fullDurationMin: 12,
  fullDurationMax: 72,
  creditProducts: [
    {
      productCode: '3',
      productName: 'Лайт A',
      productId: 'S',
      cascoFlag: true,
      downpaymentMin: 0.3,
      downpaymentMax: 0.7,
      durationMin: 24,
      durationMax: 72,
    },
    {
      productCode: '2',
      productId: 'M',
      productName: 'Лайт В',
      downpaymentMin: 0.1,
      downpaymentMax: 0.5,
      durationMin: 12,
      durationMax: 36,
    },
  ],
  bankOptions: [],
}

export const mockGetVendorOptionsResponse: GetVendorOptionsListResponse = {
  additionalOptions: [
    {
      optionId: OptionID.GAP,
      optionType: OptionType.DEALER,
      optionName: 'ОСАГО',
    },
    {
      optionId: OptionID.CASCO,
      optionType: OptionType.DEALER,
      optionName: 'КАСКО',
    },
    {
      optionId: OptionID.TONING_PAINTING,
      optionType: OptionType.DEALER,
      optionName: 'Перекрасить авто',
    },
    {
      optionId: OptionID.OTHER,
      optionType: OptionType.DEALER,
      optionName: 'Графика на кузове',
    },
    {
      optionId: OptionID.VEHICLE_ADAPTATION,
      optionType: OptionType.EQUIPMENT,
      optionName: 'Адаптация и подготовка автомобиля',
    },
    {
      optionId: OptionID.ALARM_AUTOSTART,
      optionType: OptionType.EQUIPMENT,
      optionName: 'Автосигнализация, автозапуск/установка',
    },
    {
      optionId: OptionID.ACOUSTIC_SYSTEM,
      optionType: OptionType.EQUIPMENT,
      optionName: 'Акустическая система, автозвук/установка',
    },
    {
      optionId: OptionID.DVR,
      optionType: OptionType.EQUIPMENT,
      optionName: 'Видеорегистратор/установка',
    },
    {
      optionId: OptionID.RIMS_TIRES_WHEELS,
      optionType: OptionType.EQUIPMENT,
      optionName: 'Диски/резина/колеса',
    },
    {
      optionId: OptionID.CRANKCASE_GEARBOXES,
      optionType: OptionType.EQUIPMENT,
      optionName: 'Защита картера, коробки передач/установка',
    },
    {
      optionId: OptionID.RADIATOR_PROTECTIVE_FILMS,
      optionType: OptionType.EQUIPMENT,
      optionName: 'Защита решётки радиатора, защитные плёнки/установка',
    },
    {
      optionId: OptionID.CARPETS,
      optionType: OptionType.EQUIPMENT,
      optionName: 'Ковры в салон/багажник',
    },
    {
      optionId: OptionID.CAR_TREATMENT_KIT,
      optionType: OptionType.EQUIPMENT,
      optionName: 'Комплект для обработки автомобиля',
    },
    {
      optionId: OptionID.ANTINOISE_ANTICORRSION,
      optionType: OptionType.EQUIPMENT,
      optionName: 'Обработка антишум, антикоррозия, полировка',
    },
    {
      optionId: OptionID.FENDERS_CROSSBARS_ROOFRAILS,
      optionType: OptionType.EQUIPMENT,
      optionName: 'Подкрылки,брызговики, дуги поперечные,рейлинги /установка',
    },
    {
      optionId: OptionID.CAR_TUNING,
      optionType: OptionType.EQUIPMENT,
      optionName: 'Тюнинг автомобиля',
    },
  ],
}

export const mockCalculateCreditResponse: CalculateCreditResponse = {
  products: [
    {
      productCodeName: 'DRVBF',
      productId: 'DRVB',
      productName: 'Драйв В', //creditProduct
      downpayment: 200000, //initialPayment
      term: 24, //term
      monthlyPayment: 9400, //monthlyPayment
      lastPayment: 9400, //lastPayment
      overpayment: 0, //overpayment
      currentRate: 18, //interestRate
      cascoFlag: true, //insurance
      totalSum: 1821466, //loanAmount
    },
    {
      productCodeName: 'DRVCF',
      productId: 'DRVC',
      productName: 'Драйв C',
      downpayment: 300000,
      term: 36,
      monthlyPayment: 10400,
      lastPayment: 10400,
      overpayment: 10000,
      currentRate: 17.5,
      cascoFlag: false,
      totalSum: 2100000,
    },
  ],
}
