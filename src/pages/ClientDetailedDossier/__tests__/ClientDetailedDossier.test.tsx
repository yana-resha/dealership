import { PropsWithChildren } from 'react'

import { render, screen } from '@testing-library/react'
import { MockStore } from 'redux-mock-store'

import * as useGovProgramScansModule from 'pages/ClientDetailedDossier/GovProgramDocumentsArea/hooks/useGovProgramScans'
import * as useGetFullApplicationQueryModule from 'pages/ClientDetailedDossier/hooks/useGetFullApplicationQuery'
import { fullApplicationData } from 'shared/api/requests/loanAppLifeCycleDc.mock'
import * as useAppSelectorModule from 'shared/hooks/store/useAppSelector'
import { MockProviders, ThemeProviderMock } from 'tests/mocks'

import { ClientDetailedDossier } from '../ClientDetailedDossier'
import { Order } from 'entities/order/model/orderSlice'

jest.mock('../DossierIdArea/DossierIdArea', () => ({
  DossierIdArea: () => <div data-testid="DossierIdArea" />,
}))
jest.mock('../InformationArea/InformationArea', () => ({
  InformationArea: () => <div data-testid="InformationArea" />,
}))
jest.mock('../DocumentsArea/DocumentsArea', () => ({
  DocumentsArea: () => <div data-testid="DocumentsArea" />,
}))
jest.mock('../ActionArea/ActionArea', () => ({
  ActionArea: () => <div data-testid="ActionArea" />,
}))

const mockedUseGetFullApplicationQuery = jest.spyOn(
  useGetFullApplicationQueryModule,
  'useGetFullApplicationQuery',
)

const mockedUseAppSelector = jest.spyOn(useAppSelectorModule, 'useAppSelector')
const mockedUseGovProgramScans = jest.spyOn(useGovProgramScansModule, 'useGovProgramScans')

interface WrapperProps extends PropsWithChildren {
  store?: MockStore
}

const createWrapper = ({ store, children }: WrapperProps) => (
  <MockProviders mockStore={store}>
    <ThemeProviderMock>{children}</ThemeProviderMock>
  </MockProviders>
)

describe('ClientDetailedDossierTest', () => {
  describe('Отображаются все области экрана', () => {
    beforeEach(() => {
      mockedUseGetFullApplicationQuery.mockImplementation(
        () =>
          ({
            data: fullApplicationData,
            refetch: jest.fn(),
          } as any),
      )
      mockedUseAppSelector.mockImplementation(() => ({ application: fullApplicationData.application }))
      mockedUseGovProgramScans.mockImplementation(
        () =>
          ({
            currentGovProgramScans: [],
            isNecessaryRequest: false,
            isPending: false,
            isSuccess: false,
          } as any),
      )
      render(<ClientDetailedDossier />, { wrapper: createWrapper })
    })
    it('Отображается область DossierIdArea', () => {
      expect(screen.getByTestId('DossierIdArea')).toBeInTheDocument()
    })

    it('Отображается область InformationArea', () => {
      expect(screen.getByTestId('InformationArea')).toBeInTheDocument()
    })

    it('Отображается область DocumentsArea', () => {
      expect(screen.getByTestId('DocumentsArea')).toBeInTheDocument()
    })

    it('Отображается область ActionArea', () => {
      expect(screen.getByTestId('ActionArea')).toBeInTheDocument()
    })
  })

  describe('Если appType !== CARLOANAPPLICATIONDC', () => {
    beforeEach(() => {
      mockedUseGetFullApplicationQuery.mockImplementation(
        () =>
          ({
            data: {
              ...fullApplicationData,
              application: {
                ...fullApplicationData,
                appType: '',
              },
            },
            refetch: jest.fn(),
          } as any),
      )
      mockedUseAppSelector.mockImplementation(() => ({
        application: { ...fullApplicationData.application, appType: '' },
      }))
      mockedUseGovProgramScans.mockImplementation(
        () =>
          ({
            currentGovProgramScans: [],
            isNecessaryRequest: false,
            isPending: false,
            isSuccess: false,
          } as any),
      )
      render(<ClientDetailedDossier />, { wrapper: createWrapper })
    })

    it('Не отображается область DocumentsArea', () => {
      expect(screen.queryByTestId('DocumentsArea')).not.toBeInTheDocument()
    })
  })
})
