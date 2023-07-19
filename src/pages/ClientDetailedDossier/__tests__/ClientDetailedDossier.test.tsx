import React, { PropsWithChildren } from 'react'

import { render, screen } from '@testing-library/react'
import { MockStore } from 'redux-mock-store'

import { Order } from 'entities/reduxStore/orderSlice'
import * as useGetFullApplicationQueryModule from 'shared/api/requests/loanAppLifeCycleDc'
import { fullApplicationData } from 'shared/api/requests/loanAppLifeCycleDc.mock'
import * as useAppSelectorModule from 'shared/hooks/store/useAppSelector'
import { MockProviders, ThemeProviderMock } from 'tests/mocks'

import { ClientDetailedDossier } from '../ClientDetailedDossier'

jest.mock('entities/application/DossierAreas/ui/DossierIdArea/DossierIdArea', () => ({
  DossierIdArea: () => <div data-testid="DossierIdArea" />,
}))
jest.mock('entities/application/DossierAreas/ui/InformationArea/InformationArea', () => ({
  InformationArea: () => <div data-testid="InformationArea" />,
}))
jest.mock('entities/application/DossierAreas/ui/DocumentsArea/DocumentsArea', () => ({
  DocumentsArea: () => <div data-testid="DocumentsArea" />,
}))
jest.mock('entities/application/DossierAreas/ui/ActionArea/ActionArea', () => ({
  ActionArea: () => <div data-testid="ActionArea" />,
}))

const mockedUseGetFullApplicationQuery = jest.spyOn(
  useGetFullApplicationQueryModule,
  'useGetFullApplicationQuery',
)

const mockedUseAppSelector = jest.spyOn(useAppSelectorModule, 'useAppSelector')

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
      mockedUseAppSelector.mockImplementation(() => {
        const orderData: Order = { orderData: fullApplicationData }

        return orderData
      })
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
})
