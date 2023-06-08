import { render, screen } from '@testing-library/react'

import { MockProviders } from 'tests/mocks'
import { disableConsole } from 'tests/utils'

import { PointOfSaleAuth } from '../PointOfSaleAuth'

jest.mock('shared/api/requests/authdc', () => ({
  useGetUserQuery: () => ({ data: { firstName: 'firstName', lastName: 'lastName' } }),
}))
jest.mock('common/auth', () => ({
  useLogout: () => ({ onLogout: jest.fn() }),
}))
jest.mock('entities/pointOfSale')

disableConsole('error')

describe('PointOfSaleAuthTest', () => {
  describe('Все элементы отображаются на форме', () => {
    beforeEach(() => {
      render(<PointOfSaleAuth />, { wrapper: MockProviders })
    })

    it('Отображается кнопка назад', () => {
      expect(screen.getByTestId('backButton')).toBeInTheDocument()
    })

    it('Отображается текст "Выберите автосалон"', () => {
      expect(screen.getByText('Выберите автосалон')).toBeInTheDocument()
    })

    it('Отображается форма выбора автосалона', () => {
      expect(screen.getByTestId('choosePoint')).toBeInTheDocument()
    })
  })
})
