import { PropsWithChildren } from 'react'

import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { act } from 'react-dom/test-utils'

import { sleep } from 'shared/lib/sleep'
import { ThemeProviderMock } from 'tests/mocks'
import { disableConsole } from 'tests/utils'

import { OrderForm } from '../OrderForm'
import { formFields } from './OrderForm.test.mock'

const createWrapper = ({ children }: PropsWithChildren) => <ThemeProviderMock>{children}</ThemeProviderMock>

disableConsole('error')

describe('OrderFormTest', () => {
  const onSubmit = jest.fn()
  describe('Форма отображается корректно', () => {
    describe('Форма поиска заявки', () => {
      beforeEach(() => {
        render(<OrderForm onSubmit={onSubmit} />, { wrapper: createWrapper })
      })
      it('Заголовок корректный', () => {
        expect(screen.getByText('Поиск заявки')).toBeInTheDocument()
      })
      for (const fieldName of formFields) {
        it(`Поле "${fieldName}" присутствует на форме`, () => {
          expect(screen.getByText(`${fieldName}`)).toBeInTheDocument()
        })
      }
      it('Текст кнопки корректный', () => {
        expect(screen.getByText('Отправить')).toBeInTheDocument()
      })
    })

    describe('Форма новой заявки', () => {
      beforeEach(() => {
        render(<OrderForm onSubmit={onSubmit} isNewOrder />, { wrapper: createWrapper })
      })
      it('Заголовок корректный', () => {
        expect(screen.getByText('Заявки нет в системе')).toBeInTheDocument()
      })
      for (const fieldName of formFields) {
        it(`Поле "${fieldName}" присутствует на форме`, () => {
          expect(screen.getByText(`${fieldName}`)).toBeInTheDocument()
        })
      }
      it('Текст кнопки корректный', () => {
        expect(screen.getByText('Создать заявку')).toBeInTheDocument()
      })
    })
  })

  describe('Валидация формы работает корректно', () => {
    beforeEach(() => {
      render(<OrderForm onSubmit={onSubmit} />, { wrapper: createWrapper })
      userEvent.click(screen.getByText('Отправить'))
    })

    it('Валидируются серия и номер паспорта', async () => {
      userEvent.type(screen.getByText('Серия и номер паспорта'), '123')
      expect(await screen.findByText('Введите данные полностью')).toBeInTheDocument()
    })

    it('Валидируется ФИО', async () => {
      userEvent.type(screen.getByText('ФИО'), 'Тест')
      expect(await screen.findByText('Введите корректное ФИО')).toBeInTheDocument()
    })

    it('Валидируется дата рождения', async () => {
      const inputBirthDate = document.getElementById('birthDate')!
      fireEvent.focus(inputBirthDate)
      userEvent.type(inputBirthDate, '10101900')
      expect(await screen.findByText('Превышен максимальный возраст')).toBeInTheDocument()
      userEvent.type(inputBirthDate, '10102090')
      expect(await screen.findByText('Минимальный возраст 21 год')).toBeInTheDocument()
    })

    it('Валидируется номер телефона', async () => {
      userEvent.type(screen.getByText('Телефон'), '00')
      expect(await screen.findByText('Введите номер полностью')).toBeInTheDocument()
    })
  })

  describe('Валидация обязательных полей работает корректно', () => {
    beforeEach(() => {
      render(<OrderForm onSubmit={onSubmit} />, { wrapper: createWrapper })
      userEvent.click(screen.getByText('Отправить'))
    })

    it('Валидируется верное количество обязательных полей', async () => {
      expect(await screen.findAllByText('Заполните одно поле или более из оставшихся')).toHaveLength(4)
    })

    it('Заполнения паспорта достаточно для отправки формы', async () => {
      userEvent.type(screen.getByText('Серия и номер паспорта'), '1234123123')
      await act(async () => await sleep(0))
      expect(screen.queryByText('Заполните одно поле или более из оставшихся')).not.toBeInTheDocument()
    })

    it('Заполнения ФИО и Даты достаточно для отправки формы', async () => {
      userEvent.type(screen.getByText('ФИО'), 'Тест Тест Тест')
      const inputBirthDate = document.getElementById('birthDate')!
      userEvent.type(inputBirthDate, '10101990')
      await act(async () => await sleep(0))
      expect(screen.queryByText('Заполните одно поле или более из оставшихся')).not.toBeInTheDocument()
    })

    it('Заполнения ФИО и Телефона достаточно для отправки формы', async () => {
      userEvent.type(screen.getByText('ФИО'), 'Тест Тест Тест')
      userEvent.type(screen.getByText('Телефон'), '001231234')
      await act(async () => await sleep(0))
      expect(screen.queryByText('Заполните одно поле или более из оставшихся')).not.toBeInTheDocument()
    })

    it('Заполнения Даты и Телефона достаточно для отправки формы', async () => {
      const inputBirthDate = document.getElementById('birthDate')!
      userEvent.type(inputBirthDate, '10101990')
      userEvent.type(screen.getByText('Телефон'), '001231234')
      await act(async () => await sleep(0))
      expect(screen.queryByText('Заполните одно поле или более из оставшихся')).not.toBeInTheDocument()
    })
  })
})
