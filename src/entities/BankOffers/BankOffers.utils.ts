import { CalculatedProduct } from '@sberauto/dictionarydc-proto/public'

import { ADDITIONAL_CELL_NAME } from './BankOffers.config'
import { PreparedTableData } from './BankOffers.types'

export const getCellsChildrens = (row: PreparedTableData) => [
  ...Object.entries(row).reduce((acc, [key, value]) => {
    if (key === 'productFamilyCode' || key === 'productCode') {
      return acc
    }
    if (key === 'cascoFlag') {
      value = value ? 'Да' : 'Нет'
    }

    acc.push({ name: key, value })

    return acc
  }, [] as { name: string; value: string | boolean }[]),
  { name: ADDITIONAL_CELL_NAME, value: '' },
]

const prettifyString = (str: string) => str.replace(/(\d{1,3}(?=(?:\d\d\d)+(?!\d)))/g, '$1' + ' ')

export const prepareData = (data: CalculatedProduct[]) =>
  data.map(d => {
    const downpayment = prettifyString(d.downpayment != undefined ? d.downpayment.toString() : '')
    const term = `${d.term} мес`
    const monthlyPayment = prettifyString(d.monthlyPayment != undefined ? d.monthlyPayment.toString() : '')
    const lastPayment = prettifyString(d.lastPayment != undefined ? d.lastPayment.toString() : '')
    const overpayment = prettifyString(d.overpayment != undefined ? d.overpayment.toString() : '')
    const totalSum = prettifyString(d.totalSum != undefined ? d.totalSum.toString() : '')
    const currentRate = d.currentRate != undefined ? d.currentRate.toString() : ''

    return { ...d, downpayment, term, monthlyPayment, lastPayment, currentRate, overpayment, totalSum }
  })
