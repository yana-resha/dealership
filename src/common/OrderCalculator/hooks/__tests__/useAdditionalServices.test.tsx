import { PropsWithChildren } from 'react'

import { SaleMethod } from '@sberauto/dictionarydc-proto/public'
import { renderHook } from '@testing-library/react-hooks'
import { Form, Formik } from 'formik'

import { INITIAL_ADDITIONAL_SERVICE, INITIAL_BANK_ADDITIONAL_SERVICE } from 'common/OrderCalculator/config'
import { FullOrderCalculatorFields } from 'common/OrderCalculator/types'
import { MAX_AGE, MIN_AGE } from 'shared/config/client.config'
import { MockProviders } from 'tests/mocks'

import { useAdditionalServices } from '../useAdditionalServices'
import {
  ADDITIONAL_SERVICES_PARAMS,
  BANK_ADDITIONAL_FORMIK_VALUE,
  BANK_ADDITIONAL_VENDOR_OPTIONS,
  DEALER_ADDITIONAL_SERVICES_FORMIK_VALUE,
  DEALER_ADDITIONAL_VENDOR_OPTIONS,
  EQUIPMENT_ADDITIONAL_VENDOR_OPTIONS,
  EQUIPMENTS_ADDITIONAL_FORMIK_VALUE,
  EXPECTED_BANK_FILTER_OPTIONS,
  INITIAL_FORMIK_DATA,
  MOCKED_FORMIK_CONTEXT,
} from './useAdditionalServices.mock'

jest.mock('lodash/debounce', () => (fn: (...args: any[]) => any) => fn)

jest.mock('formik', () => ({
  ...jest.requireActual('formik'),
  useFormikContext: () => {
    const formikContext = jest.requireActual('formik').useFormikContext()
    MOCKED_FORMIK_CONTEXT.values = formikContext.values
    MOCKED_FORMIK_CONTEXT.setFieldValue = formikContext.setFieldValue

    return formikContext
  },
}))

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

describe('useAdditionalServices', () => {
  describe('isShowAdditionalServices', () => {
    it('Если КП присутстсвует isShowAdditionalServices вернет true, если отсутствует то вернет false', () => {
      const { result } = renderHook(() => useAdditionalServices(ADDITIONAL_SERVICES_PARAMS), {
        wrapper: createWrapper(INITIAL_FORMIK_DATA),
      })

      expect(result.current.isShowAdditionalServices).toEqual(false)

      MOCKED_FORMIK_CONTEXT.setFieldValue('creditProduct', '1')
      expect(result.current.isShowAdditionalServices).toEqual(true)
    })

    it('Если КП присутстсвует, но список кредитных продуктов не загрузился isShowAdditionalServices false', () => {
      const { result } = renderHook(
        () =>
          useAdditionalServices({
            ...ADDITIONAL_SERVICES_PARAMS,
            isLoadedCreditProducts: false,
          }),
        {
          wrapper: createWrapper(INITIAL_FORMIK_DATA),
        },
      )

      expect(result.current.isShowAdditionalServices).toEqual(false)
    })
  })

  describe('МАППИНГ dealerAdditionalServiceOptions и additionalEquipmentOptions', () => {
    it('Если в vendorOptions?.additionalOptions есть опции с типом доп. оборудование или доп. услуги диллера, то хук их вернет', () => {
      const { result } = renderHook(() => useAdditionalServices(ADDITIONAL_SERVICES_PARAMS), {
        wrapper: createWrapper(INITIAL_FORMIK_DATA),
      })

      expect(result.current.additionalEquipmentOptions).toEqual(EQUIPMENT_ADDITIONAL_VENDOR_OPTIONS)
      expect(result.current.dealerAdditionalServiceOptions).toEqual(DEALER_ADDITIONAL_VENDOR_OPTIONS)
    })

    it('Если vendorOptions?.additionalOptions === undefined или не содержит опции с типом доп. оборудование или доп. услуги диллера, вернутся пустые массивы', () => {
      const { result } = renderHook(
        () =>
          useAdditionalServices({
            ...ADDITIONAL_SERVICES_PARAMS,
            vendorOptions: undefined,
          }),
        {
          wrapper: createWrapper(INITIAL_FORMIK_DATA),
        },
      )

      expect(result.current.additionalEquipmentOptions).toEqual([])
      expect(result.current.dealerAdditionalServiceOptions).toEqual([])
    })
  })

  describe('МАППИНГ bankAdditionalServiceOptions', () => {
    describe('Если КП присутствует', () => {
      it('Если vendorOptions?.additionalOptions === undefined или не содержит опций с типов банк. доп услуги, вернется пустой массив', () => {
        const { result } = renderHook(
          () =>
            useAdditionalServices({
              ...ADDITIONAL_SERVICES_PARAMS,
              vendorOptions: undefined,
            }),
          {
            wrapper: createWrapper(INITIAL_FORMIK_DATA),
          },
        )

        expect(result.current.bankAdditionalServiceOptions).toEqual([])
      })

      it('Если clientAge === undefined, вернутся пустой массив', () => {
        const { result } = renderHook(
          () =>
            useAdditionalServices({
              ...ADDITIONAL_SERVICES_PARAMS,
              clientAge: undefined,
            }),
          {
            wrapper: createWrapper({ ...INITIAL_FORMIK_DATA, creditProduct: '1' }),
          },
        )

        expect(result.current.bankAdditionalServiceOptions).toEqual([])
      })

      it('Если clientAge < чем минимальный возраст в одном из тарифов, вернется пустой массив', () => {
        const { result } = renderHook(
          () =>
            useAdditionalServices({
              ...ADDITIONAL_SERVICES_PARAMS,
              clientAge: MIN_AGE - 1,
            }),
          {
            wrapper: createWrapper({ ...INITIAL_FORMIK_DATA, creditProduct: '1' }),
          },
        )

        expect(result.current.bankAdditionalServiceOptions).toEqual([])
      })

      it('Если clientAge > чем максимальный возраст в одном из тарифов, вернется пустой массив', () => {
        const { result } = renderHook(
          () =>
            useAdditionalServices({
              ...ADDITIONAL_SERVICES_PARAMS,
              clientAge: MAX_AGE + 1,
            }),
          {
            wrapper: createWrapper({ ...INITIAL_FORMIK_DATA, creditProduct: '1' }),
          },
        )

        expect(result.current.bankAdditionalServiceOptions).toEqual([])
      })

      it('Если currentRateMod?.optionId === undefined, то вернет только банк. опции с параметром el.saleMethod === SaleMethod.STAND_ALONE', () => {
        const { result } = renderHook(() => useAdditionalServices(ADDITIONAL_SERVICES_PARAMS), {
          wrapper: createWrapper({ ...INITIAL_FORMIK_DATA, creditProduct: '1' }),
        })

        expect(result.current.bankAdditionalServiceOptions).toEqual(EXPECTED_BANK_FILTER_OPTIONS)
      })

      it('Если currentRateMod?.optionId !== undefined и в vendorOptions?.additionalOptions есть опция с таким optionId, вернет банк. опции с параметром el.saleMethod === SaleMethod.STAND_ALONE || el.optionId === currentRateMod?.optionId', () => {
        const { result } = renderHook(
          () =>
            useAdditionalServices({
              ...ADDITIONAL_SERVICES_PARAMS,
              currentRateMod: {
                optionId: '27',
                requiredService: false,
                tariffs: [],
              },
            }),
          {
            wrapper: createWrapper({ ...INITIAL_FORMIK_DATA, creditProduct: '1' }),
          },
        )

        expect(result.current.bankAdditionalServiceOptions).toEqual([
          BANK_ADDITIONAL_VENDOR_OPTIONS[3],
          ...EXPECTED_BANK_FILTER_OPTIONS,
        ])
      })

      it('Если currentRateMod?.optionId !== undefined и в vendorOptions?.additionalOptions нет опции с таким optionId', () => {
        const { result } = renderHook(
          () =>
            useAdditionalServices({
              ...ADDITIONAL_SERVICES_PARAMS,
              currentRateMod: {
                optionId: '14',
                requiredService: false,
                tariffs: [],
              },
            }),
          {
            wrapper: createWrapper({ ...INITIAL_FORMIK_DATA, creditProduct: '1' }),
          },
        )

        const EXPECTED_BANK_FILTER_OPTIONS = BANK_ADDITIONAL_VENDOR_OPTIONS.filter(
          el => el.saleMethod === SaleMethod.STAND_ALONE,
        )
        expect(result.current.bankAdditionalServiceOptions).toEqual(EXPECTED_BANK_FILTER_OPTIONS)
      })
    })

    it('Если КП отсутсвует, вернется пустой массив', () => {
      const { result } = renderHook(() => useAdditionalServices(ADDITIONAL_SERVICES_PARAMS), {
        wrapper: createWrapper(INITIAL_FORMIK_DATA),
      })

      expect(result.current.bankAdditionalServiceOptions).toEqual([])
    })
  })

  describe('Заполнение/очищение полей в калькуляторе additionalEquipments и dealerAdditionalServices', () => {
    it('Выбрали КП и выбрали опции -> Сбросили КП -> Выбрали КП. В результате Поля заполнены -> Поля очищены -> Поля заполнены предыдущими значениями, которые были до сброса КП', () => {
      renderHook(() => useAdditionalServices(ADDITIONAL_SERVICES_PARAMS), {
        wrapper: createWrapper(INITIAL_FORMIK_DATA),
      })

      // заполнили КП и выбрали доп опции
      MOCKED_FORMIK_CONTEXT.setFieldValue('creditProduct', '1')
      MOCKED_FORMIK_CONTEXT.setFieldValue('dealerAdditionalServices', DEALER_ADDITIONAL_SERVICES_FORMIK_VALUE)
      MOCKED_FORMIK_CONTEXT.setFieldValue('additionalEquipments', EQUIPMENTS_ADDITIONAL_FORMIK_VALUE)

      expect(MOCKED_FORMIK_CONTEXT.values.dealerAdditionalServices).toEqual(
        DEALER_ADDITIONAL_SERVICES_FORMIK_VALUE,
      )
      expect(MOCKED_FORMIK_CONTEXT.values.additionalEquipments).toEqual(EQUIPMENTS_ADDITIONAL_FORMIK_VALUE)

      // Сбросили КП
      MOCKED_FORMIK_CONTEXT.setFieldValue('creditProduct', '')
      expect(MOCKED_FORMIK_CONTEXT.values.additionalEquipments).toEqual([INITIAL_ADDITIONAL_SERVICE])
      expect(MOCKED_FORMIK_CONTEXT.values.dealerAdditionalServices).toEqual([INITIAL_ADDITIONAL_SERVICE])

      // Выбрали КП
      MOCKED_FORMIK_CONTEXT.setFieldValue('creditProduct', '1')
      MOCKED_FORMIK_CONTEXT.setFieldValue('dealerAdditionalServices', DEALER_ADDITIONAL_SERVICES_FORMIK_VALUE)
      MOCKED_FORMIK_CONTEXT.setFieldValue('additionalEquipments', EQUIPMENTS_ADDITIONAL_FORMIK_VALUE)

      expect(MOCKED_FORMIK_CONTEXT.values.dealerAdditionalServices).toEqual(
        DEALER_ADDITIONAL_SERVICES_FORMIK_VALUE,
      )
      expect(MOCKED_FORMIK_CONTEXT.values.additionalEquipments).toEqual(EQUIPMENTS_ADDITIONAL_FORMIK_VALUE)
    })
  })

  describe('Заполнение/очищение поля в калькуляторе bankAdditionalServices', () => {
    it('Выбрали КП и выбрали допник  -> Сбросили КП -> Выбрали КП === предыдущему выбранному КП. В результате Поле заполнено -> Поле очищено -> Поле заполнено предыдущими значениями, которые были до сброса КП', () => {
      renderHook(() => useAdditionalServices(ADDITIONAL_SERVICES_PARAMS), {
        wrapper: createWrapper(INITIAL_FORMIK_DATA),
      })

      // заполнили КП и выбрали доп опции
      MOCKED_FORMIK_CONTEXT.setFieldValue('creditProduct', '1')
      MOCKED_FORMIK_CONTEXT.setFieldValue('bankAdditionalServices', BANK_ADDITIONAL_FORMIK_VALUE)
      expect(MOCKED_FORMIK_CONTEXT.values.bankAdditionalServices).toEqual(BANK_ADDITIONAL_FORMIK_VALUE)

      // сбросили КП
      MOCKED_FORMIK_CONTEXT.setFieldValue('creditProduct', '')
      expect(MOCKED_FORMIK_CONTEXT.values.bankAdditionalServices).toEqual([INITIAL_BANK_ADDITIONAL_SERVICE])

      // Выбрали КП, который равен КП из 1 шага
      MOCKED_FORMIK_CONTEXT.setFieldValue('creditProduct', '1')
      expect(MOCKED_FORMIK_CONTEXT.values.bankAdditionalServices).toEqual(BANK_ADDITIONAL_FORMIK_VALUE)
    })

    it('Выбрали КП и выбрали допник -> Сбросили КП -> Выбрали КП !== предыдущему выбранному КП. В результате Поле заполнено -> Поле очищено -> Поле очищено', () => {
      renderHook(() => useAdditionalServices(ADDITIONAL_SERVICES_PARAMS), {
        wrapper: createWrapper(INITIAL_FORMIK_DATA),
      })

      // заполнили КП и выбрали доп опции
      MOCKED_FORMIK_CONTEXT.setFieldValue('creditProduct', '1')
      MOCKED_FORMIK_CONTEXT.setFieldValue('bankAdditionalServices', BANK_ADDITIONAL_FORMIK_VALUE)

      expect(MOCKED_FORMIK_CONTEXT.values.bankAdditionalServices).toEqual(BANK_ADDITIONAL_FORMIK_VALUE)

      // сбросили КП
      MOCKED_FORMIK_CONTEXT.setFieldValue('creditProduct', '')
      expect(MOCKED_FORMIK_CONTEXT.values.bankAdditionalServices).toEqual([INITIAL_BANK_ADDITIONAL_SERVICE])

      // Выбрали КП, который не равен КП из 1 шага
      MOCKED_FORMIK_CONTEXT.setFieldValue('creditProduct', '3')
      expect(MOCKED_FORMIK_CONTEXT.values.bankAdditionalServices).toEqual([INITIAL_BANK_ADDITIONAL_SERVICE])
    })
  })
})
