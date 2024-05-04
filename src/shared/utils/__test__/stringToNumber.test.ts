import { stringToNumber } from '../stringToNumber'

describe('stringToNumber', () => {
  it('Работает корректно', () => {
    expect(stringToNumber('1')).toBe(1)
    expect(stringToNumber('ф')).toBe(undefined)
    expect(stringToNumber('fdsfs')).toBe(undefined)
    expect(stringToNumber('1 000')).toBe(1000)
    expect(stringToNumber('fdsfs апапп')).toBe(undefined)
    expect(stringToNumber('1 000.46')).toBe(1000.46)
    expect(stringToNumber('0')).toBe(0)
    expect(stringToNumber('')).toBe(undefined)
  })
})
