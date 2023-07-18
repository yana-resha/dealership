import { CalculatedProduct } from '@sberauto/dictionarydc-proto/public'

import { formatNumber } from 'shared/lib/utils'

import { BANK_OFFERS_TABLE_HEADERS } from './BankOffers.config'
import { PreparedTableData } from './BankOffers.types'

export const getCellsChildrens = (
  row: PreparedTableData,
): { name: string; value: string | boolean; type?: string }[] =>
  BANK_OFFERS_TABLE_HEADERS.map(header => {
    let value: string | boolean | undefined = row[header.key as keyof PreparedTableData]
    let { type } = header

    if (header.key === 'incomeFlag') {
      type = value ? type : undefined
      value = ''
    }
    if (value === undefined) {
      value = '-'
    } else if (typeof value === 'boolean') {
      value = value ? 'Да' : 'Нет'
    }

    return {
      name: header.key,
      value: value,
      type: type,
    }
  })

export const prepareData = (data: CalculatedProduct[]) =>
  data.map(d => {
    const downpayment = formatNumber(d.downpayment !== undefined ? d.downpayment.toString() : '')
    const term = `${d.term} мес`
    const monthlyPayment = formatNumber(d.monthlyPayment !== undefined ? d.monthlyPayment.toString() : '')
    const lastPayment = formatNumber(d.lastPayment !== undefined ? d.lastPayment.toString() : '')
    const overpayment = formatNumber(d.overpayment !== undefined ? d.overpayment.toString() : '')
    const totalSum = formatNumber(d.totalSum !== undefined ? d.totalSum.toString() : '')
    const currentRate = formatNumber(d.currentRate !== undefined ? (d.currentRate * 100).toString() : '', {
      digits: 2,
    })

    return { ...d, downpayment, term, monthlyPayment, lastPayment, currentRate, overpayment, totalSum }
  })
