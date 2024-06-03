import { PropsWithChildren } from 'react'

import { OptionID } from '@sberauto/dictionarydc-proto/public'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { act } from 'react-dom/test-utils'
import { MockStore } from 'redux-mock-store'

import { initialValueMap } from 'common/OrderCalculator/config'
import * as useCarSectionModule from 'common/OrderCalculator/hooks/useCarSection'
import * as useGetCreditProductListQueryModule from 'common/OrderCalculator/hooks/useGetCreditProductListQuery'
import * as useGetVendorOptionsQueryModule from 'common/OrderCalculator/hooks/useGetVendorOptionsQuery'
import * as useInitialValuesModule from 'common/OrderCalculator/hooks/useInitialValues'
import { prepareCreditProduct } from 'common/OrderCalculator/utils/prepareCreditProductListData'
import {
  CAR_BRANDS,
  creditProductListRsData,
  mockGetVendorOptionsResponse,
} from 'shared/api/requests/dictionaryDc.mock'
import { fullApplicationData } from 'shared/api/requests/loanAppLifeCycleDc.mock'
import * as useAppSelectorModule from 'shared/hooks/store/useAppSelector'
import { sleep } from 'shared/lib/sleep'
import { MockProviders } from 'tests/mocks'
import { disableConsole } from 'tests/utils'

import { BriefOrderCalculator } from '../BriefOrderCalculator'
import { FORM_FIELDS } from './OrderCalculator.mock'

disableConsole('error')
jest.mock('shared/hooks/useScrollToErrorField')

const createWrapper = ({ store, children }: PropsWithChildren<{ store?: MockStore }>) => (
  <MockProviders mockStore={store}>{children}</MockProviders>
)

const mockedUseAppSelector = jest.spyOn(useAppSelectorModule, 'useAppSelector')
const mockedUseGetVendorOptions = jest.spyOn(useGetVendorOptionsQueryModule, 'useGetVendorOptionsQuery')
const mockedUseGetCreditProductListQuery = jest.spyOn(
  useGetCreditProductListQueryModule,
  'useGetCreditProductListQuery',
)
const mockedUseCarSection = jest.spyOn(useCarSectionModule, 'useCarSection')

const getCreditProductListData = {
  ...creditProductListRsData,
  fullDownpaymentMin: creditProductListRsData.fullDownpaymentMin
    ? creditProductListRsData.fullDownpaymentMin * 100
    : undefined,
  fullDownpaymentMax: creditProductListRsData.fullDownpaymentMax
    ? creditProductListRsData.fullDownpaymentMax * 100
    : undefined,
  ...prepareCreditProduct(creditProductListRsData.creditProducts),
}

const mockedUseInitialValues = jest.spyOn(useInitialValuesModule, 'useInitialValues')

// TODO Разбить тесты по дочерним компонентам DCB-1410
describe('OrderCalculator', () => {
  const fn = jest.fn()

  beforeEach(() => {
    mockedUseGetCreditProductListQuery.mockImplementation(
      () =>
        ({
          data: getCreditProductListData,
          isError: false,
          isFetching: false,
          isLoading: false,
          isSuccess: true,
        } as any),
    )
    mockedUseGetVendorOptions.mockImplementation(
      () =>
        ({
          data: mockGetVendorOptionsResponse,
          isError: false,
          isLoading: false,
          isSuccess: true,
        } as any),
    )
    mockedUseInitialValues.mockImplementation(
      () =>
        ({
          isShouldShowLoading: false,
          initialValues: initialValueMap,
        } as any),
    )
    mockedUseCarSection.mockImplementation(() => ({ cars: CAR_BRANDS, isLoading: false, isSuccess: true }))
    mockedUseAppSelector.mockImplementation(() => fullApplicationData.application?.applicant?.birthDate)
  })

  describe('Форма отображается корректно', () => {
    beforeEach(() => {
      render(<BriefOrderCalculator isSubmitLoading={false} onSubmit={fn} onChangeForm={fn} />, {
        wrapper: createWrapper,
      })
    })

    it('Основные поля присутствуют на форме', () => {
      for (const fieldName of FORM_FIELDS) {
        switch (fieldName) {
          case 'Стоимость':
            expect(screen.getAllByText(`${fieldName}`)).toHaveLength(4)
            break
          case 'Тип продукта':
            expect(screen.getAllByText(`${fieldName}`)).toHaveLength(2)
            break
          default:
            expect(screen.getByText(`${fieldName}`)).toBeInTheDocument()
            break
        }
      }
    })
  })

  describe('Валидация основных полей формы работает корректно', () => {
    beforeEach(() => {
      render(<BriefOrderCalculator isSubmitLoading={false} onSubmit={fn} onChangeForm={fn} />, {
        wrapper: createWrapper,
      })
      userEvent.click(screen.getByText('Рассчитать'))
    })

    it('Валидируется верное количество обязательных полей', async () => {
      expect(await screen.findAllByText('Поле обязательно для заполнения')).toHaveLength(5)
    })
  })

  describe('Дополнительные поля', () => {
    beforeEach(() => {
      render(<BriefOrderCalculator isSubmitLoading={false} onSubmit={fn} onChangeForm={fn} />, {
        wrapper: createWrapper,
      })
    })

    it('Item добавляется и удаляется, но не последний', async () => {
      expect(screen.queryAllByTestId('addingSquareBtn')).toHaveLength(3)

      await waitFor(() => userEvent.click(screen.getAllByTestId('addingSquareBtn')[0]))
      expect(screen.queryAllByTestId('addingSquareBtn')).toHaveLength(3)
      await sleep(100)
      await waitFor(() => userEvent.click(screen.getAllByTestId('addingSquareBtn')[0]))
      expect(screen.queryAllByTestId('addingSquareBtn')).toHaveLength(3)

      userEvent.click(screen.getAllByTestId('closeSquareBtn')[0])
      userEvent.click(screen.getAllByTestId('closeSquareBtn')[0])
      userEvent.click(screen.getAllByTestId('closeSquareBtn')[0])
      expect(screen.queryAllByTestId('addingSquareBtn')).toHaveLength(3)
    })
  })

  describe('Валидация логики обязательного КАСКО', () => {
    beforeEach(() => {
      mockedUseInitialValues.mockImplementation(
        () =>
          ({
            isShouldShowLoading: false,
            initialValues: {
              ...initialValueMap,
              carBrand: CAR_BRANDS.KIA.brand,
              // Выбран кредитный продукт с cascoFlag=true
              creditProduct: creditProductListRsData.creditProducts?.[0].productId,
            },
          } as any),
      )
      render(<BriefOrderCalculator isSubmitLoading={false} onSubmit={fn} onChangeForm={fn} />, {
        wrapper: createWrapper,
      })
      userEvent.click(screen.getByText('Рассчитать'))
    })

    it('Если выбран продукт с cascoFlag=true, то появляется предупреждение', async () => {
      expect(
        await screen.findByText(
          'Выбран кредитный продукт с обязательным КАСКО. Необходимо добавить дополнительную услугу КАСКО',
        ),
      ).toBeInTheDocument()
    })

    it('Если выбрана опция КАСКО, то предупреждение не появляется, появляется поле Сумма покрытия КАСКО', async () => {
      expect(await screen.queryByText('Сумма покрытия КАСКО')).not.toBeInTheDocument()

      userEvent.click(
        screen.getByTestId('dealerAdditionalServices[0].productType').firstElementChild as Element,
      )
      await act(async () =>
        userEvent.click(
          await screen.findByText(
            mockGetVendorOptionsResponse?.additionalOptions?.find(o => o.optionId === OptionID.CASCO)
              ?.optionName as string,
          ),
        ),
      )

      expect(
        await screen.queryByText(
          'Выбран кредитный продукт с обязательным КАСКО. Необходимо добавить дополнительную услугу КАСКО',
        ),
      ).not.toBeInTheDocument()

      expect(await screen.queryByText('Сумма покрытия КАСКО')).toBeInTheDocument()
    })
  })
})
