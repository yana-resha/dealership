import { ApplicantDocsType, PhoneType } from '@sberauto/loanapplifecycledc-proto/public'

import { transformDocsForRequest } from '../transformDocsForRequest'
import { transformPhoneForRequest } from '../transformPhoneForRequest'
import { getCurrentWorkExperience } from '../getCurrentWorkExperience'

describe('утилиты анкеты клиента', () => {
  it('transformDocsForRequest работает корректно для водительского удостоверения', () => {
    const date = new Date('1999-01-31')
    expect(
      transformDocsForRequest(ApplicantDocsType.DRIVERLICENSE, '1111333333', date, '222', '1234'),
    ).toMatchObject({
      type: 15,
      series: '1111',
      number: '333333',
      issuedDate: '1999-01-31',
      issuedBy: '222',
      issuedCode: '1234',
    })
  })

  it('transformDocsForRequest работает корректно для снилс', () => {
    const date = new Date('1999-01-31')
    expect(
      transformDocsForRequest(ApplicantDocsType.PENSIONCERTIFICATE, '1111333333', date, '222', '1234'),
    ).toMatchObject({
      type: 18,
      number: '1111333333',
      issuedDate: '1999-01-31',
      issuedBy: '222',
      issuedCode: '1234',
    })
  })

  it('transformDocsForRequest работает корректно для загранпаспорта', () => {
    const date = new Date('1999-01-31')
    expect(
      transformDocsForRequest(
        ApplicantDocsType.INTERNATIONALPASSPORTFORRFCITIZENS,
        '111333333',
        date,
        '222',
        '1234',
      ),
    ).toMatchObject({
      type: 11,
      series: '11',
      number: '1333333',
      issuedDate: '1999-01-31',
      issuedBy: '222',
      issuedCode: '1234',
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

describe('getCurrentWorkExperience', () => {
  it('Если передать дату устройства больше чем дата создания заявки вернется 0', () => {
    const startDate = new Date('2024-07-31')
    const employmentDate = new Date('2024-08-05')
    expect(getCurrentWorkExperience(employmentDate, startDate)).toBe(0)
  })

  it('Если передать дату устройства менее месяца с даты создания заявки вернется 0', () => {
    const startDate = new Date('2024-07-31')
    const employmentDate = new Date('2024-07-02')
    expect(getCurrentWorkExperience(employmentDate, startDate)).toBe(0)
  })

  it('Если передать дату устройства более месяца с даты создания заявки вернется больше 0', () => {
    const startDate = new Date('2024-07-31')
    const employmentDate = new Date('2024-05-02')
    expect(getCurrentWorkExperience(employmentDate, startDate)).toBe(2)
  })

  it('Если передать дату устройсва на месяц ранее чем дата создания заявки, вернется 1', () => {
    const startDate = new Date('2024-02-29')
    const employmentDate = new Date('2024-01-31')
    expect(getCurrentWorkExperience(employmentDate, startDate)).toBe(1)
  })
})
