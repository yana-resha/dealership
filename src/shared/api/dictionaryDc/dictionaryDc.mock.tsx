import { sleep } from 'shared/lib/sleep'

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
      type: 12,
      optionName: 'ОСАГО',
    },
    {
      type: 13,
      optionName: 'КАСКО',
    },
    {
      type: 14,
      optionName: 'Перекрасить авто',
    },
    {
      type: 15,
      optionName: 'Графика на кузове',
    },
  ],
}
