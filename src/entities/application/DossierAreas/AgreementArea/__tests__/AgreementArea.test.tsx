import React, { PropsWithChildren } from 'react'

import { StatusCode } from '@sberauto/loanapplifecycledc-proto/public'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { ThemeProviderMock } from 'tests/mocks'

import { getMockedClientDossier } from '../../__tests__/mocks/clientDetailedDossier.mock'
import { AgreementArea } from '../AgreementArea'

const mockedAgreementDocs = [
  new File(['agreement'], 'Кредитный договор', {
    type: 'application/pdf',
  }),
  new File(['extra'], 'Дополнительный документ', {
    type: 'application/pdf',
  }),
]

jest.mock('shared/ui/ProgressBar/ProgressBar', () => ({
  ProgressBar: () => <div data-testid="progressBar" />,
}))
jest.mock('shared/ui/UploadFile/UploadFile', () => ({
  UploadFile: ({ onClick }: any) => <div data-testid="uploadFile" onClick={onClick} />,
}))
jest.mock('../../RequisitesArea/RequisitesArea', () => ({
  RequisitesArea: () => <div data-testid="requisitesArea" />,
}))
jest.mock('../../__tests__/mocks/clientDetailedDossier.mock', () => ({
  ...jest.requireActual('../../__tests__/mocks/clientDetailedDossier.mock'),
  getMockAgreement: async () => mockedAgreementDocs,
}))
window.HTMLElement.prototype.scrollIntoView = jest.fn()

const mockUpdateStatus = jest.fn()
const mockSetAgreementDocs = jest.fn()
const mockedDossier = getMockedClientDossier('1')

const createWrapper = ({ children }: PropsWithChildren) => <ThemeProviderMock>{children}</ThemeProviderMock>

describe('AgreementAreaTest', () => {
  describe('На каждом шаге отображаются все элементы', () => {
    it('Отображается ProgressBar', () => {
      render(
        <AgreementArea
          clientDossier={mockedDossier}
          updateStatus={mockUpdateStatus}
          agreementDocs={mockedAgreementDocs}
          setAgreementDocs={mockSetAgreementDocs}
        />,
        {
          wrapper: createWrapper,
        },
      )
      expect(screen.getByTestId('progressBar')).toBeInTheDocument()
    })

    describe('Отображаются все элементы на 1-м шаге для статуса FinallyApproved (Кредит одобрен)', () => {
      beforeEach(() => {
        render(
          <AgreementArea
            clientDossier={{ ...mockedDossier, status: StatusCode.STATUS_CODE_FINALLY_APPROVED }}
            updateStatus={mockUpdateStatus}
            agreementDocs={mockedAgreementDocs}
            setAgreementDocs={mockSetAgreementDocs}
          />,
          {
            wrapper: createWrapper,
          },
        )
      })

      it('Отображается кнопка "Редактировать"', () => {
        expect(screen.getByText('Редактировать')).toBeInTheDocument()
      })

      it('Отображается кнопка ""Сформировать договор', () => {
        expect(screen.getByText('Сформировать договор')).toBeInTheDocument()
      })

      it('После нажатия на "Сформировать договор" заявке присваивается статус "Формирование КД"', () => {
        userEvent.click(screen.getByText('Сформировать договор'))
        expect(mockUpdateStatus).toBeCalledTimes(1)
      })
    })

    describe('Отображается все элементы на 2-м шаге для статуса Formation (Формирование КД)', () => {
      it('Отсутствует кнопка "Редактировать"', () => {
        render(
          <AgreementArea
            clientDossier={{ ...mockedDossier, status: StatusCode.STATUS_CODE_FORMATION }}
            updateStatus={mockUpdateStatus}
            agreementDocs={mockedAgreementDocs}
            setAgreementDocs={mockSetAgreementDocs}
          />,
          {
            wrapper: createWrapper,
          },
        )
        expect(screen.queryByText('Редактировать')).not.toBeInTheDocument()
      })

      it('Отображаются один плейсхолдер документа, пока они загружаются', async () => {
        render(
          <AgreementArea
            clientDossier={{ ...mockedDossier, status: StatusCode.STATUS_CODE_FORMATION }}
            updateStatus={mockUpdateStatus}
            agreementDocs={mockedAgreementDocs}
            setAgreementDocs={mockSetAgreementDocs}
          />,
          {
            wrapper: createWrapper,
          },
        )
        expect(await screen.findAllByTestId('uploadFile')).toHaveLength(1)
      })
    })

    it('Отображается 2 документа после загрузки', async () => {
      render(
        <AgreementArea
          clientDossier={{ ...mockedDossier, status: StatusCode.STATUS_CODE_FORMATION }}
          updateStatus={mockUpdateStatus}
          agreementDocs={mockedAgreementDocs}
          setAgreementDocs={mockSetAgreementDocs}
        />,
        {
          wrapper: createWrapper,
        },
      )
      await waitFor(async () => expect(await screen.findAllByTestId('uploadFile')).toHaveLength(2))
    })

    it('После загрузки документов отображается кнопка "Вернуться..."', async () => {
      render(
        <AgreementArea
          clientDossier={{ ...mockedDossier, status: StatusCode.STATUS_CODE_FORMATION }}
          updateStatus={mockUpdateStatus}
          agreementDocs={mockedAgreementDocs}
          setAgreementDocs={mockSetAgreementDocs}
        />,
        {
          wrapper: createWrapper,
        },
      )
      await waitFor(async () =>
        expect(await screen.findByText('Вернуться на формирование договора')).toBeInTheDocument(),
      )
    })

    describe('Отображаются все элементы на 3-м шаге', () => {
      it('После клика по документам появляются свитчи', async () => {
        render(
          <AgreementArea
            clientDossier={{ ...mockedDossier, status: StatusCode.STATUS_CODE_FORMATION }}
            updateStatus={mockUpdateStatus}
            agreementDocs={mockedAgreementDocs}
            setAgreementDocs={mockSetAgreementDocs}
          />,
          {
            wrapper: createWrapper,
          },
        )

        await waitFor(async () => expect(await screen.findAllByTestId('uploadFile')).toHaveLength(2))
        const documents = await screen.findAllByTestId('uploadFile')
        userEvent.click(documents[0])
        userEvent.click(documents[1])
        expect(await screen.findAllByText('Подписан')).toHaveLength(2)
      })

      it('После подтверждения подписания документов заявке присваивается статус "КД Подписан"', async () => {
        render(
          <AgreementArea
            clientDossier={{ ...mockedDossier, status: StatusCode.STATUS_CODE_FORMATION }}
            updateStatus={mockUpdateStatus}
            agreementDocs={mockedAgreementDocs}
            setAgreementDocs={mockSetAgreementDocs}
          />,
          {
            wrapper: createWrapper,
          },
        )

        await waitFor(async () => expect(await screen.findAllByTestId('uploadFile')).toHaveLength(2))
        const documents = await screen.findAllByTestId('uploadFile')
        userEvent.click(documents[0])
        userEvent.click(documents[1])
        const switches = await screen.findAllByText('Подписан')
        userEvent.click(screen.getByText('Согласен'))
        userEvent.click(switches[0])
        userEvent.click(switches[1])
        expect(mockUpdateStatus).toBeCalledTimes(1)
      })
    })

    describe('Отображаются все элементы на 4-м шаге', () => {
      it('После подтверждения подписания документов отображаются реквизиты', async () => {
        render(
          <AgreementArea
            clientDossier={{ ...mockedDossier, status: StatusCode.STATUS_CODE_SIGNED }}
            updateStatus={mockUpdateStatus}
            agreementDocs={mockedAgreementDocs}
            setAgreementDocs={mockSetAgreementDocs}
          />,
          {
            wrapper: createWrapper,
          },
        )

        expect(screen.getByTestId('requisitesArea')).toBeInTheDocument()
      })
    })
  })
})
