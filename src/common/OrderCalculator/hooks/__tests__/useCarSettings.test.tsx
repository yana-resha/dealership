import { renderHook, act } from '@testing-library/react-hooks'
import * as formikModule from 'formik'

import { useCarSettings } from '../useCarSettings'

const mockedSetFieldTouched = jest.fn()
const mockedOnFilled = jest.fn()
const mockedUseFormikContext = jest.spyOn(formikModule, 'useFormikContext')

const CREDIT_PRODUCT_PARAMS_FIELDS = [
  'isGovernmentProgram',
  'isDfoProgram',
  'carCondition',
  'carBrand',
  'carModel',
  'carYear',
  'carPrice',
  'carPassportCreationDate',
]

describe('useCarSettings', () => {
  beforeEach(() => {
    mockedUseFormikContext.mockReturnValue({
      errors: {},
      setFieldTouched: mockedSetFieldTouched,
    } as unknown as any)
  })

  it('При вызове handleBtnClick вызывается setFieldTouched для всех обязательных полей из CREDIT_PRODUCT_PARAMS_FIELDS', () => {
    const { result } = renderHook(() => useCarSettings(mockedOnFilled))
    const { handleBtnClick } = result.current
    act(() => {
      handleBtnClick()
    })

    expect(mockedSetFieldTouched).toHaveBeenCalledTimes(CREDIT_PRODUCT_PARAMS_FIELDS.length)
  })

  it('При вызове handleBtnClick и отсутствии ощибок в форме, вызывается onFilled', () => {
    const { result } = renderHook(() => useCarSettings(mockedOnFilled))
    const { handleBtnClick } = result.current
    act(() => handleBtnClick())
    expect(mockedOnFilled).toHaveBeenCalled()
  })

  it('Если в любом из обязательных полей из CREDIT_PRODUCT_PARAMS_FIELDS есть ошибка, то не вызывается onFilled', () => {
    mockedUseFormikContext.mockReturnValue({
      errors: { carYear: 'error' },
      setFieldTouched: mockedSetFieldTouched,
    } as unknown as any)

    const { result } = renderHook(() => useCarSettings(mockedOnFilled))
    const { handleBtnClick } = result.current
    act(() => handleBtnClick())

    expect(mockedOnFilled).not.toHaveBeenCalled()
  })
})
