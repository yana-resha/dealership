import { getFullName } from 'shared/utils/clientNameTransform'

import { MAIL_FORM_FIELDS, MailFormFields } from './Instruction.config'

export const getMailBody = (
  user: { firstName?: string; lastName?: string; middleName?: string } | undefined,
  vendorCode: string | undefined,
) =>
  MAIL_FORM_FIELDS.reduce((acc, cur) => {
    const newBody = acc ? `${acc}${cur}` : cur
    if (cur === MailFormFields.UserName) {
      return `${newBody} ${getFullName(user?.lastName, user?.firstName, user?.middleName)};\n`
    }

    if (cur === MailFormFields.DealershipNumber) {
      return `${newBody} ${vendorCode};\n`
    }

    return `${newBody}\n`
  }, '')
