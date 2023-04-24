import React, { PropsWithChildren } from 'react'

import { Button } from '@mui/material'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MockStore } from 'redux-mock-store'

import { ThemeProviderMock } from 'tests/mocks'
import { disableConsole } from 'tests/utils'

import { SelectInput } from '../SelectInput'

interface WrapperProps extends PropsWithChildren {
  store?: MockStore
}

const createWrapper = ({ children }: WrapperProps) => <ThemeProviderMock>{children}</ThemeProviderMock>

disableConsole('error')

describe('SelectInputTest', () => {
  describe('SelectInput отображается корректно', () => {
    beforeEach(() => {
      render(
        <SelectInput
          placeholder="Тестовый placeholder"
          label="Тестовый select"
          options={['Первая', 'Вторая', 'Третья']}
        />,
        {
          wrapper: createWrapper,
        },
      )
    })

    it('Label для SelectInput отображается', () => {
      expect(screen.getByText('Тестовый select')).toBeInTheDocument()
    })

    it('Placeholder в SelectInput отображается', () => {
      expect(screen.getByText('Тестовый placeholder')).toBeInTheDocument()
    })
  })

  describe('SelectInput работает корректно', () => {
    beforeEach(() => {
      render(
        <SelectInput
          placeholder="Тестовый placeholder"
          label="Тестовый select"
          options={['Первая', 'Вторая', 'Третья']}
        />,
        {
          wrapper: createWrapper,
        },
      )
    })

    it('При нажатии на поле отображаются опции', async () => {
      userEvent.click(screen.getByText('Тестовый placeholder'))
      expect(await screen.findAllByRole('option')).toHaveLength(4)
    })

    it('Опция выбирается корректно', async () => {
      userEvent.click(screen.getByText('Тестовый placeholder'))
      const option = await screen.findByText('Первая')
      userEvent.click(option)
      expect(await screen.findByText('Первая')).toBeInTheDocument()
    })
  })

  describe('SelectInput валидируется', () => {
    beforeEach(() => {
      render(
        <SelectInput
          placeholder="Тестовый placeholder"
          label="Тестовый select"
          options={['Первая', 'Вторая', 'Третья']}
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
