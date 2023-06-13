import { PropsWithChildren } from 'react'

import { StatusCode } from '@sberauto/loanapplifecycledc-proto/public'
import { render, screen } from '@testing-library/react'

import { ApplicationFrontdc, fullApplicationData } from 'shared/api/requests/loanAppLifeCycleDc.mock'
import { ThemeProviderMock } from 'tests/mocks'

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

const createWrapper = ({ children }: PropsWithChildren) => <ThemeProviderMock>{children}</ThemeProviderMock>

describe('ActionAreaTest', () => {
  describe('Отображаются все элементы для каждого статуса', () => {
    it('Отображается название области экрана "Действие"', () => {
      render(
        <ActionArea
          status={StatusCode.INITIAL}
          application={fullApplicationData.application as ApplicationFrontdc}
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
            status={StatusCode.INITIAL}
            application={fullApplicationData.application as ApplicationFrontdc}
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
            status={StatusCode.INITIAL}
            application={fullApplicationData.application as ApplicationFrontdc}
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
            status={StatusCode.APPROVED}
            application={fullApplicationData.application as ApplicationFrontdc}
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
            status={StatusCode.FINALLY_APPROVED}
            application={fullApplicationData.application as ApplicationFrontdc}
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
            status={StatusCode.FORMATION}
            application={fullApplicationData.application as ApplicationFrontdc}
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
            status={StatusCode.CANCELED_DEAL}
            application={fullApplicationData.application as ApplicationFrontdc}
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
            status={StatusCode.CANCELED}
            application={fullApplicationData.application as ApplicationFrontdc}
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
            status={StatusCode.FINALLY_APPROVED}
            application={fullApplicationData.application as ApplicationFrontdc}
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
            status={StatusCode.ERROR}
            application={fullApplicationData.application as ApplicationFrontdc}
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
