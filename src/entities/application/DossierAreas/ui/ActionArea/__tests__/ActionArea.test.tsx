import React, { PropsWithChildren } from 'react'

import { StatusCode } from '@sberauto/loanapplifecycledc-proto/public'
import { render, screen } from '@testing-library/react'

import { ThemeProviderMock } from 'tests/mocks'

import { getMockedClientDossier } from '../../../__tests__/mocks/clientDetailedDossier.mock'
import { ActionArea } from '../ActionArea'

const mockedFileQuestionnaire = new File(['anketa'], 'anketa.png', {
  type: 'image/png',
})

jest.mock('entities/application/DossierAreas/ui/AgreementArea/AgreementArea', () => ({
  AgreementArea: () => <div data-testid="agreementArea" />,
}))
jest.mock('shared/ui/ProgressBar/ProgressBar', () => ({
  ProgressBar: () => <div data-testid="progressBar" />,
}))

const mockedDossier = getMockedClientDossier('1')

const createWrapper = ({ children }: PropsWithChildren) => <ThemeProviderMock>{children}</ThemeProviderMock>

describe('ActionAreaTest', () => {
  describe('Отображаются все элементы для каждого статуса', () => {
    it('Отображается название области экрана "Действие"', () => {
      render(
        <ActionArea
          clientDossier={mockedDossier}
          fileQuestionnaire={undefined}
          updateStatus={jest.fn}
          agreementDocs={[]}
          setAgreementDocs={jest.fn}
          setIsEditRequisitesMode={jest.fn}
        />,
        {
          wrapper: createWrapper,
        },
      )
      expect(screen.getByText('Действие')).toBeInTheDocument()
    })

    describe('Статус Initial (Черновик)', () => {
      it('Если файл анкеты отсутствует, отображатеся только кнопка "Редактировать"', () => {
        render(
          <ActionArea
            clientDossier={mockedDossier}
            fileQuestionnaire={undefined}
            updateStatus={jest.fn}
            agreementDocs={[]}
            setAgreementDocs={jest.fn}
            setIsEditRequisitesMode={jest.fn}
          />,
          {
            wrapper: createWrapper,
          },
        )

        expect(screen.getByText('Редактировать')).toBeInTheDocument()
      })

      it('Если файл анкеты присутствует, отображаются 2 кнопки', () => {
        render(
          <ActionArea
            clientDossier={mockedDossier}
            fileQuestionnaire={mockedFileQuestionnaire}
            updateStatus={jest.fn}
            agreementDocs={[]}
            setAgreementDocs={jest.fn}
            setIsEditRequisitesMode={jest.fn}
          />,
          {
            wrapper: createWrapper,
          },
        )

        expect(screen.getByText('Редактировать')).toBeInTheDocument()
        expect(screen.getByText('Отправить на решение')).toBeInTheDocument()
      })
    })

    describe('Статус Approved (Предварительно одобрен)', () => {
      it('Отображаются кнопки "Редактировать" и "Дозаполнить анкету"', () => {
        render(
          <ActionArea
            clientDossier={{ ...mockedDossier, status: StatusCode.STATUS_CODE_APPROVED }}
            fileQuestionnaire={undefined}
            updateStatus={jest.fn}
            agreementDocs={[]}
            setAgreementDocs={jest.fn}
            setIsEditRequisitesMode={jest.fn}
          />,
          {
            wrapper: createWrapper,
          },
        )

        expect(screen.getByText('Редактировать')).toBeInTheDocument()
        expect(screen.getByText('Дозаполнить анкету')).toBeInTheDocument()
      })
    })

    describe('Статус FinallyApproved (Кредит одобрен)', () => {
      it('Отображается блок "AgreementArea"', () => {
        render(
          <ActionArea
            clientDossier={{ ...mockedDossier, status: StatusCode.STATUS_CODE_FINALLY_APPROVED }}
            fileQuestionnaire={undefined}
            updateStatus={jest.fn}
            agreementDocs={[]}
            setAgreementDocs={jest.fn}
            setIsEditRequisitesMode={jest.fn}
          />,
          {
            wrapper: createWrapper,
          },
        )

        expect(screen.getByTestId('agreementArea')).toBeInTheDocument()
      })
    })

    describe('Статус Formation (Формирование КД)', () => {
      it('Отображается блок "AgreementArea"', () => {
        render(
          <ActionArea
            clientDossier={{ ...mockedDossier, status: StatusCode.STATUS_CODE_FORMATION }}
            fileQuestionnaire={undefined}
            updateStatus={jest.fn}
            agreementDocs={[]}
            setAgreementDocs={jest.fn}
            setIsEditRequisitesMode={jest.fn}
          />,
          {
            wrapper: createWrapper,
          },
        )

        expect(screen.getByTestId('agreementArea')).toBeInTheDocument()
      })
    })

    describe('Статус CanceledDeal (КД отменен)', () => {
      it('Отображается кнопка "Пересоздать заявку"', () => {
        render(
          <ActionArea
            clientDossier={{ ...mockedDossier, status: StatusCode.STATUS_CODE_CANCELED_DEAL }}
            fileQuestionnaire={undefined}
            updateStatus={jest.fn}
            agreementDocs={[]}
            setAgreementDocs={jest.fn}
            setIsEditRequisitesMode={jest.fn}
          />,
          {
            wrapper: createWrapper,
          },
        )

        expect(screen.getByText('Пересоздать заявку')).toBeInTheDocument()
      })
    })

    describe('Статус Canceled (Отменен)', () => {
      it('Отображается кнопка "Пересоздать заявку"', () => {
        render(
          <ActionArea
            clientDossier={{ ...mockedDossier, status: StatusCode.STATUS_CODE_CANCELED }}
            fileQuestionnaire={undefined}
            updateStatus={jest.fn}
            agreementDocs={[]}
            setAgreementDocs={jest.fn}
            setIsEditRequisitesMode={jest.fn}
          />,
          {
            wrapper: createWrapper,
          },
        )

        expect(screen.getByText('Пересоздать заявку')).toBeInTheDocument()
      })
    })

    describe('Статус Signed (КД подписан)', () => {
      it('Отображается блок "AgreementArea"', () => {
        render(
          <ActionArea
            clientDossier={{ ...mockedDossier, status: StatusCode.STATUS_CODE_FINALLY_APPROVED }}
            fileQuestionnaire={undefined}
            updateStatus={jest.fn}
            agreementDocs={[]}
            setAgreementDocs={jest.fn}
            setIsEditRequisitesMode={jest.fn}
          />,
          {
            wrapper: createWrapper,
          },
        )

        expect(screen.getByTestId('agreementArea')).toBeInTheDocument()
      })
    })

    describe('Статус Error (Ошибка)', () => {
      it('Отображается кнопка "Редактировать"', () => {
        render(
          <ActionArea
            clientDossier={{ ...mockedDossier, status: StatusCode.STATUS_CODE_ERROR }}
            fileQuestionnaire={undefined}
            updateStatus={jest.fn}
            agreementDocs={[]}
            setAgreementDocs={jest.fn}
            setIsEditRequisitesMode={jest.fn}
          />,
          {
            wrapper: createWrapper,
          },
        )

        expect(screen.getByText('Редактировать')).toBeInTheDocument()
      })
    })
  })
})
