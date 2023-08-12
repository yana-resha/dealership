import { CalculatedProduct } from '@sberauto/dictionarydc-proto/public'

import { formatNumber } from 'shared/lib/utils'

import { BANK_OFFERS_TABLE_HEADERS, TableCellKey } from './BankOffers.config'

export const prepareRow = (row: CalculatedProduct) => {
  const options = {
    digits: 0,
  }
  const downpayment = formatNumber(row.downpayment !== undefined ? row.downpayment.toString() : '', options)
  const term = `${row.term} мес`
  const monthlyPayment = formatNumber(
    row.monthlyPayment !== undefined ? row.monthlyPayment.toString() : '',
    options,
  )

  const lastPayment = formatNumber(row.lastPayment !== undefined ? row.lastPayment.toString() : '', options)
  const overpayment = formatNumber(row.overpayment !== undefined ? row.overpayment.toString() : '', options)
  const amountWithoutPercent = formatNumber(
    row.amountWithoutPercent !== undefined ? row.amountWithoutPercent.toString() : '',
    options,
  )
  const currentRate = formatNumber(row.currentRate !== undefined ? (row.currentRate * 100).toString() : '', {
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

export const getCellsChildren = (row: CalculatedProduct) =>
  BANK_OFFERS_TABLE_HEADERS.map(header => {
    let value: string | boolean | number | undefined = prepareRow(row)[header.key as keyof CalculatedProduct]
    let { type } = header

    if (header.key === TableCellKey.IncomeFlag) {
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
