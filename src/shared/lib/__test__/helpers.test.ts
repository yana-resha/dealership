import {
  addSuffix,
  checkIsNumber,
  exhaustiveCheck,
  filterDigitsFromString,
  getLocaleStringFromNumeric,
  removeSpaces,
} from 'shared/lib/helpers'

import { transformAddress } from '../utils'

describe('helpers tests', () => {
  describe('filterDigitsFromString', () => {
    it('Строка содержит буквенные символы, пробелы, цифры и знак -> возвращаются только цифры (все)', () => {
      expect(filterDigitsFromString('Новый 2022 год наступает,2023приходит')).toBe('20222023')
    })
    it('Строка не содержит цифр -> возвращается пустая строка', () => {
      expect(filterDigitsFromString('Новый год наступает,приходит')).toBe('')
    })
    it('Пустая строка -> возвращается пустая строка', () => {
      expect(filterDigitsFromString('Новый год наступает,приходит')).toBe('')
    })
    it('Строка только из цифр -> возвращается та же строка', () => {
      expect(filterDigitsFromString('2022111939')).toBe('2022111939')
    })
  })

  describe('getLocaleStringFromNumeric', () => {
    it('Строка содержит различные символы -> возвращается строка с числом с неразрывными пробелами между разрядами', () => {
      expect(getLocaleStringFromNumeric('Хочу зп 1000000')).toBe('1\u00A0000\u00A0000')
    })
    it('Строка содержит различные символы -> для выделения разрядов не используется обычный пробел', () => {
      expect(getLocaleStringFromNumeric('Хочу зп 1000000')).not.toBe('1 000 000')
    })
    it('Строка содержит только число -> возвращается строка с числом в локализованном формате', () => {
      expect(getLocaleStringFromNumeric('1000000')).toBe('1\u00A0000\u00A0000')
    })
    it('Число -> возвращается строка с числом в локализованном формате', () => {
      expect(getLocaleStringFromNumeric(1000000)).toBe('1\u00A0000\u00A0000')
    })
    it('Строка не содержит цифр -> возвращается пустая строка', () => {
      expect(getLocaleStringFromNumeric('Много букв и нет number')).toBe('')
    })
    it('Boolean -> возвращается пустая строка', () => {
      // @ts-expect-error
      expect(getLocaleStringFromNumeric(true)).toBe('')
    })
  })

  describe('exhaustiveCheck', () => {
    it('Возвращается тоже значение что и принимается', () => {
      // @ts-expect-error
      expect(exhaustiveCheck('test')).toBe('test')
      // @ts-expect-error
      expect(exhaustiveCheck(34)).toBe(34)
      // @ts-expect-error
      expect(exhaustiveCheck(true)).toBe(true)
      // @ts-expect-error
      expect(exhaustiveCheck(undefined)).toBe(undefined)
    })
  })

  describe('addSuffix', () => {
    it('Функция принимает строку в качестве значения, строку в качестве окончания -> возвращается корректная строка', () => {
      const initialValue = 'Строка'
      const suffix = 'Окончание строки'
      const expectedValue = 'Строка Окончание строки'

      expect(addSuffix(initialValue, suffix)).toBe(expectedValue)
    })

    it('Функция принимает число в качестве значения, строку в качестве окончания -> возвращается корректная строка', () => {
      const initialValue = 1234
      const suffix = 'Окончание строки'
      const expectedValue = '1234 Окончание строки'

      expect(addSuffix(initialValue, suffix)).toBe(expectedValue)
    })

    it('Функция принимает 0 в качестве значения, строку в качестве окончания -> возвращается корректная строка', () => {
      const initialValue = 0
      const suffix = 'Окончание строки'
      const expectedValue = '0 Окончание строки'

      expect(addSuffix(initialValue, suffix)).toBe(expectedValue)
    })

    it('Функция принимает true третьим аргументом -> значение от суффикса отделяется неразрывным пробелом', () => {
      const initialValue = 'Строка'
      const suffix = 'Окончание строки'
      const expectedValue = 'Строка\u00A0Окончание строки'

      expect(addSuffix(initialValue, suffix, true)).toBe(expectedValue)
    })

    it('Функция принимает false третьим аргументом -> значение от суффикса отделяется обычным пробелом', () => {
      const initialValue = 'Строка'
      const suffix = 'Окончание строки'
      const expectedValue = 'Строка Окончание строки'

      expect(addSuffix(initialValue, suffix, false)).toBe(expectedValue)
    })
  })

  describe('removeSpaces', () => {
    it('Функция принимает строку с одинарными пробелами в качестве значения -> возвращается строка без пробелов', () => {
      const initialValue = 'Строка С Пробелами'
      const expectedValue = 'СтрокаСПробелами'

      expect(removeSpaces(initialValue)).toBe(expectedValue)
    })

    it('Функция принимает строку с множественными пробелами в качестве значения -> возвращается строка без пробелов', () => {
      const initialValue = 'Строка   С    Пробелами'
      const expectedValue = 'СтрокаСПробелами'

      expect(removeSpaces(initialValue)).toBe(expectedValue)
    })

    it('Функция принимает строку с пробелами в начале и в конце -> возвращается строка без пробелов', () => {
      const initialValue = ' СтрокаСПробелами      '
      const expectedValue = 'СтрокаСПробелами'

      expect(removeSpaces(initialValue)).toBe(expectedValue)
    })
  })

  describe('checkIsNumber', () => {
    it('checkIsNumber работает корректно', () => {
      expect(checkIsNumber({})).toBe(false)
      expect(checkIsNumber(NaN)).toBe(false)
      expect(checkIsNumber(0)).toBe(true)
      expect(checkIsNumber(1.1)).toBe(true)
      expect(checkIsNumber('1')).toBe(false)
      expect(checkIsNumber('0')).toBe(false)
      expect(checkIsNumber('')).toBe(false)
    })
  })

  describe('transformAddress', () => {
    it('Если строка менее 6 символов, то вернется та же строка', () => {
      expect(transformAddress('улица')).toBe('улица')
    })

    it('Если 6-значное число не имеет разделителя с буквами, то это не индекс и верезан он не будет', () => {
      expect(transformAddress('г. Воронеж, ул. 394065Проспект Патриотов,47')).toBe(
        'г. Воронеж, ул. 394065Проспект Патриотов, 47',
      )
    })

    it('Если в строке есть 6-значное число и оно имеет разделитель, то это индекс и он будет вырезан из строки', () => {
      expect(transformAddress('394065, г. Воронеж, ул. Проспект Патриотов,47')).toBe(
        'г. Воронеж, ул. Проспект Патриотов, 47',
      )
      expect(transformAddress('г. Воронеж, ул. Проспект Патриотов,47, 394065')).toBe(
        'г. Воронеж, ул. Проспект Патриотов, 47',
      )

      expect(transformAddress('г. Воронеж, 394065 ул. Проспект Патриотов,47')).toBe(
        'г. Воронеж, ул. Проспект Патриотов, 47',
      )
    })

    it('Если в строке есть 5-значное число или 7-значное число то это не индекс, и вырезано оно не будет', () => {
      expect(transformAddress('3940659, г. Воронеж, ул. Проспект Патриотов,47')).toBe(
        '3940659, г. Воронеж, ул. Проспект Патриотов, 47',
      )
      expect(transformAddress('г. Воронеж, ул. Проспект Патриотов,47, 94065')).toBe(
        'г. Воронеж, ул. Проспект Патриотов, 47, 94065',
      )

      expect(transformAddress('г. Воронеж, 3940650 ул. Проспект Патриотов,47')).toBe(
        'г. Воронеж, 3940650 ул. Проспект Патриотов, 47',
      )
    })
  })
})
