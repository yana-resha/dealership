import React, { PropsWithChildren } from 'react'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MockStore } from 'redux-mock-store'

import { StoreProviderMock, ThemeProviderMock, formFields } from 'tests/mocks'
import { disableConsole } from 'tests/utils'

import { ClientForm } from '../ClientForm'

interface WrapperProps extends PropsWithChildren {
  store?: MockStore
}

const createWrapper = ({ store, children }: WrapperProps) => (
  <StoreProviderMock mockStore={store}>
    <ThemeProviderMock>{children}</ThemeProviderMock>
  </StoreProviderMock>
)

disableConsole('error')

describe('ClientFormTest', () => {
  describe('Форма отображается корректно', () => {
    beforeEach(() => {
      render(<ClientForm />, { wrapper: createWrapper })
    })

    for (const fieldName of formFields) {
      it(`Поле "${fieldName}" присутствует на форме`, () => {
        expect(screen.getByText(`${fieldName}`)).toBeInTheDocument()
      })
    }

    it('Поле "Предыдущее ФИО" отсутствует на форме', () => {
      expect(screen.queryByText('Предыдущее ФИО')).not.toBeInTheDocument()
    })

    it('Поле "Кем выдан" для документов присутствует на форме 2 раза', () => {
      expect(screen.getAllByText('Кем выдан')).toHaveLength(2)
    })

    it('Поле "Не КЛАДР" присутствует на форме два раза', () => {
      expect(screen.getAllByText('Не КЛАДР')).toHaveLength(2)
    })
  })

  describe('Валидации на форме работают корректно', () => {
    beforeEach(() => {
      render(<ClientForm />, { wrapper: createWrapper })
      userEvent.click(screen.getByText('Отправить'))
    })

    it('Валидируется верное количество обязательных полей', async () => {
      expect(await screen.findAllByText('Поле обязательно для заполнения')).toHaveLength(26)
    })

    it('Валидируется распечатка анкеты', async () => {
      expect(await screen.findByText('Необходимо подписать анкету')).toBeInTheDocument()
    })

    it('Валидируется ФИО', async () => {
      userEvent.type(screen.getByText('ФИО'), 'Тест')
      expect(await screen.findByText('Введите корректное ФИО')).toBeInTheDocument()
    })

    it('Валидируются серия и номер паспорта', async () => {
      userEvent.type(screen.getByText('Серия и номер паспорта'), '123')
      expect(await screen.findByText('Введите данные полностью')).toBeInTheDocument()
    })

    it('Валидируется код подразделения', async () => {
      userEvent.type(screen.getByText('Код подразделения'), '123')
      expect(await screen.findByText('Введите данные полностью')).toBeInTheDocument()
    })

    it('Валидируется номер телефона', async () => {
      userEvent.type(screen.getByText('Телефон'), '00')
      expect(await screen.findByText('Введите номер полностью')).toBeInTheDocument()
    })

    it('Валидируется Email', async () => {
      userEvent.type(screen.getByText('Email'), 'test')
      expect(await screen.findByText('Введите корретный Email')).toBeInTheDocument()
    })
  })

  describe('Валидация дат работает корректно', () => {
    beforeEach(() => {
      render(<ClientForm />, { wrapper: createWrapper })
      userEvent.click(screen.getByText('Отправить'))
    })

    it('Валидируется дата рождения', async () => {
      const inputBirthDate = document.getElementById('birthDate')!
      userEvent.type(inputBirthDate, '10101900')
      expect(await screen.findByText('Превышен максимальный возраст')).toBeInTheDocument()
      userEvent.type(inputBirthDate, '10102090')
      expect(await screen.findByText('Минимальный возраст 21 год')).toBeInTheDocument()
    })

    it('Валидируется дата выдачи паспорта', async () => {
      const inputPassportDate = document.getElementById('passportDate')!
      userEvent.type(inputPassportDate, '10101900')
      expect(await screen.findByText('Дата слишком ранняя')).toBeInTheDocument()
    })

    it('Валидируется даты выдачи второго документа', async () => {
      const inputSecondDocumentDate = document.getElementById('secondDocumentDate')!
      userEvent.type(inputSecondDocumentDate, '10101900')
      expect(await screen.findByText('Дата слишком ранняя')).toBeInTheDocument()
    })

    it('Валидируется даты устройства на работу', async () => {
      const inputEmploymentDate = document.getElementById('employmentDate')!
      userEvent.type(inputEmploymentDate, '10101900')
      expect(await screen.findByText('Дата слишком ранняя')).toBeInTheDocument()
    })
  })
})
