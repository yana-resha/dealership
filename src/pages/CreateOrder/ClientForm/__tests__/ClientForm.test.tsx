import { PropsWithChildren } from 'react'

import { render, screen } from '@testing-library/react'
import { UseQueryResult } from 'react-query'
import { MockStore } from 'redux-mock-store'

import * as useGetAddressMapQueryModule from 'pages/CreateOrder/ClientForm/hooks/useGetAddressMapQuery'
import { MockProviders } from 'tests/mocks'
import { disableConsole } from 'tests/utils'

import { ClientForm } from '../ClientForm'
import { AddressMap } from '../ClientForm.types'
import { ADDRESS_MAP } from '../hooks/__tests__/useGetAddressMapQuery.mock'

jest.mock('../FormAreas/PassportArea/PassportArea', () => ({
  PassportArea: () => <div data-testid="passportArea" />,
}))
jest.mock('../FormAreas/CommunicationArea/CommunicationArea', () => ({
  CommunicationArea: () => <div data-testid="communicationArea" />,
}))
jest.mock('../FormAreas/IncomesArea/IncomesArea', () => ({
  IncomesArea: () => <div data-testid="incomesArea" />,
}))
jest.mock('../FormAreas/SecondDocArea/SecondDocArea', () => ({
  SecondDocArea: () => <div data-testid="secondDocArea" />,
}))
jest.mock('../FormAreas/JobArea/JobArea', () => ({
  JobArea: () => <div data-testid="jobArea" />,
}))
jest.mock('../FormAreas/QuestionnaireUploadArea/QuestionnaireUploadArea', () => ({
  QuestionnaireUploadArea: () => <div data-testid="questionnaireUploadArea" />,
}))
jest.mock('notistack', () => ({
  ...jest.requireActual('notistack'),
  useSnackbar: () => ({
    enqueueSnackbar: jest.fn(),
  }),
}))
jest.mock('shared/hooks/useScrollToErrorField')

const mockedUseGetAddressMapQuery = jest.spyOn(useGetAddressMapQueryModule, 'useGetAddressMapQuery')

interface WrapperProps extends PropsWithChildren {
  store?: MockStore
}

const createWrapper = ({ children }: WrapperProps) => <MockProviders>{children}</MockProviders>

disableConsole('error')

describe('ClientFormTest', () => {
  describe('Форма отображается корректно', () => {
    beforeEach(() => {
      mockedUseGetAddressMapQuery.mockImplementation(
        () =>
          ({
            data: ADDRESS_MAP,
            isLoading: false,
          } as unknown as UseQueryResult<AddressMap, unknown>),
      )
      render(<ClientForm />, { wrapper: createWrapper })
    })

    it('Отображается блок "Паспортные данные"', () => {
      expect(screen.getByTestId('passportArea')).toBeInTheDocument()
    })

    it('Отображается блок "Связь с клиентом"', () => {
      expect(screen.getByTestId('communicationArea')).toBeInTheDocument()
    })

    it('Отображается блок "Доходы"', () => {
      expect(screen.getByTestId('incomesArea')).toBeInTheDocument()
    })

    it('Отображается блок "Второй документ"', () => {
      expect(screen.getByTestId('secondDocArea')).toBeInTheDocument()
    })

    it('Отображается блок "Работа"', () => {
      expect(screen.getByTestId('jobArea')).toBeInTheDocument()
    })

    it('Отображается загрузчик анкеты', () => {
      expect(screen.getByTestId('questionnaireUploadArea')).toBeInTheDocument()
    })

    it('Отображается специальная отметка', () => {
      expect(screen.getByTestId('jobArea')).toBeInTheDocument()
    })

    it('Отображается кнопка "Сохранить черновик"', () => {
      expect(screen.getByText('Сохранить черновик')).toBeInTheDocument()
    })

    // it('Отображается кнопка "Распечатать"', () => {
    //   expect(screen.getByText('Распечатать')).toBeInTheDocument()
    // })

    it('Отображается кнопка "Далее"', () => {
      expect(screen.getByText('Далее')).toBeInTheDocument()
    })
  })
})
