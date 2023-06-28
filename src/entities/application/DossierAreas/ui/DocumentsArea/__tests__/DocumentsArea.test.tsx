import React, { PropsWithChildren } from 'react'

import { StatusCode } from '@sberauto/loanapplifecycledc-proto/public'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import { ThemeProviderMock } from 'tests/mocks'

import { DocumentsArea } from '../DocumentsArea'

const mockedFileQuestionnaire = new File(['questionnaire'], 'Анкета', {
  type: 'application/pdf',
})
const mockedFileAgreement = new File(['agreement'], 'Кредитный договор', {
  type: 'application/pdf',
})
const mockedFileExtra = new File(['extra'], 'Дополнительный документ', {
  type: 'application/pdf',
})

jest.mock('shared/ui/UploadFile/UploadFile', () => ({
  UploadFile: () => <div data-testid="uploadFile" />,
}))
jest.mock('shared/ui/FileUploadButton/FileUploadButton', () => ({
  FileUploadButton: () => (
    <input type="file" data-testid="fileUploadButton" onChange={mockedSetQuestionnaire} />
  ),
}))
jest.mock('../../../__tests__/mocks/clientDetailedDossier.mock', () => ({
  getMockAgreement: async () => [mockedFileAgreement, mockedFileExtra],
}))
const mockedSetQuestionnaire = jest.fn()
const createWrapper = ({ children }: PropsWithChildren) => <ThemeProviderMock>{children}</ThemeProviderMock>

describe('DocumentsAreaTest', () => {
  describe('Отображаются все элементы для каждого статуса', () => {
    it('Отображается название области экрана "Документы"', () => {
      render(
        <DocumentsArea
          fileQuestionnaire={undefined}
          setQuestionnaire={mockedSetQuestionnaire}
          agreementDocs={[mockedFileAgreement, mockedFileExtra]}
          setAgreementDocs={jest.fn}
          status={StatusCode.INITIAL}
        />,
        { wrapper: createWrapper },
      )

      expect(screen.getByText('Документы')).toBeInTheDocument()
    })

    describe('Отображаются все элементы для статуса Initial (Черновик)', () => {
      it('Если анкета не загружена, отображается кнопка для загрузки анкеты', () => {
        render(
          <DocumentsArea
            fileQuestionnaire={undefined}
            setQuestionnaire={mockedSetQuestionnaire}
            agreementDocs={[mockedFileAgreement, mockedFileExtra]}
            setAgreementDocs={jest.fn}
            status={StatusCode.INITIAL}
          />,
          { wrapper: createWrapper },
        )

        expect(screen.getByTestId('fileUploadButton')).toBeInTheDocument()
      })

      it('При загрузке анкеты выполняется ее сохранение', () => {
        render(
          <DocumentsArea
            fileQuestionnaire={undefined}
            setQuestionnaire={mockedSetQuestionnaire}
            agreementDocs={[mockedFileAgreement, mockedFileExtra]}
            setAgreementDocs={jest.fn}
            status={StatusCode.INITIAL}
          />,
          { wrapper: createWrapper },
        )

        fireEvent.change(screen.getByTestId('fileUploadButton'))
        expect(mockedSetQuestionnaire).toBeCalledTimes(1)
      })

      it('Если анкета загружена, отображается анкета', () => {
        render(
          <DocumentsArea
            fileQuestionnaire={mockedFileQuestionnaire}
            setQuestionnaire={mockedSetQuestionnaire}
            agreementDocs={[mockedFileAgreement, mockedFileExtra]}
            setAgreementDocs={jest.fn}
            status={StatusCode.INITIAL}
          />,
          { wrapper: createWrapper },
        )

        expect(screen.getByTestId('uploadFile')).toBeInTheDocument()
      })
    })

    describe('Отображаются все элементы для статусов Signed (КД Подписан) Authorized (Ожидание финансирования) и Financed (Кредит выдан)', () => {
      it('Отображаются 3 документа для статуса Authorized (Ожидание финансирования)', async () => {
        render(
          <DocumentsArea
            fileQuestionnaire={mockedFileQuestionnaire}
            setQuestionnaire={mockedSetQuestionnaire}
            agreementDocs={[mockedFileAgreement, mockedFileExtra]}
            setAgreementDocs={jest.fn}
            status={StatusCode.AUTHORIZED}
          />,
          { wrapper: createWrapper },
        )

        await waitFor(async () => expect(await screen.findAllByTestId('uploadFile')).toHaveLength(3))
      })

      it('Отображаются 3 документа для статуса Financed (Financed)', async () => {
        render(
          <DocumentsArea
            fileQuestionnaire={mockedFileQuestionnaire}
            setQuestionnaire={mockedSetQuestionnaire}
            agreementDocs={[mockedFileAgreement, mockedFileExtra]}
            setAgreementDocs={jest.fn}
            status={StatusCode.ISSUED}
          />,
          { wrapper: createWrapper },
        )

        await waitFor(async () => expect(await screen.findAllByTestId('uploadFile')).toHaveLength(3))
      })

      it('Отображаются 3 документа для статуса Signed (КД Подписан)', async () => {
        render(
          <DocumentsArea
            fileQuestionnaire={mockedFileQuestionnaire}
            setQuestionnaire={mockedSetQuestionnaire}
            agreementDocs={[mockedFileAgreement, mockedFileExtra]}
            setAgreementDocs={jest.fn}
            status={StatusCode.SIGNED}
          />,
          { wrapper: createWrapper },
        )

        await waitFor(async () => expect(await screen.findAllByTestId('uploadFile')).toHaveLength(3))
      })
    })

    describe('Отображается только анкета для всех остальных статусов', () => {
      it('Отображается анкета для статуса Processed (Ожидает решения)', async () => {
        render(
          <DocumentsArea
            fileQuestionnaire={mockedFileQuestionnaire}
            setQuestionnaire={mockedSetQuestionnaire}
            agreementDocs={[mockedFileAgreement, mockedFileExtra]}
            setAgreementDocs={jest.fn}
            status={StatusCode.PROCESSED}
          />,
          { wrapper: createWrapper },
        )

        expect(await screen.findByTestId('uploadFile')).toBeInTheDocument()
      })

      it('Отображается анкета для статуса Approved (Предварительно одобрено)', async () => {
        render(
          <DocumentsArea
            fileQuestionnaire={mockedFileQuestionnaire}
            setQuestionnaire={mockedSetQuestionnaire}
            agreementDocs={[mockedFileAgreement, mockedFileExtra]}
            setAgreementDocs={jest.fn}
            status={StatusCode.APPROVED}
          />,
          { wrapper: createWrapper },
        )

        expect(await screen.findByTestId('uploadFile')).toBeInTheDocument()
      })

      it('Отображается анкета для статуса FinallyApproved (Кредит одобрен)', async () => {
        render(
          <DocumentsArea
            fileQuestionnaire={mockedFileQuestionnaire}
            setQuestionnaire={mockedSetQuestionnaire}
            agreementDocs={[mockedFileAgreement, mockedFileExtra]}
            setAgreementDocs={jest.fn}
            status={StatusCode.FINALLY_APPROVED}
          />,
          { wrapper: createWrapper },
        )

        expect(await screen.findByTestId('uploadFile')).toBeInTheDocument()
      })

      it('Отображается анкета для статуса Formation (Формирование КД)', async () => {
        render(
          <DocumentsArea
            fileQuestionnaire={mockedFileQuestionnaire}
            setQuestionnaire={mockedSetQuestionnaire}
            agreementDocs={[mockedFileAgreement, mockedFileExtra]}
            setAgreementDocs={jest.fn}
            status={StatusCode.FORMATION}
          />,
          { wrapper: createWrapper },
        )

        expect(await screen.findByTestId('uploadFile')).toBeInTheDocument()
      })

      it('Отображается анкета для статуса Rejected (Отказ)', async () => {
        render(
          <DocumentsArea
            fileQuestionnaire={mockedFileQuestionnaire}
            setQuestionnaire={mockedSetQuestionnaire}
            agreementDocs={[mockedFileAgreement, mockedFileExtra]}
            setAgreementDocs={jest.fn}
            status={StatusCode.REJECTED}
          />,
          { wrapper: createWrapper },
        )

        expect(await screen.findByTestId('uploadFile')).toBeInTheDocument()
      })

      it('Отображается анкета для статуса CanceledDeal (КД отменен)', async () => {
        render(
          <DocumentsArea
            fileQuestionnaire={mockedFileQuestionnaire}
            setQuestionnaire={mockedSetQuestionnaire}
            agreementDocs={[mockedFileAgreement, mockedFileExtra]}
            setAgreementDocs={jest.fn}
            status={StatusCode.CANCELED_DEAL}
          />,
          { wrapper: createWrapper },
        )
      })

      it('Отображается анкета для статуса Canceled (Отменен)', async () => {
        render(
          <DocumentsArea
            fileQuestionnaire={mockedFileQuestionnaire}
            setQuestionnaire={mockedSetQuestionnaire}
            agreementDocs={[mockedFileAgreement, mockedFileExtra]}
            setAgreementDocs={jest.fn}
            status={StatusCode.CANCELED}
          />,
          { wrapper: createWrapper },
        )

        expect(await screen.findByTestId('uploadFile')).toBeInTheDocument()
      })

      it('Отображается анкета для статуса Error (Ошибка)', async () => {
        render(
          <DocumentsArea
            fileQuestionnaire={mockedFileQuestionnaire}
            setQuestionnaire={mockedSetQuestionnaire}
            agreementDocs={[mockedFileAgreement, mockedFileExtra]}
            setAgreementDocs={jest.fn}
            status={StatusCode.ERROR}
          />,
          { wrapper: createWrapper },
        )

        expect(await screen.findByTestId('uploadFile')).toBeInTheDocument()
      })
    })
  })
})
