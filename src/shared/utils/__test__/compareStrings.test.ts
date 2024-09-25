import { disableConsole } from 'tests/utils'

import { compareStrings } from '../compareStrings'

disableConsole('error')

const MOCKED_CAR_BRANDS = ['F111', 'FN', 'fn', 'F12F', 'EN', 'FN1', 'F11', 'F2', 'F12D', '23']
const EXPECTED_SORTED_CAR_BRANDS = ['EN', 'F2', 'F11', 'F12D', 'F12F', 'F111', 'FN', 'fn', 'FN1', '23']
describe('compareStrings', () => {
  it('Сортировка работает корректно', () => {
    expect(MOCKED_CAR_BRANDS.sort(compareStrings)).toEqual(EXPECTED_SORTED_CAR_BRANDS)
  })
  it('Сортировка игнорирует спец. символы', () => {
    const data = ['"Комфорт Плюс": без Каско', 'Комфорт Плaс: без Каско']
    const expected = ['Комфорт Плaс: без Каско', '"Комфорт Плюс": без Каско']
    expect(data.sort(compareStrings)).toEqual(expected)
  })
})
