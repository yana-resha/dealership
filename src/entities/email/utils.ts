import { EmailStatusCode } from '@sberauto/emailappdc-proto/public'

import { EmailStatus } from './config'

const EmailStatusMap = {
  [EmailStatusCode.INITIAL]: EmailStatus.INITIAL,
  [EmailStatusCode.PROCESSED]: EmailStatus.PROCESSED,
  [EmailStatusCode.ANSWERED]: EmailStatus.ANSWERED,
  default: EmailStatus.INITIAL,
}

export const getEmailStatus = (status: EmailStatusCode | null | undefined) =>
  EmailStatusMap[status ?? ('' as unknown as EmailStatusCode)] ?? EmailStatusMap.default
