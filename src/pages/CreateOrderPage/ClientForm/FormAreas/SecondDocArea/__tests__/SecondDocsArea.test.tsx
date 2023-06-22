import React, { PropsWithChildren } from 'react'

import { Button } from '@mui/material'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Form, Formik } from 'formik'

import { SubmitAction } from 'pages/CreateOrderPage/ClientForm/ClientForm.types'
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

const mockedSecondDocAreaFields = {
  secondDocumentType: null,
  secondDocumentNumber: '',
  secondDocumentDate: null,
  secondDocumentIssuedBy: '',
  submitAction: SubmitAction.Save,
}

const createWrapper = ({ children }: PropsWithChildren) => (
  <ThemeProviderMock>
    <Formik
      initialValues={mockedSecondDocAreaFields}
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
        wrapper: createWrapper,
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

  describe('Все поля валидируются', () => {
    beforeEach(() => {
      render(<SecondDocArea />, {
        wrapper: createWrapper,
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
