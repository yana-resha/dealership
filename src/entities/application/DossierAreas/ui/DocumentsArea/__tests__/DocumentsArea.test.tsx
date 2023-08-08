import { PropsWithChildren } from 'react'

import { Scan, StatusCode } from '@sberauto/loanapplifecycledc-proto/public'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from 'react-query'

import * as useAppSelectorModule from 'shared/hooks/store/useAppSelector'
import { sleep } from 'shared/lib/sleep'
import { ThemeProviderMock } from 'tests/mocks'

import { DocumentsArea } from '../DocumentsArea'

const mockedFileAgreement = new File(['agreement'], 'Кредитный договор', {
  type: 'application/pdf',
})
const mockedFileExtra = new File(['extra'], 'Дополнительный документ', {
  type: 'application/pdf',
})

jest.mock('shared/ui/FileDownloader/FileDownloader', () => ({
  FileDownloader: () => <div data-testid="uploadFile" />,
}))
jest.mock('shared/ui/FileUploadButton/FileUploadButton', () => ({
  FileUploadButton: () => (
    <input type="file" data-testid="fileUploadButton" onChange={mockedSetQuestionnaire} />
  ),
}))
jest.mock('../../../__tests__/mocks/clientDetailedDossier.mock', () => ({
  getMockAgreement: async () => [mockedFileAgreement, mockedFileExtra],
}))

const mockedUseAppSelector = jest.spyOn(useAppSelectorModule, 'useAppSelector')
const emptyScans: Scan[] = []
const mockedScans = [
  {
    type: 1,
    name: 'logo192.png',
    extension: '.png',
  },
]

const queryClient = new QueryClient()
const mockedSetQuestionnaire = jest.fn()
const createWrapper = ({ children }: PropsWithChildren) => (
  <QueryClientProvider client={queryClient}>
    <ThemeProviderMock>{children}</ThemeProviderMock>
  </QueryClientProvider>
)

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
}))

describe('DocumentsAreaTest', () => {
  describe('Отображаются все элементы для каждого статуса', () => {
    beforeEach(() => {
      mockedUseAppSelector.mockImplementation(() => emptyScans)
    })
    it('Отображается название области экрана "Документы"', () => {
      render(
        <DocumentsArea
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
            agreementDocs={[mockedFileAgreement, mockedFileExtra]}
            setAgreementDocs={jest.fn}
            status={StatusCode.INITIAL}
          />,
          { wrapper: createWrapper },
        )

        fireEvent.change(screen.getByTestId('fileUploadButton'))
        expect(mockedSetQuestionnaire).toBeCalledTimes(1)
      })

      // TODO Расскомментировать и подправить, когда будут обновлены контракты
      it('Если анкета загружена, отображается анкета', async () => {
        mockedUseAppSelector.mockImplementation(() => mockedScans)
        render(
          <DocumentsArea
            agreementDocs={[mockedFileAgreement, mockedFileExtra]}
            setAgreementDocs={jest.fn}
            status={StatusCode.INITIAL}
          />,
          { wrapper: createWrapper },
        )
        expect(await screen.findByTestId('uploadFile')).toBeInTheDocument()
      })
    })

    describe('Отображаются все элементы для статусов Signed (КД Подписан) Authorized (Ожидание финансирования) и Financed (Кредит выдан)', () => {
      beforeEach(() => {
        mockedUseAppSelector.mockImplementation(() => mockedScans)
      })

      it('Отображаются 3 документа для статуса Authorized (Ожидание финансирования)', async () => {
        render(
          <DocumentsArea
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
      beforeEach(() => {
        mockedUseAppSelector.mockImplementation(() => mockedScans)
      })

      it('Отображается анкета для статуса Processed (Ожидает решения)', async () => {
        render(
          <DocumentsArea
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
