import { CalculatedProduct, RequiredServiceFlag } from '@sberauto/dictionarydc-proto/public'

import { checkIsNumber } from 'shared/lib/helpers'
import { formatNumber } from 'shared/lib/utils'
import { compareStrings } from 'shared/utils/compareStrings'

import { BANK_OFFERS_TABLE_HEADERS, HeaderCellKey, RateShowingType, SortOrder } from './BankOffers.config'

export const prepareRow = (row: CalculatedProduct) => {
  const options = {
    digits: 0,
  }
  const downpayment = formatNumber(checkIsNumber(row.downpayment) ? row.downpayment : '', options)
  const newDownpayment = formatNumber(
    row.discountGovprogram ? (row.downpayment ?? 0) + row.discountGovprogram : '',
    options,
  )

  const term = `${row.term} мес`
  const monthlyPayment = formatNumber(checkIsNumber(row.monthlyPayment) ? row.monthlyPayment : '', options)

  const lastPayment = formatNumber(checkIsNumber(row.lastPayment) ? row.lastPayment : '', options)
  const overpayment = formatNumber(checkIsNumber(row.overpayment) ? row.overpayment : '', options)
  const amountWithoutPercent = formatNumber(
    checkIsNumber(row.amountWithoutPercent) ? row.amountWithoutPercent : '',
    options,
  )
  // Нужна сумма кредита без процентов
  const totalSum = formatNumber(
    checkIsNumber(row.amountWithoutPercent) ? row.amountWithoutPercent : '',
    options,
  )
  const currentRate = formatNumber(checkIsNumber(row.currentRate) ? row.currentRate : '', {
    digits: 2,
  })
  const baseRate = formatNumber(
    checkIsNumber(row.baseRate) && row.discountAvailability && row.rateDelta ? row.baseRate : '',
    {
      digits: 2,
    },
  )

  const requiredServiceFlag = row.requiredServiceFlag === RequiredServiceFlag.OPTIONAL ? 'Нет' : 'Да'

  return {
    ...row,
    downpayment,
    newDownpayment,
    term,
    monthlyPayment,
    lastPayment,
    currentRate,
    baseRate,
    overpayment,
    amountWithoutPercent,
    totalSum,
    requiredServiceFlag,
    rateShowingType: row.discountAvailability
      ? row.rateDelta
        ? RateShowingType.WITH_DELTA
        : RateShowingType.WITH_ICON
      : RateShowingType.BASE_RATE,
  }
}

export const getCellsChildren = (row: CalculatedProduct) =>
  BANK_OFFERS_TABLE_HEADERS.map(header => {
    const preparedRow = prepareRow(row)
    let value: string | boolean | number | null | undefined =
      preparedRow[header.key as keyof CalculatedProduct]
    let { type } = header

    if (header.key === HeaderCellKey.INCOME_FLAG) {
      type = value ? type : undefined
      value = ''
    }
    if (value === undefined) {
      value = '-'
    } else if (typeof value === 'boolean') {
      value = value ? 'Да' : 'Нет'
    }

    let additionalValue
    let isAdditionalIcon = false

    if (header.key === HeaderCellKey.DOWNPAYMENT) {
      additionalValue = preparedRow.newDownpayment
    }

    if (
      header.key === HeaderCellKey.CURRENT_RATE &&
      preparedRow.rateShowingType === RateShowingType.WITH_DELTA
    ) {
      additionalValue = preparedRow.baseRate
    }

    if (
      header.key === HeaderCellKey.CURRENT_RATE &&
      preparedRow.rateShowingType === RateShowingType.WITH_ICON
    ) {
      isAdditionalIcon = true
    }

    return {
      name: header.key,
      value,
      additionalValue,
      isAdditionalIcon,
      type,
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

    return sortOrder === SortOrder.ASC
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

    return sortOrder === SortOrder.ASC
      ? (a[key] as number) - (b[key] as number)
      : (b[key] as number) - (a[key] as number)
  })
