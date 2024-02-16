import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider, UseQueryResult } from 'react-query'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'

import { store } from 'app/store'
import * as authContext from 'common/auth/ui/AuthProvider/context'
import * as CheckPoint from 'entities/pointOfSale/hooks/useCheckPointOfSale'
import * as useGetUserQueryModule from 'entities/user/hooks/useGetUserQuery'
import * as useUserRolesModule from 'entities/user/hooks/useUserRoles'
import { PreparedUser } from 'entities/user/types'
import { CustomFetchError } from 'shared/api/client'
import { ThemeProviderMock } from 'tests/mocks'

import { Router } from '../Router'

jest.mock('shared/api/requests/authdc', () => ({
  useGetUserQuery: () => ({ data: { firstName: 'firstName', lastName: 'lastName' } }),
}))
const useAuthContextMock = jest.spyOn(authContext, 'useAuthContext')
const useCheckPointOfSale = jest.spyOn(CheckPoint, 'useCheckPointOfSale')
const mockedUseUserRoles = jest.spyOn(useUserRolesModule, 'useUserRoles')
const mockedUseGetUserQuery = jest.spyOn(useGetUserQueryModule, 'useGetUserQuery')

jest.mock('../Routers/MainRouter')
jest.mock('../Routers/AuthRouter')

const queryClient = new QueryClient()

const getMockRouter = () => (
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <ThemeProviderMock>
        <MemoryRouter basename="/">
          <Router />
        </MemoryRouter>
      </ThemeProviderMock>
    </Provider>
  </QueryClientProvider>
)

describe('Router component', () => {
  beforeEach(() => {
    useAuthContextMock.mockImplementation(() => ({
      isAuth: true,
      logoutUrl: undefined,
      setLogoutUrl: () => undefined,
    }))
    useCheckPointOfSale.mockImplementation(() => true)
    mockedUseUserRoles.mockImplementation(() => ({ isContentManager: false, isCreditExpert: true }))
    mockedUseGetUserQuery.mockImplementation(
      () => ({ isLoading: false } as UseQueryResult<PreparedUser, CustomFetchError>),
    )
  })

  it('Если данные о пользователе  еще грузятся, то отображается лоадер', async () => {
    mockedUseGetUserQuery.mockImplementation(
      () => ({ isLoading: true } as UseQueryResult<PreparedUser, CustomFetchError>),
    )
    render(getMockRouter())
    expect(await screen.findByTestId('circularProgressWheel')).toBeInTheDocument()
  })

  it('Если пользователь НЕ авторизован, то отображается экран авторизации', async () => {
    useAuthContextMock.mockImplementation(() => ({
      isAuth: false,
      logoutUrl: undefined,
      setLogoutUrl: () => undefined,
    }))
    render(getMockRouter())

    expect(await screen.findByTestId('authPage')).toBeInTheDocument()
  })

  it('Если пользователь авторизован и выбрана точка, то отображается главный рабочий экран', async () => {
    render(getMockRouter())
    expect(await screen.findByTestId('dealershipPage')).toBeInTheDocument()
  })

  it('Если пользователь авторизован и нет роли кредитного эксперта, то отображается главный рабочий экран', async () => {
    useCheckPointOfSale.mockImplementation(() => false)
    mockedUseUserRoles.mockImplementation(() => ({ isContentManager: true, isCreditExpert: false }))
    render(getMockRouter())
    expect(await screen.findByTestId('dealershipPage')).toBeInTheDocument()
  })

  it('Если пользователь авторизован, но есть роль Кредитного эксперта, и нет точки, то отображается экран авторизации', async () => {
    useCheckPointOfSale.mockImplementation(() => false)
    mockedUseUserRoles.mockImplementation(() => ({ isContentManager: false, isCreditExpert: true }))
    render(getMockRouter())
    expect(await screen.findByTestId('authPage')).toBeInTheDocument()
  })
})
