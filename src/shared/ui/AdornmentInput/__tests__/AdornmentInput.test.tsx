import React, { PropsWithChildren } from 'react'

import { IconButton, InputAdornment } from '@mui/material'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { maskMobilePhoneNumber } from 'shared/masks/InputMasks'
import { ThemeProviderMock } from 'tests/mocks'
import { disableConsole } from 'tests/utils'

import { AdornmentInput } from '../AdornmentInput'

const createWrapper = ({ children }: PropsWithChildren) => <ThemeProviderMock>{children}</ThemeProviderMock>

disableConsole('error')

describe('AdornmentInput', () => {
  describe('AdornmentInput отображается корректно', () => {
    beforeEach(() => {
      render(
        <AdornmentInput
          placeholder="Тестовый плейсхолдер"
          label="Тестовое поле с маской"
          mask={maskMobilePhoneNumber}
          endAdornment={<div data-testid="adornmentIcon" />}
        />,
        {
          wrapper: createWrapper,
        },
      )
    })

    it('Label для AdornmentInput отображается', () => {
      expect(screen.getByText('Тестовое поле с маской')).toBeInTheDocument()
    })

    it('Placeholder в AdornmentInput отображается', () => {
      expect(screen.getByPlaceholderText('Тестовый плейсхолдер')).toBeInTheDocument()
    })

    it('Отображается иконка', () => {
      expect(screen.getByTestId('adornmentIcon')).toBeInTheDocument()
    })
  })

  describe('AdornmentInput работает корректно', () => {
    beforeEach(() => {
      render(
        <AdornmentInput
          placeholder="Тестовый плейсхолдер"
          label="Тестовое поле с маской"
          mask={maskMobilePhoneNumber}
        />,
        {
          wrapper: createWrapper,
        },
      )
    })

    it('Текст не вводится, если он не соответствует маске', () => {
      userEvent.type(screen.getByRole('textbox'), 'qwerty')
      expect(screen.getByRole('textbox')).toHaveValue('+7 9')
    })

    it('Текст вводится, если он соответствует маске', () => {
      userEvent.type(screen.getByRole('textbox'), '001234567')
      expect(screen.getByRole('textbox')).toHaveValue('+7 900 123 45 67')
    })
  })

  describe('AdornmentInput обновляет значение формы', () => {
    const mockedSetFieldValue = jest.fn()

    beforeEach(() => {
      render(
        <AdornmentInput
          onChange={mockedSetFieldValue}
          placeholder="Тестовый плейсхолдер"
          label="Тестовое поле с маской"
          mask={maskMobilePhoneNumber}
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

  describe('AdornmentInput валидируется', () => {
    beforeEach(() => {
      render(
        <AdornmentInput
          placeholder="Тестовый плейсхолдер"
          label="Тестовое поле с маской"
          mask={maskMobilePhoneNumber}
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
