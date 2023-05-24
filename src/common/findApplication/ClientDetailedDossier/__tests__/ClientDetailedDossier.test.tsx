import { PropsWithChildren } from 'react'

import { StatusCode } from '@sberauto/loanapplifecycledc-proto/public'
import { render, screen } from '@testing-library/react'

import { ThemeProviderMock } from 'tests/mocks'

import { ClientDetailedDossier } from '../ClientDetailedDossier'

const mockedClientDossier = {
  status: StatusCode.STATUS_CODE_INITIAL,
}

const mockedFileQuestionnaire = new File(['questionnaire'], 'Анкета', {
  type: 'application/pdf',
})

jest.mock('entities/application/DossierAreas/DossierIdArea/DossierIdArea', () => ({
  DossierIdArea: () => <div data-testid="DossierIdArea" />,
}))
jest.mock('entities/application/DossierAreas/InformationArea/InformationArea', () => ({
  InformationArea: () => <div data-testid="InformationArea" />,
}))
jest.mock('entities/application/DossierAreas/DocumentsArea/DocumentsArea', () => ({
  DocumentsArea: () => <div data-testid="DocumentsArea" />,
}))
jest.mock('entities/application/DossierAreas/ActionArea/ActionArea', () => ({
  ActionArea: () => <div data-testid="ActionArea" />,
}))

jest.mock('entities/application/DossierAreas/__tests__/mocks/clientDetailedDossier.mock', () => ({
  getMockedClientDossier: (applicationId: string) => mockedClientDossier,
  getMockQuestionnaire: async (applicationId: string) => mockedFileQuestionnaire,
}))

const createWrapper = ({ children }: PropsWithChildren) => <ThemeProviderMock>{children}</ThemeProviderMock>

describe('ClientDetailedDossierTest', () => {
  describe('Отображаются все области экрана', () => {
    it('Отображается область DossierIdArea', () => {
      render(<ClientDetailedDossier applicationId="1" onBackButton={jest.fn} />, { wrapper: createWrapper })

      expect(screen.getByTestId('DossierIdArea')).toBeInTheDocument()
    })

    it('Отображается область InformationArea', () => {
      render(<ClientDetailedDossier applicationId="1" onBackButton={jest.fn} />, { wrapper: createWrapper })

      expect(screen.getByTestId('InformationArea')).toBeInTheDocument()
    })

    it('Отображается область DocumentsArea', () => {
      render(<ClientDetailedDossier applicationId="1" onBackButton={jest.fn} />, { wrapper: createWrapper })

      expect(screen.getByTestId('DocumentsArea')).toBeInTheDocument()
    })

    it('Отображается область ActionArea', () => {
      render(<ClientDetailedDossier applicationId="1" onBackButton={jest.fn} />, { wrapper: createWrapper })

      expect(screen.getByTestId('ActionArea')).toBeInTheDocument()
    })
  })
})
