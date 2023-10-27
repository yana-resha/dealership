import { DocumentFrontdc } from '@sberauto/loanapplifecycledc-proto/public'
import { ApplicantDocsType } from '@sberauto/loanapplifecycledc-proto/public'

import { convertedDateToString } from 'shared/utils/dateTransform'

export const transformDocsForRequest = (
  type: number | null,
  docNumber: string,
  issuedDate: Date | null,
  issuedBy: string,
  issuedCode: string,
): DocumentFrontdc => {
  let series
  let number

  switch (type) {
    case ApplicantDocsType.PASSPORT: {
      series = docNumber.slice(0, 4)
      number = docNumber.slice(-6)
      break
    }
    case ApplicantDocsType.DRIVERLICENSE: {
      series = docNumber.slice(0, 4)
      number = docNumber.slice(-6)
      break
    }
    case ApplicantDocsType.PENSIONCERTIFICATE: {
      number = docNumber
      break
    }
    case ApplicantDocsType.INTERNATIONALPASSPORTFORRFCITIZENS: {
      series = docNumber.slice(0, 2)
      number = docNumber.slice(-7)
      break
    }
    default: {
      number = docNumber
    }
  }

  const result = {
    type: type ? type : undefined,
    series,
    number,
    issuedDate: convertedDateToString(issuedDate),
    issuedBy: issuedBy || undefined,
    issuedCode: issuedCode || undefined,
  }

  return result
}
