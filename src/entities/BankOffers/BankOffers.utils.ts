import { CalculatedProduct } from '@sberauto/dictionarydc-proto/public'

import { formatNumber } from 'shared/lib/utils'
import { compareStrings } from 'shared/utils/compareStrings'

import { BANK_OFFERS_TABLE_HEADERS, HeaderCellKey, SortOrder } from './BankOffers.config'

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
  // Нужна сумма кредита без процентов
  const totalSum = formatNumber(
    row.amountWithoutPercent !== undefined ? row.amountWithoutPercent : '',
    options,
  )
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

    if (header.key === HeaderCellKey.IncomeFlag) {
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

export const sortBankOffersByString = (
  bankOffers: CalculatedProduct[],
  key: keyof CalculatedProduct,
  sortOrder: SortOrder,
) =>
  [...bankOffers].sort((a, b) => {
    // Некорректные значения сразу отправляем в конец списка
    if (typeof a[key] !== 'string' && typeof b[key] !== 'string') {
      return 0
    }
    if (typeof a[key] !== 'string') {
      return 1
    }
    if (typeof b[key] !== 'string') {
      return -1
    }

    return sortOrder === SortOrder.Asc
      ? compareStrings(a[key] as string, b[key] as string)
      : compareStrings(b[key] as string, a[key] as string)
  })

export const sortBankOffersByNumber = (
  bankOffers: CalculatedProduct[],
  key: keyof CalculatedProduct,
  sortOrder: SortOrder,
) =>
  [...bankOffers].sort((a, b) => {
    // Некорректные значения сразу отправляем в конец списка
    if (typeof a[key] !== 'number' && typeof b[key] !== 'number') {
      return 0
    }
    if (typeof a[key] !== 'number') {
      return 1
    }
    if (typeof b[key] !== 'number') {
      return -1
    }

    return sortOrder === SortOrder.Asc
      ? (a[key] as number) - (b[key] as number)
      : (b[key] as number) - (a[key] as number)
  })

export const sortBankOffersByCasco = (bankOffers: CalculatedProduct[], sortOrder: SortOrder) =>
  [...bankOffers].sort((a, b) => {
    if (a.cascoFlag && !b.cascoFlag) {
      return sortOrder === SortOrder.Desc ? -1 : 1
    }
    if (!a.cascoFlag && b.cascoFlag) {
      return sortOrder === SortOrder.Desc ? 1 : -1
    }

    return 0
  })
