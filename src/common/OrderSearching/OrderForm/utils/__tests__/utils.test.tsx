import { disableConsole } from 'tests/utils'

import { parseData, prepareData } from '../prepareData'
import { formData, initialData } from './utils.test.mock'

disableConsole('error')

describe('OrderForm.utils.test', () => {
  describe('Обработка входных данных работает корректно', () => {
    it('Корректная подготовка данных', () => {
      expect(prepareData(formData)).toEqual(initialData)
    })

    it('Корректный парсинг данных', () => {
      expect(parseData(initialData)).toEqual(formData)
    })
  })
})
