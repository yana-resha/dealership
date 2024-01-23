import { act, renderHook } from '@testing-library/react'

import { disableConsole } from 'tests/utils'

import { getFieldErrorNames } from '../useScrollToErrorField'
import { DATA, EXPECTED_DATA } from './getFieldErrorNames.mock'

disableConsole('error')

describe('getFieldErrorNames', () => {
  it('Работает добавление элементов в массив, удаление, очистка', () => {
    expect(getFieldErrorNames(DATA)).toEqual(EXPECTED_DATA)
  })
})
