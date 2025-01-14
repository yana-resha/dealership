import { PropsWithChildren } from 'react'

import { Vendor } from '@sberauto/dictionarydc-proto/public'
import { ApplicationFrontdc, StatusCode } from '@sberauto/loanapplifecycledc-proto/public'
import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { BrowserRouter } from 'react-router-dom'
import { MockStore } from 'redux-mock-store'

import { fullApplicationData } from 'shared/api/requests/loanAppLifeCycleDc.mock'
import * as useAppSelectorModule from 'shared/hooks/store/useAppSelector'
import { ThemeProviderMock, StoreProviderMock } from 'tests/mocks'

import { ActionArea } from '../ActionArea'

interface WrapperProps extends PropsWithChildren {
  store?: MockStore
}

const mockedVendor: Vendor = {
  vendorCode: '2002703288',
}

jest.mock('../AgreementArea/AgreementArea', () => ({
  AgreementArea: () => <div data-testid="agreementArea" />,
}))
jest.mock('shared/ui/ProgressBar/ProgressBar', () => ({
  ProgressBar: () => <div data-testid="progressBar" />,
}))
jest.mock('entities/pointOfSale', () => ({
  getPointOfSaleFromCookies: () => mockedVendor,
}))
jest.mock('notistack', () => ({
  ...jest.requireActual('notistack'),
  useSnackbar: () => ({
    enqueueSnackbar: jest.fn(),
  }),
}))
const mockedUseAppSelector = jest.spyOn(useAppSelectorModule, 'useAppSelector')

const queryClient = new QueryClient()

const createWrapper = ({ store, children }: WrapperProps) => (
  <StoreProviderMock mockStore={store}>
    <QueryClientProvider client={queryClient}>
      <ThemeProviderMock>
        <BrowserRouter>{children}</BrowserRouter>
      </ThemeProviderMock>
    </QueryClientProvider>
  </StoreProviderMock>
)

describe('ActionAreaTest', () => {
  beforeEach(() => {
    mockedUseAppSelector.mockImplementation(() => fullApplicationData.application as ApplicationFrontdc)
  })

  describe('Отображаются все элементы для каждого статуса', () => {
    it('Отображается название области экрана "Действие"', () => {
      render(
        <ActionArea
          status={StatusCode.INITIAL}
          goToTargetApplication={jest.fn}
          moratoryEndDate="1970-01-01"
          targetDcAppId={undefined}
          applicationForScore={{ application: fullApplicationData.application as ApplicationFrontdc }}
          returnToList={jest.fn}
          updateApplicationStatusLocally={jest.fn}
          setIsEditRequisitesMode={jest.fn}
          isGovProgramDocumentsPending={false}
          isGovProgramDocumentsSuccess={false}
          isGovProgramDocumentsSendingBlocked={false}
          currentGovProgramScans={[]}
        />,
        {
          wrapper: createWrapper,
        },
      )
      expect(screen.getByText('Действие')).toBeInTheDocument()
    })

    describe('Статус Initial (Черновик)', () => {
      beforeEach(() => {
        mockedUseAppSelector.mockImplementation(
          () => ({ ...fullApplicationData.application, anketaType: 1 } as ApplicationFrontdc),
        )
      })
      it('Если файл анкеты отсутствует, отображатеся только кнопка "Редактировать"', () => {
        render(
          <ActionArea
            status={StatusCode.INITIAL}
            goToTargetApplication={jest.fn}
            moratoryEndDate="1970-01-01"
            targetDcAppId={undefined}
            applicationForScore={{ application: fullApplicationData.application as ApplicationFrontdc }}
            returnToList={jest.fn}
            updateApplicationStatusLocally={jest.fn}
            setIsEditRequisitesMode={jest.fn}
            isGovProgramDocumentsPending={false}
            isGovProgramDocumentsSuccess={false}
            isGovProgramDocumentsSendingBlocked={false}
            currentGovProgramScans={[]}
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
            goToTargetApplication={jest.fn}
            moratoryEndDate="1970-01-01"
            targetDcAppId={undefined}
            applicationForScore={{ application: fullApplicationData.application as ApplicationFrontdc }}
            returnToList={jest.fn}
            updateApplicationStatusLocally={jest.fn}
            setIsEditRequisitesMode={jest.fn}
            isGovProgramDocumentsPending={false}
            isGovProgramDocumentsSuccess={false}
            isGovProgramDocumentsSendingBlocked={false}
            currentGovProgramScans={[]}
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
            goToTargetApplication={jest.fn}
            applicationForScore={{ application: fullApplicationData.application as ApplicationFrontdc }}
            returnToList={jest.fn}
            updateApplicationStatusLocally={jest.fn}
            setIsEditRequisitesMode={jest.fn}
            isGovProgramDocumentsPending={false}
            isGovProgramDocumentsSuccess={false}
            isGovProgramDocumentsSendingBlocked={false}
            currentGovProgramScans={[]}
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
            goToTargetApplication={jest.fn}
            applicationForScore={{ application: fullApplicationData.application as ApplicationFrontdc }}
            returnToList={jest.fn}
            updateApplicationStatusLocally={jest.fn}
            setIsEditRequisitesMode={jest.fn}
            isGovProgramDocumentsPending={false}
            isGovProgramDocumentsSuccess={false}
            isGovProgramDocumentsSendingBlocked={false}
            currentGovProgramScans={[]}
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
            goToTargetApplication={jest.fn}
            applicationForScore={{ application: fullApplicationData.application as ApplicationFrontdc }}
            returnToList={jest.fn}
            updateApplicationStatusLocally={jest.fn}
            setIsEditRequisitesMode={jest.fn}
            isGovProgramDocumentsPending={false}
            isGovProgramDocumentsSuccess={false}
            isGovProgramDocumentsSendingBlocked={false}
            currentGovProgramScans={[]}
          />,
          {
            wrapper: createWrapper,
          },
        )

        expect(screen.getByTestId('agreementArea')).toBeInTheDocument()
      })
    })

    describe('Статус CanceledDeal (КД отменен)', () => {
      it('Отображается кнопка "Пересоздать новую заявку"', () => {
        render(
          <ActionArea
            status={StatusCode.CANCELED_DEAL}
            goToTargetApplication={jest.fn}
            applicationForScore={{ application: fullApplicationData.application as ApplicationFrontdc }}
            returnToList={jest.fn}
            updateApplicationStatusLocally={jest.fn}
            setIsEditRequisitesMode={jest.fn}
            isGovProgramDocumentsPending={false}
            isGovProgramDocumentsSuccess={false}
            isGovProgramDocumentsSendingBlocked={false}
            currentGovProgramScans={[]}
          />,
          {
            wrapper: createWrapper,
          },
        )

        expect(screen.getByText('Пересоздать новую заявку')).toBeInTheDocument()
      })
    })

    describe('Статус Canceled (Отменен)', () => {
      it('Отображается кнопка "Пересоздать новую заявку"', () => {
        render(
          <ActionArea
            status={StatusCode.CANCELED}
            goToTargetApplication={jest.fn}
            applicationForScore={{ application: fullApplicationData.application as ApplicationFrontdc }}
            returnToList={jest.fn}
            updateApplicationStatusLocally={jest.fn}
            setIsEditRequisitesMode={jest.fn}
            isGovProgramDocumentsPending={false}
            isGovProgramDocumentsSuccess={false}
            isGovProgramDocumentsSendingBlocked={false}
            currentGovProgramScans={[]}
          />,
          {
            wrapper: createWrapper,
          },
        )

        expect(screen.getByText('Пересоздать новую заявку')).toBeInTheDocument()
      })
    })

    describe('Статус Rejected (Отказ)', () => {
      it('Отображается кнопка "Пересоздать новую заявку"', () => {
        render(
          <ActionArea
            status={StatusCode.REJECTED}
            goToTargetApplication={jest.fn}
            applicationForScore={{ application: fullApplicationData.application as ApplicationFrontdc }}
            returnToList={jest.fn}
            updateApplicationStatusLocally={jest.fn}
            setIsEditRequisitesMode={jest.fn}
            isGovProgramDocumentsPending={false}
            isGovProgramDocumentsSuccess={false}
            isGovProgramDocumentsSendingBlocked={false}
            currentGovProgramScans={[]}
          />,
          {
            wrapper: createWrapper,
          },
        )

        expect(screen.getByText('Пересоздать новую заявку')).toBeInTheDocument()
      })

      it('Если source="DC", и есть дата маротория и она не вышла, то не отображается кнопка "Пересоздать новую заявку"', () => {
        render(
          <ActionArea
            status={StatusCode.REJECTED}
            goToTargetApplication={jest.fn}
            moratoryEndDate="3970-01-01"
            source="DC"
            applicationForScore={{ application: fullApplicationData.application as ApplicationFrontdc }}
            returnToList={jest.fn}
            updateApplicationStatusLocally={jest.fn}
            setIsEditRequisitesMode={jest.fn}
            isGovProgramDocumentsPending={false}
            isGovProgramDocumentsSuccess={false}
            isGovProgramDocumentsSendingBlocked={false}
            currentGovProgramScans={[]}
          />,
          {
            wrapper: createWrapper,
          },
        )

        expect(screen.queryByText('Пересоздать новую заявку')).not.toBeInTheDocument()
      })

      it('Если source!="DC", отображается кнопка "Пересоздать новую заявку", независимо от даты маратория', () => {
        render(
          <ActionArea
            status={StatusCode.REJECTED}
            goToTargetApplication={jest.fn}
            moratoryEndDate="3970-01-01"
            applicationForScore={{ application: fullApplicationData.application as ApplicationFrontdc }}
            returnToList={jest.fn}
            updateApplicationStatusLocally={jest.fn}
            setIsEditRequisitesMode={jest.fn}
            isGovProgramDocumentsPending={false}
            isGovProgramDocumentsSuccess={false}
            isGovProgramDocumentsSendingBlocked={false}
            currentGovProgramScans={[]}
          />,
          {
            wrapper: createWrapper,
          },
        )

        expect(screen.getByText('Пересоздать новую заявку')).toBeInTheDocument()
      })

      it('Если есть targetDcAppId, отображается кнопка "Перейти на новую заявку"', () => {
        render(
          <ActionArea
            status={StatusCode.REJECTED}
            goToTargetApplication={jest.fn}
            moratoryEndDate="3970-01-01"
            targetDcAppId="123"
            applicationForScore={{ application: fullApplicationData.application as ApplicationFrontdc }}
            returnToList={jest.fn}
            updateApplicationStatusLocally={jest.fn}
            setIsEditRequisitesMode={jest.fn}
            isGovProgramDocumentsPending={false}
            isGovProgramDocumentsSuccess={false}
            isGovProgramDocumentsSendingBlocked={false}
            currentGovProgramScans={[]}
          />,
          {
            wrapper: createWrapper,
          },
        )

        expect(screen.getByText('Перейти на новую заявку')).toBeInTheDocument()
      })
    })

    describe('Статус clientRejected (Отказ)', () => {
      it('Отображается кнопка "Пересоздать новую заявку"', () => {
        render(
          <ActionArea
            status={StatusCode.CLIENT_REJECTED}
            goToTargetApplication={jest.fn}
            applicationForScore={{ application: fullApplicationData.application as ApplicationFrontdc }}
            returnToList={jest.fn}
            updateApplicationStatusLocally={jest.fn}
            setIsEditRequisitesMode={jest.fn}
            isGovProgramDocumentsPending={false}
            isGovProgramDocumentsSuccess={false}
            isGovProgramDocumentsSendingBlocked={false}
            currentGovProgramScans={[]}
          />,
          {
            wrapper: createWrapper,
          },
        )

        expect(screen.getByText('Пересоздать новую заявку')).toBeInTheDocument()
      })
    })

    describe('Статус Signed (КД подписан)', () => {
      it('Отображается блок "AgreementArea"', () => {
        render(
          <ActionArea
            status={StatusCode.FINALLY_APPROVED}
            goToTargetApplication={jest.fn}
            applicationForScore={{ application: fullApplicationData.application as ApplicationFrontdc }}
            returnToList={jest.fn}
            updateApplicationStatusLocally={jest.fn}
            setIsEditRequisitesMode={jest.fn}
            isGovProgramDocumentsPending={false}
            isGovProgramDocumentsSuccess={false}
            isGovProgramDocumentsSendingBlocked={false}
            currentGovProgramScans={[]}
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
            goToTargetApplication={jest.fn}
            applicationForScore={{ application: fullApplicationData.application as ApplicationFrontdc }}
            returnToList={jest.fn}
            updateApplicationStatusLocally={jest.fn}
            setIsEditRequisitesMode={jest.fn}
            isGovProgramDocumentsPending={false}
            isGovProgramDocumentsSuccess={false}
            isGovProgramDocumentsSendingBlocked={false}
            currentGovProgramScans={[]}
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
