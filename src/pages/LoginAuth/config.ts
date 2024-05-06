import { string } from 'yup'

import { FieldMessages } from 'shared/constants/fieldMessages'

export const loginValidation = string().required(FieldMessages.required).min(5, FieldMessages.enterFullData)
