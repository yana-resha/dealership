import { PropsWithChildren } from 'react'

import { StatusCode } from '@sberauto/loanapplifecycledc-proto/public'
import { render, screen } from '@testing-library/react'

import * as useGetFullApplicationQueryModule from 'shared/api/requests/loanAppLifeCycleDc'
import { fullApplicationData } from 'shared/api/requests/loanAppLifeCycleDc.mock'
import { ThemeProviderMock } from 'tests/mocks'

import { ClientDetailedDossier } from '../ClientDetailedDossier'

const mockedClientDossier = {
  status: StatusCode.INITIAL,
}

const mockedFileQuestionnaire = new File(['questionnaire'], 'Анкета', {
  type: 'application/pdf',
})

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

const createWrapper = ({ children }: PropsWithChildren) => <ThemeProviderMock>{children}</ThemeProviderMock>

describe('ClientDetailedDossierTest', () => {
  describe('Отображаются все области экрана', () => {
    beforeEach(() => {
      mockedUseGetFullApplicationQuery.mockImplementation(
        () =>
          ({
            data: fullApplicationData,
          } as any),
      )
      render(<ClientDetailedDossier applicationId="1" onBackButton={jest.fn} />, { wrapper: createWrapper })
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
