import React, { PropsWithChildren } from 'react'

import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import { ThemeProviderMock } from 'tests/mocks'

import { PreparedStatus } from '../../../application.utils'
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
jest.mock('../../__tests__/mocks/clientDetailedDossier.mock', () => ({
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
          status={PreparedStatus.initial}
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
            status={PreparedStatus.initial}
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
            status={PreparedStatus.initial}
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
            status={PreparedStatus.initial}
          />,
          { wrapper: createWrapper },
        )

        expect(screen.getByTestId('uploadFile')).toBeInTheDocument()
      })
    })

    describe('Отображаются все элементы для статусов Authorized (Ожидание финансирования) и Financed (Кредит выдан)', () => {
      it('Отображаются 3 документа для статуса Authorized (Ожидание финансирования)', async () => {
        render(
          <DocumentsArea
            fileQuestionnaire={mockedFileQuestionnaire}
            setQuestionnaire={mockedSetQuestionnaire}
            status={PreparedStatus.authorized}
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
            status={PreparedStatus.financed}
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
            status={PreparedStatus.processed}
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
            status={PreparedStatus.approved}
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
            status={PreparedStatus.finallyApproved}
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
            status={PreparedStatus.formation}
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
            status={PreparedStatus.rejected}
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
            status={PreparedStatus.canceledDeal}
          />,
          { wrapper: createWrapper },
        )
      })

      it('Отображается анкета для статуса Canceled (Отменен)', async () => {
        render(
          <DocumentsArea
            fileQuestionnaire={mockedFileQuestionnaire}
            setQuestionnaire={mockedSetQuestionnaire}
            status={PreparedStatus.canceled}
          />,
          { wrapper: createWrapper },
        )

        expect(await screen.findByTestId('uploadFile')).toBeInTheDocument()
      })

      it('Отображается анкета для статуса Signed (КД подписан)', async () => {
        render(
          <DocumentsArea
            fileQuestionnaire={mockedFileQuestionnaire}
            setQuestionnaire={mockedSetQuestionnaire}
            status={PreparedStatus.signed}
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
            status={PreparedStatus.error}
          />,
          { wrapper: createWrapper },
        )

        expect(await screen.findByTestId('uploadFile')).toBeInTheDocument()
      })
    })
  })
})
