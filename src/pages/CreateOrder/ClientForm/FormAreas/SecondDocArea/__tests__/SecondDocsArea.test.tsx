import React, { PropsWithChildren } from 'react'

import { Button } from '@mui/material'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Form, Formik } from 'formik'

import { SubmitAction } from 'pages/CreateOrder/ClientForm/ClientForm.types'
import { MockedDateInput } from 'shared/ui/DateInput/__mocks__/DateInput.mock'
import { MockedMaskedInput } from 'shared/ui/MaskedInput/__mocks__/MaskedInput.mock'
import { MockedSelectInput } from 'shared/ui/SelectInput/__mocks__/SelectInput.mock'
import { ThemeProviderMock } from 'tests/mocks'
import { disableConsole } from 'tests/utils'

import { clientFormValidationSchema } from '../../../config/clientFormValidation'
import { SecondDocArea } from '../SecondDocArea'

jest.mock('shared/ui/MaskedInput/MaskedInput', () => ({
  MaskedInput: MockedMaskedInput,
}))
jest.mock('shared/ui/SelectInput/SelectInput', () => ({
  SelectInput: MockedSelectInput,
}))
jest.mock('shared/ui/DateInput/DateInput', () => ({
  DateInput: MockedDateInput,
}))

const formFields = [
  'secondDocumentType',
  'secondDocumentNumber',
  'secondDocumentDate',
  'secondDocumentIssuedBy',
]

type InitialValues = {
  secondDocumentType: number | null
  secondDocumentNumber?: string
  secondDocumentDate?: Date | null
  secondDocumentIssuedBy?: string
  submitAction?: SubmitAction
}
const mockedSecondDocAreaFields = {
  secondDocumentType: null,
  secondDocumentNumber: '',
  secondDocumentDate: null,
  secondDocumentIssuedBy: '',
  submitAction: SubmitAction.Save,
}

const ProviderWrapper = ({
  initialValues,
  children,
}: PropsWithChildren<{ initialValues?: InitialValues }>) => (
  <ThemeProviderMock>
    <Formik
      initialValues={{ ...mockedSecondDocAreaFields, ...initialValues }}
      validationSchema={clientFormValidationSchema}
      onSubmit={() => {}}
    >
      <Form>
        {children}
        <Button type="submit" data-testid="submit" />
      </Form>
    </Formik>
  </ThemeProviderMock>
)
disableConsole('error')

describe('SecondDocAreaTest', () => {
  describe('Все поля отображаются на форме', () => {
    beforeEach(() => {
      render(<SecondDocArea />, {
        wrapper: ({ children }: PropsWithChildren) => <ProviderWrapper>{children}</ProviderWrapper>,
      })
    })

    it('Заголовок блока присутствует на форме', () => {
      expect(screen.getByText('Второй документ')).toBeInTheDocument()
    })

    for (const fieldName of formFields) {
      it(`Поле "${fieldName}" присутствует на форме`, () => {
        expect(screen.getByTestId(fieldName)).toBeInTheDocument()
      })
    }
  })

  describe('Проверка условных полей', () => {
    it('Для типа документа ВУ присутствует поле Код подразделения', () => {
      render(<SecondDocArea />, {
        wrapper: ({ children }: PropsWithChildren) => (
          <ProviderWrapper initialValues={{ secondDocumentType: 15 }}>{children}</ProviderWrapper>
        ),
      })
      expect(screen.getByText('Код подразделения')).toBeInTheDocument()
    })

    it('Для типа документа ИНН отсутствуют поля Дата выдачи и Кем выдан', () => {
      render(<SecondDocArea />, {
        wrapper: ({ children }: PropsWithChildren) => (
          <ProviderWrapper initialValues={{ secondDocumentType: 50 }}>{children}</ProviderWrapper>
        ),
      })
      expect(screen.queryByText('Дата выдачи')).not.toBeInTheDocument()
    })

    it('Для типа документа Пенсионное... отсутствуют поля Дата выдачи и Кем выдан', () => {
      render(<SecondDocArea />, {
        wrapper: ({ children }: PropsWithChildren) => (
          <ProviderWrapper initialValues={{ secondDocumentType: 18 }}>{children}</ProviderWrapper>
        ),
      })
      expect(screen.queryByText('Дата выдачи')).not.toBeInTheDocument()
    })
  })

  describe('Все поля валидируются', () => {
    beforeEach(() => {
      render(<SecondDocArea />, {
        wrapper: ({ children }: PropsWithChildren) => <ProviderWrapper>{children}</ProviderWrapper>,
      })
      userEvent.click(screen.getByTestId('submit'))
    })

    for (const fieldName of formFields) {
      it(`Поле "${fieldName}" валидируется`, async () => {
        expect(await screen.findByTestId(`${fieldName}ErrorMessage`)).toBeInTheDocument()
      })
    }
  })
})
