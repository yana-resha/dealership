import { IsClientRequest } from '@sberauto/loanapplifecycledc-proto/public'
import { DateTime } from 'luxon'

import { maskPhoneNumber } from 'shared/masks/InputMasks'
import { getFullName, getSplitedName } from 'shared/utils/clientNameTransform'

import { OrderFormData } from '../OrderForm.types'

/** Подготавливаем данные для отправки на сервер */
export const prepareData = (data: OrderFormData): IsClientRequest => {
  const passportSeries = data.passport ? data.passport.slice(0, 4) : undefined
  const passportNumber = data.passport ? data.passport.slice(4, data.passport.length) : undefined

  const { lastName, firstName, middleName } = getSplitedName(data.clientName)

  const birthDate =
    data.birthDate instanceof Date
      ? DateTime.fromJSDate(data.birthDate).toFormat('yyyy-LL-dd')
      : data.birthDate || undefined

  const phoneNumber = data.phoneNumber ? maskPhoneNumber(data.phoneNumber, true) : undefined

  return {
    passportSeries,
    passportNumber,
    lastName,
    firstName,
    middleName,
    birthDate,
    phoneNumber,
  }
}

/** Подготавливаем данные для отображения на форме */
export const parseData = (data: IsClientRequest): OrderFormData => {
  const { passportSeries, passportNumber, lastName, firstName, middleName, birthDate, phoneNumber } = data

  const passport = (passportSeries || '') + (passportNumber || '')
  const clientName = getFullName(firstName, lastName, middleName)

  const parsedBirthDate = birthDate ? new Date(birthDate) : null
  const parsedPhoneNumber = phoneNumber ? phoneNumber : ''

  return {
    passport,
    clientName,
    birthDate: parsedBirthDate,
    phoneNumber: parsedPhoneNumber,
  }
}
