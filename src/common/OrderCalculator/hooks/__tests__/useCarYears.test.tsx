import { PropsWithChildren } from 'react'

import { renderHook } from '@testing-library/react'
import { Formik, Form } from 'formik'

import { CAR_YEARS_LENGTH } from 'common/OrderCalculator/config'
import * as useCarSectionModule from 'common/OrderCalculator/hooks/useCarSection'
import { BriefOrderCalculatorFields, NormalizedCarsInfo } from 'common/OrderCalculator/types'
import { MockProviders } from 'tests/mocks'

import { getTrimmedСarYears, useCarYears } from '../useCarYears'
import { mockedUseGetCarsListQueryData } from './useGetCarsListQuery.mock'

const INITIAL_CARS: NormalizedCarsInfo = mockedUseGetCarsListQueryData

const CAR_MAX_AGE = 5
const currentYear = new Date().getFullYear()
const carYears = Array.from(new Array(4), (_, index) => ({ value: currentYear - index }))
const expectedCarYears = carYears.slice(0, CAR_MAX_AGE)
const expectedUsedCarYears = Array.from(new Array(CAR_YEARS_LENGTH), (_, index) => ({
  value: currentYear - index,
}))

const mockedUseCarSection = jest.spyOn(useCarSectionModule, 'useCarSection')

const mockedFormik = jest.requireActual('formik')

const mockedSetValue = jest.fn()
jest.mock('formik', () => ({
  ...jest.requireActual('formik'),
  useFormikContext: (...params: any) => ({
    ...mockedFormik.useFormikContext(...params),
    setFieldValue: mockedSetValue,
  }),
}))

const createWrapper =
  (initialValues: Partial<BriefOrderCalculatorFields>) =>
  ({ children }: PropsWithChildren) =>
    (
      <MockProviders>
        <Formik initialValues={initialValues} onSubmit={() => {}}>
          <Form>{children}</Form>
        </Formik>
      </MockProviders>
    )

describe('useCarYears', () => {
  describe('Новые авто', () => {
    beforeEach(() => {
      mockedUseCarSection.mockImplementation(
        () =>
          ({
            data: INITIAL_CARS.newCarsInfo,
            isLoading: false,
            isSuccess: false,
            isError: false,
          } as ReturnType<typeof useCarSectionModule.useCarSection>),
      )
    })

    it('Возвращает список допустимых годов авто из данных автомобиля', () => {
      const result = renderHook(() => useCarYears(), {
        wrapper: createWrapper({
          carCondition: 1,
          carBrand: 'Fiat',
        }),
      })
      expect(result.result.current.carYears).toEqual([{ value: 2024 }])
    })

    it('Если в форме выбрано состояние автомобиля Новый, то список годов для новых авто (максимум 2 года)', () => {
      const result = renderHook(() => useCarYears(), {
        wrapper: createWrapper({
          carCondition: 1,
          carBrand: 'BMW',
        }),
      })
      expect(result.result.current.carYears).toEqual([{ value: 2024 }, { value: 2023 }])
    })
  })

  describe('Б/У авто', () => {
    beforeEach(() => {
      mockedUseCarSection.mockImplementation(
        () =>
          ({
            data: INITIAL_CARS.usedCarsInfo,
            isLoading: false,
            isSuccess: false,
            isError: false,
          } as ReturnType<typeof useCarSectionModule.useCarSection>),
      )
    })

    it('Для БУ авто возвращает полный список годов', () => {
      const result = renderHook(() => useCarYears(), {
        wrapper: createWrapper({
          carCondition: 0,
          carBrand: 'KIA',
        }),
      })
      expect(result.result.current.carYears).toEqual(expectedUsedCarYears.slice(0, 19))
    })

    it('Если список годов в самом авто больше максимального (берется из конфига CAR_YEARS_LENGTH), то список годов обрезается по максимальному', () => {
      const result = renderHook(() => useCarYears(), {
        wrapper: createWrapper({
          carCondition: 0,
          carBrand: 'Toyota',
        }),
      })
      expect(result.result.current.carYears).toEqual(expectedUsedCarYears)
    })
  })

  describe('Эффекты', () => {
    beforeEach(() => {
      mockedUseCarSection.mockImplementation(
        () =>
          ({
            data: INITIAL_CARS.newCarsInfo,
            isLoading: false,
            isSuccess: false,
            isError: false,
          } as ReturnType<typeof useCarSectionModule.useCarSection>),
      )
    })

    it('Если выбрный ранее год в поле carYear отсутствует в допустимом списке годов, то поле carYear в форме очищается', () => {
      renderHook(() => useCarYears(), {
        wrapper: createWrapper({
          carCondition: 1,
          carBrand: 'Fiat',
          carYear: 1990,
        }),
      })
      expect(mockedSetValue).toBeCalled()
    })

    it('Если бренд авто не выбран, то поле carYear в форме очищается', () => {
      renderHook(() => useCarYears(), {
        wrapper: createWrapper({
          carCondition: 1,
          carBrand: null,
          carYear: 2024,
        }),
      })
      expect(mockedSetValue).toBeCalled()
    })
  })
})

describe('getTrimmedСarYears', () => {
  it('Возвращает оригинальный массив, если carMaxAge не передан', () => {
    const result = getTrimmedСarYears(carYears, undefined)
    expect(result).toEqual(carYears)
  })

  it('Обрезает массив согласно переданному carMaxAge', () => {
    const result = getTrimmedСarYears(carYears, CAR_MAX_AGE)
    expect(result).toEqual(expectedCarYears)
  })

  it('Если carMaxAge=1, то возвращается только текущий год в массиве', () => {
    const result = getTrimmedСarYears(carYears, 1)
    expect(result).toEqual([carYears[0]])
  })
})
