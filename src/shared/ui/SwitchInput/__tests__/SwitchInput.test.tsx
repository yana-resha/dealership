import React, { PropsWithChildren } from 'react'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { ThemeProviderMock } from 'tests/mocks'
import { disableConsole } from 'tests/utils'

import { SwitchInput } from '../SwitchInput'

const createWrapper = ({ children }: PropsWithChildren) => <ThemeProviderMock>{children}</ThemeProviderMock>

disableConsole('error')

describe('SwitchInputTest', () => {
  describe('SwitchInput отображается корректно', () => {
    beforeEach(() => {
      render(<SwitchInput label="Тестовый switch" />, {
        wrapper: createWrapper,
      })
    })

    it('Label для SwitchInput отображается', () => {
      expect(screen.getByText('Тестовый switch')).toBeInTheDocument()
    })
  })

  describe('SwitchInput обновляет значение формы', () => {
    const mockedOnChange = jest.fn()

    beforeEach(() => {
      render(<SwitchInput label="Тестовый switch" onChange={mockedOnChange} id="test" />, {
        wrapper: createWrapper,
      })
    })

    it('При клике по SwitchInput вызывается onChange', () => {
      userEvent.click(screen.getByText('Тестовый switch'))
      expect(mockedOnChange).toBeCalledTimes(1)
    })
  })

  describe('SwitchInput валидируется', () => {
    beforeEach(() => {
      render(<SwitchInput label="Тестовый switch" isError={true} errorMessage="Необходимо подтверждение" />, {
        wrapper: createWrapper,
      })
    })

    it('Отображается сообщение об ошибке', () => {
      expect(screen.getByText('Необходимо подтверждение')).toBeInTheDocument()
    })
  })
})
