import React, { PropsWithChildren } from 'react'

import { Button } from '@mui/material'
import { OccupationType } from '@sberauto/loanapplifecycledc-proto/public'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Form, Formik } from 'formik'

import { SubmitAction } from 'pages/CreateOrder/ClientForm/ClientForm.types'
import { MockedMaskedInput } from 'shared/ui/MaskedInput/__mocks__/MaskedInput.mock'
import { ThemeProviderMock } from 'tests/mocks'
import { disableConsole } from 'tests/utils'

import { enrichedclientFormValidationSchema } from '../../../config/clientFormValidation'
import { CommunicationArea } from '../CommunicationArea'

jest.mock('shared/ui/MaskedInput/MaskedInput', () => ({
  MaskedInput: MockedMaskedInput,
}))

jest.mock('react-router-dom', () => ({
  useLocation: () => ({ state: { isFullCalculator: true } }),
}))

const formFields = ['mobileNumber', 'additionalNumber', 'email']

let mockedCommunicationFields: {
  occupation: number | null
  mobileNumber: string
  additionalNumber: string
  email: string
  submitAction: SubmitAction
} = {
  occupation: null,
  mobileNumber: '',
  additionalNumber: '',
  email: '',
  submitAction: SubmitAction.Save,
}

const createWrapper = ({ children }: PropsWithChildren) => (
  <ThemeProviderMock>
    <Formik
      initialValues={mockedCommunicationFields}
      validationSchema={enrichedclientFormValidationSchema}
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

describe('CommunicationAreaTest', () => {
  describe('Все поля отображаются на форме', () => {
    beforeEach(() => {
      render(<CommunicationArea />, {
        wrapper: createWrapper,
      })
    })

    it('Заголовок блока отображается на форме', () => {
      expect(screen.getByText('Связь с клиентом')).toBeInTheDocument()
    })

    for (const fieldName of formFields) {
      it(`Поле "${fieldName}" отображается на форме`, () => {
        expect(screen.getByTestId(`${fieldName}`)).toBeInTheDocument()
      })
    }
  })

  describe('Все поля валидируются', () => {
    it('Поле "mobileNumber" валидируется', async () => {
      render(<CommunicationArea />, {
        wrapper: createWrapper,
      })
      userEvent.click(screen.getByTestId('submit'))
      expect(await screen.findByTestId('mobileNumberErrorMessage')).toBeInTheDocument()
    })

    it('Поле "email" валидируется', async () => {
      render(<CommunicationArea />, {
        wrapper: createWrapper,
      })
      userEvent.click(screen.getByTestId('submit'))
      expect(await screen.findByTestId('emailErrorMessage')).toBeInTheDocument()
    })

    it('Поле "additionalNumber" не валидируется, если клиент работает', async () => {
      render(<CommunicationArea />, {
        wrapper: createWrapper,
      })
      userEvent.click(screen.getByTestId('submit'))
      expect(await screen.queryByTestId('additionalNumberErrorMessage')).not.toBeInTheDocument()
    })

    it('Поле "additionalNumber" валидируется, если клиент не работает', async () => {
      mockedCommunicationFields = {
        ...mockedCommunicationFields,
        occupation: OccupationType.UNEMPLOYED,
      }
      render(<CommunicationArea />, {
        wrapper: createWrapper,
      })
      userEvent.click(screen.getByTestId('submit'))
      expect(await screen.findByTestId('additionalNumberErrorMessage')).toBeInTheDocument()
    })
  })
})
