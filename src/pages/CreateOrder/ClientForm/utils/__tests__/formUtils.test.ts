import { ApplicantDocsType, PhoneType } from '@sberauto/loanapplifecycledc-proto/public'

import { prepareAddress } from '../prepareAddress'
import { transformDocsForRequest } from '../transformDocsForRequest'
import { transformPhoneForRequest } from '../transformPhoneForRequest'

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

  it('prepareAddress работает корректно', () => {
    expect(
      prepareAddress({
        postalCode: '108813',
        regionKladrId: '770000000000',
        area: 'Московский',
        areaTypeFull: 'поселение',
        city: 'Московский',
        cityTypeFull: 'город',
        house: '',
        block: '',
        region: 'Москва',
        settlement: '',
        settlementTypeFull: '',
        street: 'Хабарова',
        streetTypeFull: 'улица',
        flat: '',
      }),
    ).toMatchObject({
      postalCode: '108813',
      regCode: '77',
      area: 'Московский',
      areaType: '201',
      city: 'Московский',
      cityType: '301',
      house: '',
      houseExt: '',
      region: 'Москва',
      settlement: '',
      settlementType: '',
      street: 'Хабарова',
      streetType: '529',
      unitNum: '',
    })
  })

  it('prepareAddress работает корректно с пустыми значениями', () => {
    expect(prepareAddress({})).toMatchObject({
      postalCode: '',
      regCode: '',
      area: '',
      areaType: '',
      city: '',
      cityType: '',
      house: '',
      houseExt: '',
      region: '',
      settlement: '',
      settlementType: '',
      street: '',
      streetType: '',
      unitNum: '',
    })
  })
})
