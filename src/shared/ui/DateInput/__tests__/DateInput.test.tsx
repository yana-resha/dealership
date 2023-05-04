import React, { PropsWithChildren } from 'react'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MockStore } from 'redux-mock-store'

import { ThemeProviderMock } from 'tests/mocks'
import { disableConsole } from 'tests/utils'

import { DateInput } from '../DateInput'

const createWrapper = ({ children }: PropsWithChildren) => <ThemeProviderMock>{children}</ThemeProviderMock>

disableConsole('error')

describe('DateInputTest', () => {
  describe('DateInput отображается', () => {
    beforeEach(() => {
      render(<DateInput label="Тестовая дата" />, { wrapper: createWrapper })
    })

    it('Label для DateInput отображается', () => {
      expect(screen.getByText('Тестовая дата')).toBeInTheDocument()
    })

    it('Placeholder использует кириллицу', () => {
      expect(screen.getByPlaceholderText('ДД.ММ.ГГГГ')).toBeInTheDocument()
    })
  })

  describe('DateInput работает корректно', () => {
    beforeEach(() => {
      render(<DateInput label="Тестовая дата" />, { wrapper: createWrapper })
    })

    it('Value использует кириллицу', () => {
      userEvent.type(screen.getByRole('textbox'), '1010')
      expect(screen.getByDisplayValue(/ГГГГ/)).toBeInTheDocument()
    })

    it('При нажатии на иконку открывается календарь', () => {
      userEvent.click(screen.getAllByRole('button')[0])
      expect(screen.getByTestId('sentinelStart')).toBeInTheDocument()
      expect(screen.getByTestId('sentinelEnd')).toBeInTheDocument()
    })
  })

  describe('DateInput валидируется', () => {
    beforeEach(() => {
      render(
        <DateInput isError={true} errorMessage="Поле обязательно для заполнения" label="Тестовая дата" />,
        { wrapper: createWrapper },
      )
    })

    it('Отображается сообщение об ошибке', () => {
      expect(screen.getByText('Поле обязательно для заполнения')).toBeInTheDocument()
    })
  })
})
