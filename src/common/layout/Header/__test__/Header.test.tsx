import React, { PropsWithChildren } from 'react'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MockStore } from 'redux-mock-store'

import * as useUserRolesModule from 'entities/user/hooks/useUserRoles'
import { StoreProviderMock, ThemeProviderMock } from 'tests/mocks'
import { disableConsole } from 'tests/utils'

import { Header } from '../Header'

interface WrapperProps extends PropsWithChildren {
  store?: MockStore
}

jest.mock('entities/pointOfSale')
jest.mock('entities/user/ui/UserInfo/UserInfo.tsx')

const mockedUseUserRoles = jest.spyOn(useUserRolesModule, 'useUserRoles')

const createWrapper = ({ store, children }: WrapperProps) => (
  <StoreProviderMock mockStore={store}>
    <ThemeProviderMock>{children}</ThemeProviderMock>
  </StoreProviderMock>
)

disableConsole('error')

describe('HeaderTest', () => {
  describe('Header отображается корректно', () => {
    beforeEach(() => {
      mockedUseUserRoles.mockImplementation(() => ({ isContentManager: false, isCreditExpert: true }))
    })

    it('В хэдере присутствует информация о пользователе', () => {
      render(<Header />, { wrapper: createWrapper })
      expect(screen.getByTestId('userInfo')).toBeInTheDocument()
    })

    it('Когда isCreditExpert=true и isEdit=false, отображается PointInfo', () => {
      render(<Header />, { wrapper: createWrapper })
      expect(screen.getByTestId('pointInfo')).toBeInTheDocument()
    })

    it('Когда isCreditExpert=false, не отображается PointInfo', () => {
      mockedUseUserRoles.mockImplementation(() => ({ isContentManager: false, isCreditExpert: false }))
      render(<Header />, { wrapper: createWrapper })
      expect(screen.queryByTestId('pointInfo')).not.toBeInTheDocument()
      expect(screen.queryByTestId('choosePoint')).not.toBeInTheDocument()
    })

    it('При нажатии на кнопку появляется компонент ChoosePoint', async () => {
      render(<Header />, { wrapper: createWrapper })
      userEvent.click(screen.getByTestId('pointInfo'))
      expect(await screen.findByTestId('choosePoint')).toBeInTheDocument()
    })
  })
})
