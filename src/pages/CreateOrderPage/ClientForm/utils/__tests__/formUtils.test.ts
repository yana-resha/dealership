import { ApplicantDocsType, PhoneType } from '@sberauto/loanapplifecycledc-proto/public'

import { transformDocsForRequest } from '../transformDocsForRequest'
import { transformPhoneForRequest } from '../transformPhoneForRequest'

describe('утилиты анкеты клиента', () => {
  it('transformDocsForRequest работает корректно для водительского удостоверения', () => {
    const date = new Date('1999-01-31')
    expect(transformDocsForRequest(ApplicantDocsType.DRIVERLICENSE, '1111333333', date, '222')).toMatchObject(
      {
        type: 15,
        series: '1111',
        number: '333333',
        issuedBy: '222',
        issuedDate: '1999-01-31',
      },
    )
  })

  it('transformDocsForRequest работает корректно для снилс', () => {
    const date = new Date('1999-01-31')
    expect(
      transformDocsForRequest(ApplicantDocsType.PENSIONCERTIFICATE, '1111333333', date, '222'),
    ).toMatchObject({
      type: 18,
      number: '1111333333',
      issuedBy: '222',
      issuedDate: '1999-01-31',
    })
  })

  it('transformDocsForRequest работает корректно для загранпаспорта', () => {
    const date = new Date('1999-01-31')
    expect(
      transformDocsForRequest(ApplicantDocsType.INTERNATIONALPASSPORTFORRFCITIZENS, '111333333', date, '222'),
    ).toMatchObject({
      type: 11,
      series: '11',
      number: '1333333',
      issuedBy: '222',
      issuedDate: '1999-01-31',
    })
  })

  it('transformPhoneForRequest работает корректно', () => {
    expect(transformPhoneForRequest('89998887766', PhoneType.MOBILE)).toMatchObject({
      type: 1,
      countryPrefix: '7',
      prefix: '999',
      number: '8887766',
    })
  })
})
