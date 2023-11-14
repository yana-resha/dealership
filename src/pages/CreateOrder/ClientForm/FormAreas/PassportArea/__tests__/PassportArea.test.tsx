import React, { PropsWithChildren } from 'react'

import { Button } from '@mui/material'
import { SuggestionGetAddressSuggestions } from '@sberauto/dadata-proto/public'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Form, Formik } from 'formik'

import { SubmitAction } from 'pages/CreateOrder/ClientForm/ClientForm.types'
import * as daDataQueryModule from 'shared/api/requests/dadata.api'
import { useGetFmsUnitSuggestions } from 'shared/api/requests/dadata.api'
import { MockedDateInput } from 'shared/ui/DateInput/__mocks__/DateInput.mock'
import { MockedMaskedInput } from 'shared/ui/MaskedInput/__mocks__/MaskedInput.mock'
import { MockedSelectInput } from 'shared/ui/SelectInput/__mocks__/SelectInput.mock'
import { MockedSwitchInput } from 'shared/ui/SwitchInput/__mocks__/SwitchInput.mock'
import { ThemeProviderMock } from 'tests/mocks'
import { disableConsole } from 'tests/utils'

import { configAddressInitialValues } from '../../../config/clientFormInitialValues'
import { clientFormValidationSchema } from '../../../config/clientFormValidation'
import { PassportArea } from '../PassportArea'

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

type Props = {
  id: string
  isError: boolean
}
jest.mock('shared/ui/AutocompleteInput/AutocompleteDaDataAddress', () => ({
  AutocompleteDaDataAddress: ({ id, isError }: Props) => (
    <div data-testid={id}>{isError && <div data-testid={id + 'ErrorMessage'} />}</div>
  ),
}))
jest.mock('shared/ui/AutocompleteInput/AutocompleteInput', () => ({
  AutocompleteInput: ({ id, isError }: Props) => (
    <div data-testid={id}>{isError && <div data-testid={id + 'ErrorMessage'} />}</div>
  ),
}))

const mockedDaDataQueryAddress = jest.spyOn(daDataQueryModule, 'useGetAddressSuggestions')
const mockedUseGetFmsUnitSuggestions = jest.spyOn(daDataQueryModule, 'useGetFmsUnitSuggestions')

const mockSuggestions: SuggestionGetAddressSuggestions[] = []

const formFields = [
  'clientName',
  'numOfChildren',
  'familyStatus',
  'passport',
  'birthDate',
  'birthPlace',
  'passportDate',
  'divisionCode',
  'issuedBy',
  'registrationAddressString',
  'livingAddressString',
]

const mockedPassportAreaFields = {
  clientName: '',
  hasNameChanged: false,
  clientFormerName: '',
  numOfChildren: '',
  familyStatus: null,
  passport: '',
  birthDate: null,
  birthPlace: '',
  passportDate: null,
  divisionCode: '',
  sex: null,
  issuedBy: '',
  registrationAddressString: '',
  registrationAddress: configAddressInitialValues,
  regNotKladr: false,
  regAddrIsLivingAddr: false,
  livingAddressString: '',
  livingAddress: configAddressInitialValues,
  livingNotKladr: false,
  submitAction: SubmitAction.Save,
}

const createWrapper = ({ children }: PropsWithChildren) => (
  <ThemeProviderMock>
    <Formik
      initialValues={mockedPassportAreaFields}
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

describe('PassportAreaTest', () => {
  describe('Все поля отображаются на форме', () => {
    beforeEach(() => {
      mockedDaDataQueryAddress.mockImplementation(
        () =>
          ({
            data: mockSuggestions,
            refetch: jest.fn(),
          } as any),
      )
      mockedUseGetFmsUnitSuggestions.mockImplementation(
        () =>
          ({
            data: mockSuggestions,
            mutate: jest.fn(),
          } as any),
      )
      render(<PassportArea />, {
        wrapper: createWrapper,
      })
    })

    it('Заголовок блока присутствует на форме', () => {
      expect(screen.getByText('Паспортные данные')).toBeInTheDocument()
    })

    for (const fieldName of [
      ...formFields,
      'hasNameChanged',
      'regNotKladr',
      'regAddrIsLivingAddr',
      'livingNotKladr',
    ]) {
      it(`Поле "${fieldName}" присутствует на форме`, () => {
        expect(screen.getByTestId(fieldName)).toBeInTheDocument()
      })
    }

    it('Поле "clientFormerName" отображается на форме, если указана смена имени', async () => {
      expect(await screen.queryByTestId('clientFormerName')).not.toBeInTheDocument()
      userEvent.click(screen.getByTestId('hasNameChanged'))
      expect(await screen.getByTestId('clientFormerName')).toBeInTheDocument()
    })

    it('Поле "livingAddressString" не отображается на форме, если адрес регистрации совпадает с адресом проживания', async () => {
      userEvent.click(screen.getByTestId('regAddrIsLivingAddr'))
      expect(await screen.queryByTestId('livingAddressString')).not.toBeInTheDocument()
    })
  })

  describe('Все поля валидируются', () => {
    beforeEach(() => {
      mockedUseGetFmsUnitSuggestions.mockImplementation(
        () =>
          ({
            data: mockSuggestions,
            mutate: jest.fn(),
          } as any),
      )
      render(<PassportArea />, {
        wrapper: createWrapper,
      })
      userEvent.click(screen.getByTestId('submit'))
    })

    for (const fieldName of formFields) {
      it(`Поле "${fieldName}" валидируется`, async () => {
        expect(await screen.findByTestId(`${fieldName}ErrorMessage`)).toBeInTheDocument()
      })
    }

    it('Поле "clientFormerName" валидируется, если указана смена имени', async () => {
      userEvent.click(screen.getByTestId('hasNameChanged'))
      expect(await screen.findByTestId('clientFormerNameErrorMessage')).toBeInTheDocument()
    })
  })
})