import React, { PropsWithChildren } from 'react'

import { Button } from '@mui/material'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Form, Formik } from 'formik'

import { MockedDateInput } from 'shared/ui/DateInput/__mocks__/DateInput.mock'
import { MockedMaskedInput } from 'shared/ui/MaskedInput/__mocks__/MaskedInput.mock'
import { MockedSelectInput } from 'shared/ui/SelectInput/__mocks__/SelectInput.mock'
import { MockedSwitchInput } from 'shared/ui/SwitchInput/__mocks__/SwitchInput.mock'
import { ThemeProviderMock } from 'tests/mocks'
import { disableConsole } from 'tests/utils'

import { configAddressInitialValues } from '../../../config/clientFormInitialValues'
import { clientFormValidationSchema } from '../../../config/clientFormValidation'
import { JobArea } from '../JobArea'

jest.mock('shared/ui/MaskedInput/MaskedInput', () => ({
  MaskedInput: MockedMaskedInput,
}))
jest.mock('shared/ui/SelectInput/SelectInput', () => ({
  SelectInput: MockedSelectInput,
}))
jest.mock('shared/ui/SwitchInput/SwitchInput', () => ({
  SwitchInput: MockedSwitchInput,
}))
jest.mock('shared/ui/DateInput/DateInput', () => ({
  DateInput: MockedDateInput,
}))

const formFields = ['employmentDate', 'employerName', 'employerPhone', 'employerAddressString', 'employerInn']

const mockedJobAreaFields = {
  occupation: '',
  employmentDate: null,
  employerName: '',
  employerPhone: '',
  employerAddress: configAddressInitialValues,
  employerAddressString: '',
  emplNotKladr: false,
  employerInn: '',
}

const createWrapper = ({ children }: PropsWithChildren) => (
  <ThemeProviderMock>
    <Formik
      initialValues={mockedJobAreaFields}
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

describe('JobAreaTest', () => {
  describe('Все поля отображаются на форме', () => {
    beforeEach(() => {
      render(<JobArea />, {
        wrapper: createWrapper,
      })
    })

    it('Заголовок блока присутствует на форме', () => {
      expect(screen.getByText('Работа')).toBeInTheDocument()
    })

    for (const fieldName of [...formFields, 'occupation', 'emplNotKladr']) {
      it(`Поле "${fieldName}" присутствует на форме`, () => {
        expect(screen.getByTestId(fieldName)).toBeInTheDocument()
      })
    }
  })

  describe('Все поля валидируются', () => {
    beforeEach(() => {
      render(<JobArea />, {
        wrapper: createWrapper,
      })
      userEvent.click(screen.getByTestId('submit'))
    })

    it('Поле "occupation" валидируется', async () => {
      expect(await screen.findByTestId('occupationErrorMessage')).toBeInTheDocument()
    })

    for (const fieldName of formFields) {
      it(`Поле "${fieldName}" валидируется, если клиент безработный`, async () => {
        userEvent.click(screen.getByTestId('occupation'))
        const options = await screen.findAllByRole('option')
        userEvent.click(options[0])
        expect(await screen.findByTestId(`${fieldName}ErrorMessage`)).toBeInTheDocument()
      })
    }

    for (const fieldName of [...formFields, 'emplNotKladr']) {
      it(`Поле "${fieldName}" не валидируется, если клиент работает`, async () => {
        expect(await screen.queryByTestId(`${fieldName}ErrorMessage`)).not.toBeInTheDocument()
      })
    }
  })
})
