import { object } from 'yup'

import { loginValidation } from '../config'
import { FormFieldMap } from '../types'

export const recoveryLoginFormValidation = object({
  [FormFieldMap.LOGIN]: loginValidation,
})
