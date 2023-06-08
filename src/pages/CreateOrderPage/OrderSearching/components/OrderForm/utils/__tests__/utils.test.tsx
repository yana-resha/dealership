import { disableConsole } from 'tests/utils'

import { parseData, prepareData } from '../prepareData'
import { formData1, initialData1, formData2, initialData2 } from './utils.test.mock'

disableConsole('error')

describe('OrderForm.utils.test', () => {
  describe('Обработка входных данных работает корректно', () => {
    it('Корректная подготовка данных', () => {
      expect(prepareData(formData1)).toEqual(initialData1)
    })

    it('Корректный парсинг данных', () => {
      expect(parseData(initialData2)).toEqual(formData2)
    })
  })
})
