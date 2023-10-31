import { CalculatedProduct } from '@sberauto/dictionarydc-proto/public'

import { formatNumber } from 'shared/lib/utils'

import { BANK_OFFERS_TABLE_HEADERS, TableCellKey } from './BankOffers.config'

export const prepareRow = (row: CalculatedProduct) => {
  const options = {
    digits: 0,
  }
  const downpayment = formatNumber(row.downpayment !== undefined ? row.downpayment : '', options)
  const term = `${row.term} мес`
  const monthlyPayment = formatNumber(row.monthlyPayment !== undefined ? row.monthlyPayment : '', options)

  const lastPayment = formatNumber(row.lastPayment !== undefined ? row.lastPayment : '', options)
  const overpayment = formatNumber(row.overpayment !== undefined ? row.overpayment : '', options)
  const amountWithoutPercent = formatNumber(
    row.amountWithoutPercent !== undefined ? row.amountWithoutPercent : '',
    options,
  )
  const totalSum = formatNumber(row.totalSum !== undefined ? row.totalSum : '', options)
  const currentRate = formatNumber(row.currentRate !== undefined ? row.currentRate * 100 : '', {
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
    totalSum,
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
