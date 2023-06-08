import { GetVendorOptionsResponse } from '@sberauto/dictionarydc-proto/public'

export const carBrands = [
  { brand: 'BMW', models: ['1 series', '3 series'] },
  { brand: 'Fiat', models: ['Ducato', 'Punto', '500'] },
  { brand: 'KIA', models: ['Picanto', 'Rio', 'Ceed'] },
  { brand: 'Toyota', models: ['Camry', 'Corolla'] },
  { brand: 'Skoda', models: ['Rapid', 'Octavia', 'Superb'] },
]

export const creditProductListRsData = {
  fullDownpaymentMin: 20,
  fullDownpaymentMax: 60,
  fullDurationMin: 12,
  fullDurationMax: 72,
  products: [
    {
      productCode: '200039393',
      productName: 'Лайт A',
      downpaymentMin: '30',
      downpaymentMax: 70,
      durationMin: 24,
      durationMax: 72,
    },
    {
      productCode: '300039393',
      productName: 'Лайт В',
      downpaymentMin: '10',
      downpaymentMax: 50,
      durationMin: 12,
      durationMax: 36,
    },
  ],
  bankOptions: [
    {
      productCode: '1111',
      optionCode: '1000',
      optionName: 'КАСКО для всех',
      optionType: 'КАСКО',
    },
    {
      productCode: '2222',
      optionCode: '2000',
      optionName: 'ОСАГО для всех',
      optionType: 'ОСАГО',
    },
  ],
}

//TODO DCB-238: Убрать мок после интеграции
export const mockGetVendorOptionsResponse = {
  options: [
    {
      type: '12',
      optionName: 'ОСАГО',
    },
    {
      type: '13',
      optionName: 'КАСКО',
    },
    {
      type: '14',
      optionName: 'Перекрасить авто',
    },
    {
      type: '15',
      optionName: 'Графика на кузове',
    },
  ],
}

export const mockCalculateCreditResponse = {
  products: [
    {
      productFamilyCode: 'DRVBF',
      productCode: 'DRVB',
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
      productFamilyCode: 'DRVCF',
      productCode: 'DRVC',
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
