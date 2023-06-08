import { convertedDateToString } from '../dateTransform'

describe('convertedDateToString', () => {
  it('Дата конвертируется в верный формат', () => {
    const date = new Date('1999-01-31')

    expect(convertedDateToString(date)).toBe('1999-01-31')
  })
})
