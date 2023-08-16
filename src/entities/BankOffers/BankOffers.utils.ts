import { CalculatedProduct } from '@sberauto/dictionarydc-proto/public'

import { formatNumber } from 'shared/lib/utils'

import { BANK_OFFERS_TABLE_HEADERS } from './BankOffers.config'

export const prepareRow = (row: CalculatedProduct) => {
  const downpayment = formatNumber(row.downpayment != undefined ? row.downpayment.toString() : '')
  const term = `${row.term} мес`
  const monthlyPayment = formatNumber(row.monthlyPayment != undefined ? row.monthlyPayment.toString() : '')
  const lastPayment = formatNumber(row.lastPayment != undefined ? row.lastPayment.toString() : '')
  const overpayment = formatNumber(row.overpayment != undefined ? row.overpayment.toString() : '')
  const amountWithoutPercent = formatNumber(
    row.amountWithoutPercent != undefined ? row.amountWithoutPercent.toString() : '',
  )
  const currentRate = formatNumber(row.currentRate != undefined ? (row.currentRate * 100).toString() : '', {
    digits: 2,
  })

  return {
    ...row,
    downpayment,
    term,
    monthlyPayment,
    lastPayment,
    currentRate,
    overpayment,
    amountWithoutPercent,
  }
}

export const getCellsChildren = (
  row: CalculatedProduct,
): { name: string; value: string | boolean | number; type?: string }[] =>
  BANK_OFFERS_TABLE_HEADERS.map(header => {
    let value: string | boolean | number | undefined = prepareRow(row)[header.key as keyof CalculatedProduct]
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
