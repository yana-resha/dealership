import { PropsWithChildren } from 'react'

import { StatusCode } from '@sberauto/loanapplifecycledc-proto/public'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { ThemeProviderMock } from 'tests/mocks'

import { DossierIdArea } from '../DossierIdArea'

jest.mock('@mui/material/IconButton', () => ({ onClick }: any) => (
  <div data-testid="backButton" onClick={onClick} />
))
jest.mock('entities/application/ApplicationStatus/ApplicationStatus', () => ({
  ApplicationStatus: () => <div data-testid="applicationStatus" />,
}))

const mockedOnBackButton = jest.fn()

const dossierIdAreaProps = {
  dcAppId: '545544',
  appId: '4444444',
  clientName: 'Терентьев Михаил Павлович',
  passport: '06 04 060423',
  data: '2022-12-31T00:00:00.000Z',
  status: StatusCode.INITIAL,
  onBackButton: mockedOnBackButton,
}

const createWrapper = ({ children }: PropsWithChildren) => <ThemeProviderMock>{children}</ThemeProviderMock>

describe('DossierIdTest', () => {
  describe('Все элементы компонента отображаются', () => {
    beforeEach(() => {
      render(<DossierIdArea {...dossierIdAreaProps} />, {
        wrapper: createWrapper,
      })
    })

    it('Отображается кнопка "Назад"', () => {
      expect(screen.getByTestId('backButton')).toBeInTheDocument()
    })

    it('При нажатии на кнопку "Назад" выполняется переход', () => {
      userEvent.click(screen.getByTestId('backButton'))
      expect(mockedOnBackButton).toBeCalledTimes(1)
    })

    it('Отображается номер заявки', () => {
      expect(screen.getByText('№ 545544')).toBeInTheDocument()
    })

    it('Отображается номер appId', () => {
      expect(screen.getByText('4444444')).toBeInTheDocument()
    })

    it('Отображается статус', () => {
      expect(screen.getByTestId('applicationStatus')).toBeInTheDocument()
    })

    it('Отображается ФИО', () => {
      expect(screen.getByText('Терентьев Михаил Павлович')).toBeInTheDocument()
    })

    it('Отображается серия и номер паспорта', () => {
      expect(screen.getByText('06 04 060423')).toBeInTheDocument()
    })

    it('Отображается дата', () => {
      expect(screen.getByText('31.12.2022')).toBeInTheDocument()
    })
  })
})
