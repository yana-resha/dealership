import React, { PropsWithChildren } from 'react'

import { Button } from '@mui/material'
import {
  SuggestionGetAddressSuggestions,
  SuggestionGetOrganizationSuggestions,
} from '@sberauto/dadata-proto/public'
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

jest.mock('shared/hooks/useOnScreen', () => ({
  useOnScreen: () => false,
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
const mockedDaDataQueryModule = jest.spyOn(daDataQueryModule, 'useGetAddressSuggestions')
const mockedDaDataQueryOrganization = jest.spyOn(daDataQueryModule, 'useGetOrganizationSuggestions')

const mockSuggestions: SuggestionGetAddressSuggestions[] = []
const mockOrganizationSuggestions: SuggestionGetOrganizationSuggestions[] = []

const formFields = ['employmentDate', 'employerName', 'employerPhone', 'employerAddressString', 'employerInn']

const mockedJobAreaFields = {
  occupation: null,
  employmentDate: null,
  employerName: '',
  employerPhone: '',
  employerAddress: configAddressInitialValues,
  employerAddressString: '',
  emplNotKladr: false,
  employerInn: '',
  submitAction: SubmitAction.SAVE,
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
      mockedUseGetAddressMapQuery.mockImplementation(
        () =>
          ({
            data: ADDRESS_MAP,
            isLoading: false,
          } as unknown as UseQueryResult<AddressMap, unknown>),
      )
      mockedDaDataQueryModule.mockImplementation(
        () =>
          ({
            data: mockSuggestions,
            refetch: jest.fn(),
          } as any),
      )
      mockedDaDataQueryOrganization.mockImplementation(
        () =>
          ({
            data: mockOrganizationSuggestions,
            mutate: jest.fn(),
          } as any),
      )
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
      mockedUseGetAddressMapQuery.mockImplementation(
        () =>
          ({
            data: ADDRESS_MAP,
            isLoading: false,
          } as unknown as UseQueryResult<AddressMap, unknown>),
      )
      mockedDaDataQueryModule.mockImplementation(
        () =>
          ({
            data: mockSuggestions,
            refetch: jest.fn(),
          } as any),
      )
      mockedDaDataQueryOrganization.mockImplementation(
        () =>
          ({
            data: mockOrganizationSuggestions,
            mutate: jest.fn(),
          } as any),
      )
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
