import { PropsWithChildren } from 'react'

import { renderHook, act } from '@testing-library/react-hooks'
import { Form, Formik } from 'formik'

import { fullInitialValueMap } from 'common/OrderCalculator/config'
import * as useGetCreditProductListQueryModule from 'common/OrderCalculator/hooks/useGetCreditProductListQuery'
import { FullOrderCalculatorFields } from 'common/OrderCalculator/types'
import { prepareCreditProducts } from 'common/OrderCalculator/utils/prepareCreditProductListData'
import { creditProductListRsData } from 'shared/api/requests/dictionaryDc.mock'
import { MockProviders } from 'tests/mocks'

import { useCreditProducts } from '../useCreditProducts'

const mockedUseGetCreditProductListQuery = jest.spyOn(
  useGetCreditProductListQueryModule,
  'useGetCreditProductListQuery',
)

const getCreditProductListData = {
  ...creditProductListRsData,
  fullDownpaymentMin: (creditProductListRsData.fullDownpaymentMin as number) * 100,
  fullDownpaymentMax: (creditProductListRsData.fullDownpaymentMax as number) * 100,
  ...prepareCreditProducts(creditProductListRsData.creditProducts),
}

const createWrapper =
  (initialValues: Partial<FullOrderCalculatorFields>) =>
  ({ children }: PropsWithChildren) =>
    (
      <MockProviders>
        <Formik initialValues={initialValues} onSubmit={() => {}}>
          <Form>{children}</Form>
        </Formik>
      </MockProviders>
    )

describe('useCreditProducts', () => {
  beforeEach(() => {
    mockedUseGetCreditProductListQuery.mockImplementation(
      () =>
        ({
          data: null,
          isError: false,
          isFetching: false,
          isLoading: false,
          isSuccess: false,
        } as any),
    )
  })

  it('Изначально useGetCreditProductListQuery не вызывает запрос, если shouldFetchProductsOnStart = false', () => {
    renderHook(
      () =>
        useCreditProducts({
          shouldFetchProductsOnStart: false,
          formFields: {},
          initialValueMap: fullInitialValueMap,
          creditProductId: undefined,
          resetCreditProductId: () => {},
        }),
      {
        wrapper: createWrapper({
          ...fullInitialValueMap,
        }),
      },
    )
    expect(mockedUseGetCreditProductListQuery).toHaveBeenCalledTimes(1)
    expect(mockedUseGetCreditProductListQuery).toHaveBeenCalledWith({
      enabled: false,
      values: fullInitialValueMap,
    })
  })

  it('Изначально useGetCreditProductListQuery вызывает запрос, если shouldFetchProductsOnStart = true', () => {
    renderHook(
      () =>
        useCreditProducts({
          shouldFetchProductsOnStart: true,
          formFields: {},
          initialValueMap: fullInitialValueMap,
          creditProductId: undefined,
          resetCreditProductId: () => {},
        }),
      {
        wrapper: createWrapper({
          ...fullInitialValueMap,
        }),
      },
    )
    expect(mockedUseGetCreditProductListQuery).toHaveBeenCalledTimes(1)
    expect(mockedUseGetCreditProductListQuery).toHaveBeenCalledWith({
      enabled: true,
      values: fullInitialValueMap,
    })
  })

  it('После вызова changeShouldFetchProducts,  useGetCreditProductListQuery вызывает запрос', () => {
    const { result } = renderHook(
      () =>
        useCreditProducts({
          shouldFetchProductsOnStart: false,
          formFields: {},
          initialValueMap: fullInitialValueMap,
          creditProductId: undefined,
          resetCreditProductId: () => {},
        }),
      {
        wrapper: createWrapper({
          ...fullInitialValueMap,
        }),
      },
    )
    act(() => {
      result.current.changeShouldFetchProducts()
    })
    expect(mockedUseGetCreditProductListQuery).toHaveBeenNthCalledWith(1, {
      enabled: false,
      values: fullInitialValueMap,
    })
    expect(mockedUseGetCreditProductListQuery).toHaveBeenNthCalledWith(2, {
      enabled: true,
      values: fullInitialValueMap,
    })
  })

  it('Если есть данные из useGetCreditProductListQuery, нет ошибки, и базовые поля формы не менялись, то shouldShowOrderSettings = true', () => {
    mockedUseGetCreditProductListQuery.mockImplementation(
      () =>
        ({
          data: getCreditProductListData,
          isError: false,
          isFetching: false,
          isLoading: false,
          isSuccess: false,
        } as any),
    )

    const { result } = renderHook(
      () =>
        useCreditProducts({
          shouldFetchProductsOnStart: false,
          formFields: {},
          initialValueMap: fullInitialValueMap,
          creditProductId: undefined,
          resetCreditProductId: () => {},
        }),
      {
        wrapper: createWrapper({
          ...fullInitialValueMap,
        }),
      },
    )

    expect(result.current.shouldShowOrderSettings).toEqual(true)
  })
})
