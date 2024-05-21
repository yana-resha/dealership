import React, { PropsWithChildren } from 'react'

import { Button } from '@mui/material'
import { SuggestionGetAddressSuggestions } from '@sberauto/dadata-proto/public'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Form, Formik } from 'formik'
import { UseQueryResult } from 'react-query'

import { AddressMap, SubmitAction } from 'pages/CreateOrder/ClientForm/ClientForm.types'
import { ADDRESS_MAP } from 'pages/CreateOrder/ClientForm/hooks/__tests__/useGetAddressMapQuery.mock'
import * as useGetAddressMapQueryModule from 'pages/CreateOrder/ClientForm/hooks/useGetAddressMapQuery'
import * as daDataQueryModule from 'shared/api/requests/dadata.api'
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

const mockedUseGetAddressMapQuery = jest.spyOn(useGetAddressMapQueryModule, 'useGetAddressMapQuery')
const mockedDaDataQueryAddress = jest.spyOn(daDataQueryModule, 'useGetAddressSuggestions')
const mockedUseGetFmsUnitSuggestions = jest.spyOn(daDataQueryModule, 'useGetFmsUnitSuggestions')

const mockSuggestions: SuggestionGetAddressSuggestions[] = []

const formFields = [
  'clientLastName',
  'clientFirstName',
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
  clientLastName: '',
  clientFirstName: '',
  hasNameChanged: false,
  clientFormerLastName: '',
  clientFormerFirstName: '',
  clientFormerMiddleName: '',
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
      mockedUseGetAddressMapQuery.mockImplementation(
        () =>
          ({
            data: ADDRESS_MAP,
            isLoading: false,
          } as unknown as UseQueryResult<AddressMap, unknown>),
      )
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

    it('Поле "clientFormerLastName" отображается на форме, если указана смена имени', async () => {
      expect(await screen.queryByTestId('clientFormerLastName')).not.toBeInTheDocument()
      userEvent.click(screen.getByTestId('hasNameChanged'))
      expect(await screen.getByTestId('clientFormerLastName')).toBeInTheDocument()
    })

    it('Поле "clientFormerFirstName" отображается на форме, если указана смена имени', async () => {
      expect(await screen.queryByTestId('clientFormerFirstName')).not.toBeInTheDocument()
      userEvent.click(screen.getByTestId('hasNameChanged'))
      expect(await screen.getByTestId('clientFormerFirstName')).toBeInTheDocument()
    })

    it('Поле "clientFormerMiddleName" отображается на форме, если указана смена имени', async () => {
      expect(await screen.queryByTestId('clientFormerMiddleName')).not.toBeInTheDocument()
      userEvent.click(screen.getByTestId('hasNameChanged'))
      expect(await screen.getByTestId('clientFormerMiddleName')).toBeInTheDocument()
    })

    it('Поле "livingAddressString" не отображается на форме, если адрес регистрации совпадает с адресом проживания', async () => {
      userEvent.click(screen.getByTestId('regAddrIsLivingAddr'))
      expect(await screen.queryByTestId('livingAddressString')).not.toBeInTheDocument()
    })
  })

  describe('Все поля валидируются', () => {
    beforeEach(() => {
      mockedUseGetAddressMapQuery.mockImplementation(
        () =>
          ({
            data: ADDRESS_MAP,
            isLoading: false,
          } as unknown as UseQueryResult<AddressMap, unknown>),
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
      userEvent.click(screen.getByTestId('submit'))
    })

    for (const fieldName of formFields) {
      it(`Поле "${fieldName}" валидируется`, async () => {
        expect(await screen.findByTestId(`${fieldName}ErrorMessage`)).toBeInTheDocument()
      })
    }

    it('Поле "clientFormerName" валидируется, если указана смена имени', async () => {
      userEvent.click(screen.getByTestId('hasNameChanged'))
      expect(await screen.findByTestId('clientFormerLastNameErrorMessage')).toBeInTheDocument()
      expect(await screen.findByTestId('clientFormerFirstNameErrorMessage')).toBeInTheDocument()
    })
  })
})
