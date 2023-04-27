import React, { PropsWithChildren } from 'react'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MockStore } from 'redux-mock-store'
import * as Yup from 'yup'

import { maskPhoneNumber } from 'shared/masks/InputMasks'
import { ThemeProviderMock } from 'tests/mocks'
import { disableConsole } from 'tests/utils'

import { MaskedInput } from '../MaskedInput'

interface WrapperProps extends PropsWithChildren {
  store?: MockStore
}

const createWrapper = ({ children }: WrapperProps) => <ThemeProviderMock>{children}</ThemeProviderMock>

disableConsole('error')

describe('MaskedInputTest', () => {
  describe('MaskedInput отображается корректно', () => {
    beforeEach(() => {
      render(
        <MaskedInput
          placeholder="Тестовый плейсхолдер"
          label="Тестовое поле с маской"
          mask={maskPhoneNumber}
        />,
        {
          wrapper: createWrapper,
        },
      )
    })

    it('Label для MaskedInput отображается', () => {
      expect(screen.getByText('Тестовое поле с маской')).toBeInTheDocument()
    })

    it('Placeholder в MaskedInput отображается', () => {
      expect(screen.getByPlaceholderText('Тестовый плейсхолдер')).toBeInTheDocument()
    })
  })

  describe('MaskedInput работает корректно', () => {
    beforeEach(() => {
      render(
        <MaskedInput
          placeholder="Тестовый плейсхолдер"
          label="Тестовое поле с маской"
          mask={maskPhoneNumber}
        />,
        {
          wrapper: createWrapper,
        },
      )
    })

    it('Текст не вводится, если он не соответствует маске', () => {
      userEvent.type(screen.getByRole('textbox'), 'qwerty')
      expect(screen.getByRole('textbox')).toHaveValue('')
    })

    it('Текст вводится, если он соответствует маске', () => {
      userEvent.type(screen.getByRole('textbox'), '001234567')
      expect(screen.getByRole('textbox')).toHaveValue('8-900-123-45-67')
    })
  })

  describe('MaskedInput обновляет значение формы', () => {
    const mockedSetFieldValue = jest.fn()

    beforeEach(() => {
      render(
        <MaskedInput
          onChange={mockedSetFieldValue}
          placeholder="Тестовый плейсхолдер"
          label="Тестовое поле с маской"
          mask={maskPhoneNumber}
        />,
        {
          wrapper: createWrapper,
        },
      )
    })

    it('При вводе текста в MaskedInput вызывается setFieldValue', () => {
      userEvent.type(screen.getByRole('textbox'), '001234567')
      expect(mockedSetFieldValue).toBeCalledTimes(9)
    })
  })

  describe('MaskedInput валидируется', () => {
    beforeEach(() => {
      render(
        <MaskedInput
          placeholder="Тестовый плейсхолдер"
          label="Тестовое поле с маской"
          mask={maskPhoneNumber}
          isError={true}
          errorMessage="Поле обязательно для заполнения"
        />,
        {
          wrapper: createWrapper,
        },
      )
    })

    it('Отображается сообщение об ошибке', () => {
      expect(screen.getByText('Поле обязательно для заполнения')).toBeInTheDocument()
    })
  })
})