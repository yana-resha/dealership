import React, { PropsWithChildren } from 'react'

import { StatusCode } from '@sberauto/loanapplifecycledc-proto/public'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { ThemeProviderMock } from 'tests/mocks'

import { DossierIdArea } from '../DossierIdArea'

const mockedClientDossier = {
  status: StatusCode.INITIAL,
  applicationNumber: '545544',
  clientName: 'Терентьев Михаил Павлович',
  passport: '0604060423',
}

jest.mock('@mui/material/IconButton', () => ({ onClick }: any) => (
  <div data-testid="backButton" onClick={onClick} />
))
jest.mock('entities/application/ApplicationStatus/ApplicationStatus', () => ({
  ApplicationStatus: () => <div data-testid="applicationStatus" />,
}))

const mockedOnBackButton = jest.fn()

const createWrapper = ({ children }: PropsWithChildren) => <ThemeProviderMock>{children}</ThemeProviderMock>

describe('DossierIdTest', () => {
  describe('Все элементы компонента отображаются', () => {
    it('Отображается кнопка "Назад"', () => {
      render(<DossierIdArea clientDossier={mockedClientDossier} onBackButton={mockedOnBackButton} />, {
        wrapper: createWrapper,
      })

      expect(screen.getByTestId('backButton')).toBeInTheDocument()
    })

    it('При нажатии на кнопку "Назад" выполняется переход', () => {
      render(<DossierIdArea clientDossier={mockedClientDossier} onBackButton={mockedOnBackButton} />, {
        wrapper: createWrapper,
      })

      userEvent.click(screen.getByTestId('backButton'))
      expect(mockedOnBackButton).toBeCalledTimes(1)
    })

    it('Отображается номер заявки', () => {
      render(<DossierIdArea clientDossier={mockedClientDossier} onBackButton={mockedOnBackButton} />, {
        wrapper: createWrapper,
      })

      expect(screen.getByText('№ 545544')).toBeInTheDocument()
    })

    it('Отображается статус', () => {
      render(<DossierIdArea clientDossier={mockedClientDossier} onBackButton={mockedOnBackButton} />, {
        wrapper: createWrapper,
      })

      expect(screen.getByTestId('applicationStatus')).toBeInTheDocument()
    })

    it('Отображается ФИО', () => {
      render(<DossierIdArea clientDossier={mockedClientDossier} onBackButton={mockedOnBackButton} />, {
        wrapper: createWrapper,
      })

      expect(screen.getByText('Терентьев Михаил Павлович')).toBeInTheDocument()
    })

    it('Отображается серия и номер паспорта', () => {
      render(<DossierIdArea clientDossier={mockedClientDossier} onBackButton={mockedOnBackButton} />, {
        wrapper: createWrapper,
      })

      expect(screen.getByText('06 04 060423')).toBeInTheDocument()
    })
  })
})
