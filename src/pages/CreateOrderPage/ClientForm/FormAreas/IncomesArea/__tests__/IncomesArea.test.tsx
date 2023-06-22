import React, { PropsWithChildren } from 'react'

import { Button } from '@mui/material'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Form, Formik } from 'formik'

import { SubmitAction } from 'pages/CreateOrderPage/ClientForm/ClientForm.types'
import { MockedMaskedInput } from 'shared/ui/MaskedInput/__mocks__/MaskedInput.mock'
import { MockedSelectInput } from 'shared/ui/SelectInput/__mocks__/SelectInput.mock'
import { MockedSwitchInput } from 'shared/ui/SwitchInput/__mocks__/SwitchInput.mock'
import { ThemeProviderMock } from 'tests/mocks'
import { disableConsole } from 'tests/utils'

import { clientFormValidationSchema } from '../../../config/clientFormValidation'
import { IncomesArea } from '../IncomesArea'

jest.mock('shared/ui/MaskedInput/MaskedInput', () => ({
  MaskedInput: MockedMaskedInput,
}))
jest.mock('shared/ui/SelectInput/SelectInput', () => ({
  SelectInput: MockedSelectInput,
}))
jest.mock('shared/ui/SwitchInput/SwitchInput', () => ({
  SwitchInput: MockedSwitchInput,
}))
jest.mock('../../IncomeProofUploadArea/IncomeProofUploadArea', () => ({
  IncomeProofUploadArea: () => <div data-testid="incomeProofUploadArea" />,
}))

const formFields = ['averageIncome', 'additionalIncome', 'familyIncome', 'expenses', 'relatedToPublic']

const mockedIncomeAreaFields = {
  averageIncome: '',
  additionalIncome: '',
  incomeConfirmation: false,
  familyIncome: '',
  expenses: '',
  relatedToPublic: '',
  submitAction: SubmitAction.Save,
}

const createWrapper = ({ children }: PropsWithChildren) => (
  <ThemeProviderMock>
    <Formik
      initialValues={mockedIncomeAreaFields}
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

describe('IncomeAreaTest', () => {
  describe('Все поля отображаются на форме', () => {
    beforeEach(() => {
      render(<IncomesArea />, {
        wrapper: createWrapper,
      })
    })

    it('Заголовок блока присутствует на форме', () => {
      expect(screen.getByText('Доходы')).toBeInTheDocument()
    })

    for (const fieldName of [...formFields, 'incomeConfirmation']) {
      it(`Поле "${fieldName}" присутствует на форме`, () => {
        expect(screen.getByTestId(`${fieldName}`)).toBeInTheDocument()
      })
    }

    it('Поле для загрузки документов отображается на форме, только если выбрано подтверждение', async () => {
      expect(screen.queryByTestId('incomeProofUploadArea')).not.toBeInTheDocument()
      userEvent.click(screen.getByTestId('incomeConfirmation'))
      expect(await screen.findByTestId('incomeProofUploadArea')).toBeInTheDocument()
    })
  })

  describe('Все поля валидируются', () => {
    beforeEach(() => {
      render(<IncomesArea />, {
        wrapper: createWrapper,
      })
    })

    for (const fieldName of formFields) {
      it(`Поле "${fieldName}" валидируется`, async () => {
        userEvent.click(screen.getByTestId('submit'))
        expect(await screen.findByTestId(`${fieldName}ErrorMessage`)).toBeInTheDocument()
      })
    }
  })
})
