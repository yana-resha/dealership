import { maskPassport } from 'shared/masks/InputMasks'

import { ClientData } from '../ClientForm.types'
import { configInitialValues } from '../config/clientFormInitialValues'

/** Помогает сформировать валидные данные для формы */
export const makeClientForm = (wetClientForm: RootState['order']['order']): ClientData => {
  const clientLastName = wetClientForm?.lastName ?? ''
  const clientFirstName = wetClientForm?.firstName ?? ''
  const clientMiddleName = wetClientForm?.middleName ?? ''

  const isPassport = wetClientForm?.passportSeries && wetClientForm?.passportNumber
  const passport = isPassport
    ? maskPassport(`${wetClientForm?.passportSeries}${wetClientForm?.passportNumber}`)
    : ''

  const birthDate = wetClientForm?.birthDate ? new Date(wetClientForm?.birthDate) : null
  const mobileNumber = wetClientForm?.phoneNumber || ''

  return {
    ...configInitialValues,
    clientFirstName,
    clientLastName,
    clientMiddleName,
    passport,
    birthDate,
    mobileNumber,
  }
}
