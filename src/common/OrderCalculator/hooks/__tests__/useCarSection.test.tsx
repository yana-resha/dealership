import { PropsWithChildren } from 'react'

import { renderHook } from '@testing-library/react'
import { Formik, Form } from 'formik'
import { UseQueryResult } from 'react-query'

import * as useGetCarsListQueryModule from 'common/OrderCalculator/hooks/useGetCarsListQuery'
import { NormalizedCarsInfo } from 'common/OrderCalculator/types'
import { MockProviders } from 'tests/mocks'

import { useCarSection } from '../useCarSection'
import { mockedUseGetCarsListQueryData } from './useGetCarsListQuery.mock'

const mockedGetCarsList = jest.spyOn(useGetCarsListQueryModule, 'useGetCarsListQuery')

const createWrapper =
  (carCondition: number) =>
  ({ children }: PropsWithChildren) =>
    (
      <MockProviders>
        <Formik initialValues={{ carCondition }} onSubmit={() => {}}>
          <Form>{children}</Form>
        </Formik>
      </MockProviders>
    )

describe('useCarSection', () => {
  beforeEach(() => {
    mockedGetCarsList.mockImplementation(
      () =>
        ({
          data: mockedUseGetCarsListQueryData,
          isError: false,
        } as unknown as UseQueryResult<NormalizedCarsInfo, unknown>),
    )
  })

  it('Если в форме выбрано состояние автомобиля Новый, то возвращает новые авто', () => {
    const result = renderHook(() => useCarSection(), { wrapper: createWrapper(1) })
    expect(result.result.current.data).toEqual(mockedUseGetCarsListQueryData.newCarsInfo)
  })

  it('Если в форме выбрано состояние автомобиля БУ, то возвращает старые авто', () => {
    const result = renderHook(() => useCarSection(), { wrapper: createWrapper(0) })
    expect(result.result.current.data).toEqual(mockedUseGetCarsListQueryData.usedCarsInfo)
  })
})
