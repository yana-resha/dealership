import React, { PropsWithChildren } from 'react'

import { render, screen } from '@testing-library/react'
import { MockStore } from 'redux-mock-store'

import { StoreProviderMock, ThemeProviderMock, formFields } from 'tests/mocks'
import { disableConsole } from 'tests/utils'

import { ClientForm } from '../ClientForm'

jest.mock('../../DownloadClientDocs/DownloadClientDocs', () => ({
  DownloadClientDocs: () => <div data-testid="downloadCreditDocs" />,
}))
jest.mock('shared/ui/DateInput/DateInput', () => ({
  DateInput: ({ label }: any) => <span>{label}</span>,
}))
jest.mock('shared/ui/SwitchInput/SwitchInput', () => ({
  SwitchInput: ({ label }: any) => <span>{label}</span>,
}))
jest.mock('shared/ui/MaskedInput/MaskedInput', () => ({
  MaskedInput: ({ label }: any) => <span>{label}</span>,
}))
jest.mock('shared/ui/SelectInput/SelectInput', () => ({
  SelectInput: ({ label }: any) => <span>{label}</span>,
}))

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
    test.todo(
      'Включить тестирование валидаций после выполнения задачи DCB-140 (Рефакторинг shared элементов формы)',
    )
    //   beforeEach(() => {
    //     render(<ClientForm />, { wrapper: createWrapper })
    //     userEvent.click(screen.getByText('Отправить'))
    //   })
    //
    //   it('Валидируется верное количество обязательных полей', async () => {
    //     render(<ClientForm />, { wrapper: createWrapper })
    //   })
    //
    //   it('Валидируется даты выдачи второго документа', async () => {
    //     const inputSecondDocumentDate = document.getElementById('secondDocumentDate')!
    //     userEvent.type(inputSecondDocumentDate, '10101900')
    //     expect(await screen.findByText('Дата слишком ранняя')).toBeInTheDocument()
    //   })
    //
    //   it('Валидируется даты устройства на работу', async () => {
    //     const inputEmploymentDate = document.getElementById('employmentDate')!
    //     userEvent.type(inputEmploymentDate, '10101900')
    //     expect(await screen.findByText('Дата слишком ранняя')).toBeInTheDocument()
    //   })
  })
})
