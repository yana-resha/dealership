import { disableConsole } from 'tests/utils'

import { getPercentFromValue, getValueFromPercent } from '../useInitialPayment'

disableConsole('error')

describe('useInitialPayment', () => {
  describe('getPercentFromValue', () => {
    it('Если значение больше 100 то возвращаем пустую строку', () => {
      expect(getPercentFromValue('100', '77')).toEqual('')
    })

    it('Если аргументы невалидны то возвращаем пустую строку', () => {
      expect(getPercentFromValue('', '77')).toEqual('')
      expect(getPercentFromValue('undefined', '77')).toEqual('')
      expect(getPercentFromValue('100', 'null')).toEqual('')
      expect(getPercentFromValue('100', '0')).toEqual('')
    })

    it('Результат округляется до сотых', () => {
      expect(getPercentFromValue('13', '77')).toEqual('16.88')
    })
  })

  describe('getValueFromPercent', () => {
    it('Если аргументы невалидны то возвращаем пустую строку', () => {
      expect(getValueFromPercent('', '77')).toEqual('')
      expect(getValueFromPercent('undefined', '77')).toEqual('')
      expect(getValueFromPercent('100', 'null')).toEqual('')
    })
    it('Результат округляется до целых', () => {
      expect(getValueFromPercent('13', '77')).toEqual('10')
    })
  })
})
