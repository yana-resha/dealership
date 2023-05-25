import { maskPassport } from 'shared/masks/InputMasks'

import { ClientData } from '../ClientForm.types'
import { configInitialValues } from '../config/clientFormInitialValues'

/** Помогает сформировать валидные данные для формы */
export const makeClientForm = (wetClientForm: RootState['order']['order']): ClientData => {
  const clientName = `${wetClientForm?.lastName ?? ''} ${wetClientForm?.firstName ?? ''} ${
    wetClientForm?.middleName ?? ''
  }`.trim()

  const isPassport = wetClientForm?.passportSeries && wetClientForm?.passportNumber
  const passport = isPassport
    ? maskPassport(`${wetClientForm?.passportSeries}${wetClientForm?.passportNumber}`)
    : ''

  const birthDate = wetClientForm?.birthDate ? new Date(wetClientForm?.birthDate) : null
  const mobileNumber = wetClientForm?.phoneNumber || ''

  return { ...configInitialValues, clientName, passport, birthDate, mobileNumber }
}
