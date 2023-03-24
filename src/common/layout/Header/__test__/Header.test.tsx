import React, { PropsWithChildren } from 'react'
import { StoreProviderMock, ThemeProviderMock } from 'tests/mocks'
import { MockStore } from 'redux-mock-store'
import { disableConsole } from 'tests/utils'
import { Vendor } from '@sberauto/authdc-proto/public'
import Cookies from 'js-cookie'
import { render, screen } from '@testing-library/react'
import { Header } from '../Header'

interface WrapperProps extends PropsWithChildren {
  store?: MockStore
}

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

    it('В хэдере присутствует номер торговой точки', () => {
      expect(screen.getByText(/2002852/)).toBeInTheDocument()
    })

    it('В хэдере присутствует название и адрес торговой точки', () => {
      expect(screen.getByText(/Сармат/)).toBeInTheDocument()
      expect(screen.getByText(/Ханты-Мансийск/)).toBeInTheDocument()
      expect(screen.getByText(/Зябликова/)).toBeInTheDocument()
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
