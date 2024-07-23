import { PropsWithChildren } from 'react'

import { Vendor } from '@sberauto/dictionarydc-proto/public'
import { DocumentType, StatusCode } from '@sberauto/loanapplifecycledc-proto/public'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MockStore } from 'redux-mock-store'

import * as useAgreementDocsModule from 'pages/ClientDetailedDossier/hooks/useAgreementDocs'
import { fullApplicationData } from 'shared/api/requests/loanAppLifeCycleDc.mock'
import * as useAppSelectorModule from 'shared/hooks/store/useAppSelector'
import { MockProviders } from 'tests/mocks'

import { AgreementArea } from '../AgreementArea'

const mockedVendor: Vendor = {
  vendorCode: '2002703288',
}
const mockedUseAppSelector = jest.spyOn(useAppSelectorModule, 'useAppSelector')

jest.mock('shared/ui/ProgressBar/ProgressBar', () => ({
  ProgressBar: () => <div data-testid="progressBar" />,
}))
jest.mock('shared/ui/FileDownloader/FileDownloader', () => ({
  FileDownloader: ({ onClick }: any) => <div data-testid="uploadFile" onClick={onClick} />,
}))
jest.mock('../RequisitesArea/RequisitesArea', () => ({
  RequisitesArea: () => <div data-testid="requisitesArea" />,
}))
jest.mock('entities/pointOfSale', () => ({
  getPointOfSaleFromCookies: () => mockedVendor,
}))
window.HTMLElement.prototype.scrollIntoView = jest.fn()

const mockUpdateStatus = jest.fn()
const mockUpdateStatusLocally = jest.fn()
jest.mock('shared/api/requests/loanAppLifeCycleDc', () => ({
  ...jest.requireActual('shared/api/requests/loanAppLifeCycleDc'),
  useUpdateApplicationStatusMutation: () => ({
    mutate: mockUpdateStatus,
    isLoading: false,
  }),
  useFormContractMutation: () => ({
    mutateAsync: () => Promise.resolve({ success: true }),

    isLoading: false,
  }),
}))
jest.mock('features/ApplicationFileLoader/hooks/useCheckDocumentsList', () => ({
  ...jest.requireActual('features/ApplicationFileLoader/hooks/useCheckDocumentsList'),
  useCheckDocumentsList: () => ({
    checkApplicationDocumentsList: () => Promise.resolve(),
  }),
}))

const mockedUseAgreementDocs = jest.spyOn(useAgreementDocsModule, 'useAgreementDocs')

interface WrapperProps extends PropsWithChildren {
  store?: MockStore
}

const createWrapper = ({ store, children }: WrapperProps) => (
  <MockProviders mockStore={store}>{children}</MockProviders>
)

describe('AgreementAreaTest', () => {
  beforeEach(() => {
    mockedUseAppSelector.mockImplementation(() => fullApplicationData.application)
    mockedUseAgreementDocs.mockImplementation(() => ({
      uploadedAgreementScans: [
        {
          type: DocumentType.CREDIT_CONTRACT,
          extension: '.pdf',
          name: 'Договор (ИУК).pdf',
        },
        {
          type: DocumentType.ACCOUNT_OPEN_FORM,
          extension: '.pdf',
          name: 'Заявление на открытие счёта.pdf',
        },
        {
          type: DocumentType.STATEMENT_FORM,
          extension: '.pdf',
          name: 'Заявление на выдачу кредита.pdf',
        },
      ],
      uploadedAdditionalAgreementScans: [],
      agreementDocs: [
        {
          documentType: DocumentType.CREDIT_CONTRACT,
          dcAppId: fullApplicationData.application?.dcAppId || '',
          name: 'Договор (ИУК).pdf',
        },
        {
          documentType: DocumentType.ACCOUNT_OPEN_FORM,
          dcAppId: fullApplicationData.application?.dcAppId || '',
          name: 'Заявление на открытие счёта.pdf',
        },
        {
          documentType: DocumentType.STATEMENT_FORM,
          dcAppId: fullApplicationData.application?.dcAppId || '',
          name: 'Заявление на выдачу кредита.pdf',
        },
      ],
    }))
  })
  describe('На каждом шаге отображаются все элементы', () => {
    it('Отображается ProgressBar', () => {
      render(
        <AgreementArea
          status={StatusCode.INITIAL}
          updateApplicationStatusLocally={mockUpdateStatusLocally}
          setIsEditRequisitesMode={jest.fn}
          closeConfirmationModal={jest.fn}
          isConfirmationModalVisible={false}
          editApplication={jest.fn}
          onSendToFinancing={jest.fn}
          isSendLoading={false}
        />,
        {
          wrapper: createWrapper,
        },
      )
      expect(screen.getByTestId('progressBar')).toBeInTheDocument()
    })

    describe('Отображаются все элементы на 1-м шаге для статуса FinallyApproved (Кредит одобрен)', () => {
      beforeEach(() => {
        mockedUseAppSelector.mockImplementation(() => fullApplicationData.application)
        render(
          <AgreementArea
            status={StatusCode.FINALLY_APPROVED}
            updateApplicationStatusLocally={mockUpdateStatusLocally}
            setIsEditRequisitesMode={jest.fn}
            closeConfirmationModal={jest.fn}
            isConfirmationModalVisible={false}
            editApplication={jest.fn}
            onSendToFinancing={jest.fn}
            isSendLoading={false}
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
        expect(mockUpdateStatus).toBeCalledTimes(0)
        expect(mockUpdateStatusLocally).toBeCalledTimes(1)
      })
    })

    describe('Отображается все элементы на 2-м шаге для статуса Formation (Формирование КД)', () => {
      beforeEach(() => {
        mockedUseAppSelector.mockImplementation(() => fullApplicationData.application)
        render(
          <AgreementArea
            status={StatusCode.FORMATION}
            updateApplicationStatusLocally={mockUpdateStatusLocally}
            setIsEditRequisitesMode={jest.fn}
            closeConfirmationModal={jest.fn}
            isConfirmationModalVisible={false}
            editApplication={jest.fn}
            onSendToFinancing={jest.fn}
            isSendLoading={false}
          />,
          {
            wrapper: createWrapper,
          },
        )
      })
      it('Отсутствует кнопка "Редактировать"', () => {
        expect(screen.queryByText('Редактировать')).not.toBeInTheDocument()
      })
    })

    it('Отображается 3 документа после загрузки', async () => {
      render(
        <AgreementArea
          status={StatusCode.FORMATION}
          updateApplicationStatusLocally={mockUpdateStatusLocally}
          setIsEditRequisitesMode={jest.fn}
          closeConfirmationModal={jest.fn}
          isConfirmationModalVisible={false}
          editApplication={jest.fn}
          onSendToFinancing={jest.fn}
          isSendLoading={false}
        />,
        {
          wrapper: createWrapper,
        },
      )
      await waitFor(async () => expect(await screen.findAllByTestId('uploadFile')).toHaveLength(3))
    })

    it('После загрузки документов отображается кнопка "Вернуться..."', async () => {
      render(
        <AgreementArea
          status={StatusCode.FORMATION}
          updateApplicationStatusLocally={mockUpdateStatusLocally}
          setIsEditRequisitesMode={jest.fn}
          closeConfirmationModal={jest.fn}
          isConfirmationModalVisible={false}
          editApplication={jest.fn}
          onSendToFinancing={jest.fn}
          isSendLoading={false}
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
      beforeEach(() => {
        mockedUseAppSelector.mockImplementation(() => fullApplicationData.application)
        render(
          <AgreementArea
            status={StatusCode.FORMATION}
            updateApplicationStatusLocally={mockUpdateStatusLocally}
            setIsEditRequisitesMode={jest.fn}
            closeConfirmationModal={jest.fn}
            isConfirmationModalVisible={false}
            editApplication={jest.fn}
            onSendToFinancing={jest.fn}
            isSendLoading={false}
          />,
          {
            wrapper: createWrapper,
          },
        )
      })

      it('После клика по документам появляются свитчи', async () => {
        await waitFor(async () => expect(await screen.findAllByTestId('uploadFile')).toHaveLength(3))
        const documents = await screen.findAllByTestId('uploadFile')
        userEvent.click(documents[0])
        userEvent.click(documents[1])
        userEvent.click(documents[2])
        expect(await screen.findAllByText('Подписан')).toHaveLength(3)
      })

      it('После подтверждения подписания документов заявке присваивается статус "КД Подписан"', async () => {
        await waitFor(async () => expect(await screen.findAllByTestId('uploadFile')).toHaveLength(3))
        const documents = await screen.findAllByTestId('uploadFile')
        userEvent.click(documents[0])
        userEvent.click(documents[1])
        userEvent.click(documents[2])
        const switches = await screen.findAllByText('Подписан')
        userEvent.click(screen.getByText('Согласен'))
        userEvent.click(switches[0])
        userEvent.click(switches[1])
        userEvent.click(switches[2])
        expect(mockUpdateStatus).toBeCalledTimes(1)
      })
    })

    describe('Отображаются все элементы на 4-м шаге', () => {
      it('После подтверждения подписания документов отображаются реквизиты', async () => {
        render(
          <AgreementArea
            status={StatusCode.SIGNED}
            updateApplicationStatusLocally={mockUpdateStatusLocally}
            setIsEditRequisitesMode={jest.fn}
            closeConfirmationModal={jest.fn}
            isConfirmationModalVisible={false}
            editApplication={jest.fn}
            onSendToFinancing={jest.fn}
            isSendLoading={false}
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
