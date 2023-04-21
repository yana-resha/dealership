import React, { PropsWithChildren } from 'react'

import { Vendor } from '@sberauto/loanapplifecycledc-proto/public'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Cookies from 'js-cookie'
import { MockStore } from 'redux-mock-store'

import { StoreProviderMock, ThemeProviderMock } from 'tests/mocks'
import { disableConsole } from 'tests/utils'

import { Header } from '../Header'

interface WrapperProps extends PropsWithChildren {
  store?: MockStore
}

jest.mock('entities/pointOfSale')
jest.mock('entities/user/ui/UserInfo/UserInfo.tsx')

const createWrapper = ({ store, children }: WrapperProps) => (
  <StoreProviderMock mockStore={store}>
    <ThemeProviderMock>{children}</ThemeProviderMock>
  </StoreProviderMock>
)

disableConsole('error')

describe('HeaderTest', () => {
  describe('Header отображается корректно', () => {
    beforeEach(() => {
      Cookies.set('pointOfSale', JSON.stringify(pointOfSale))
      render(<Header />, { wrapper: createWrapper })
    })

    it('В хэдере присутствует информация о торговой точке', () => {
      expect(screen.getByTestId('pointInfo')).toBeInTheDocument()
    })

    it('В хэдере присутствует информация о пользователе', () => {
      expect(screen.getByTestId('userInfo')).toBeInTheDocument()
    })

    it('При нажатии на кнопку появляется компонент ChoosePoint', async () => {
      userEvent.click(screen.getByTestId('pointInfo'))
      expect(await screen.findByTestId('choosePoint')).toBeInTheDocument()
    })
  })
})

const pointOfSale: Vendor = {
  vendorCode: '2002852',
  vendorName: 'Сармат',
  cityName: 'Ханты-Мансийск',
  houseNumber: '4',
  streetName: 'Зябликова',
}
