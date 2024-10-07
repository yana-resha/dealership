import { useCallback, useEffect, useMemo, useRef } from 'react'

import { OptionType, SaleMethod } from '@sberauto/dictionarydc-proto/public'
import { useFormikContext } from 'formik'
import isEqual from 'lodash/isEqual'

import { ServicesGroupName } from 'entities/applications/AdditionalOptionsRequisites/configs/additionalOptionsRequisites.config'
import { RequiredRateMod } from 'entities/order/model/orderSlice'
import { checkIsNumber } from 'shared/lib/helpers'

import {
  BriefOrderCalculatorFields,
  FullInitialAdditionalEquipment,
  FullInitialAdditionalService,
  OrderCalculatorAdditionalService,
  OrderCalculatorBankAdditionalService,
} from '../types'
import { BankAdditionalOption, NonNullableAdditionalOption } from './useGetVendorOptionsQuery'

type AdditionalOptions =
  | OrderCalculatorAdditionalService[]
  | FullInitialAdditionalService[]
  | OrderCalculatorBankAdditionalService[]

type Params = {
  vendorOptions:
    | {
        additionalOptions: NonNullableAdditionalOption[]
        additionalOptionsMap: Record<string, NonNullableAdditionalOption>
      }
    | undefined
  clientAge: number | undefined
  currentRateMod: RequiredRateMod | undefined
  initialDealerAdditionalService: FullInitialAdditionalService | OrderCalculatorAdditionalService
  initialAdditionalEquipment: FullInitialAdditionalEquipment | OrderCalculatorAdditionalService
  initialBankAdditionalService: OrderCalculatorBankAdditionalService
  isLoadedCreditProducts: boolean
}
export function useAdditionalServices({
  vendorOptions,
  clientAge,
  currentRateMod,
  isLoadedCreditProducts,
  initialDealerAdditionalService,
  initialAdditionalEquipment,
  initialBankAdditionalService,
}: Params) {
  const { values, setFieldValue, submitCount, isValid } = useFormikContext<BriefOrderCalculatorFields>()
  const { creditProduct, additionalEquipments, dealerAdditionalServices, bankAdditionalServices } = values
  const additionalEquipmentOptions = useMemo(
    () =>
      vendorOptions?.additionalOptions?.filter(option => option.optionType === OptionType.EQUIPMENT) || [],
    [vendorOptions?.additionalOptions],
  )
  const dealerAdditionalServiceOptions = useMemo(
    () => vendorOptions?.additionalOptions?.filter(option => option.optionType === OptionType.DEALER) || [],
    [vendorOptions?.additionalOptions],
  )

  const bankAdditionalServiceOptions = useMemo(() => {
    // Если кредитный продукт отсутстует, то возвращаем пустой список,
    // т.к при пустом кредитном продукте нельзя выбирать банковские услуги
    if (!creditProduct) {
      return []
    }
    // получаем список банковских услуг с optionType === BANK и подходящими по возврасту
    const bankAdditionalList = vendorOptions?.additionalOptions?.filter(option => {
      const isBankOption = option.optionType === OptionType.BANK
      // Если clientAge отсутствует, то банковские опции недоступны
      if (!checkIsNumber(clientAge)) {
        return false
      }

      const isValidClientAge = option.tariffs?.some(tariff => {
        const { minClientAge, maxClientAge } = tariff
        if (!checkIsNumber(minClientAge) || !checkIsNumber(maxClientAge)) {
          return false
        }

        return (
          (clientAge as number) >= (minClientAge as number) &&
          (clientAge as number) <= (maxClientAge as number)
        )
      })

      return isBankOption && isValidClientAge
    })

    // На данном шаге получаем доп. услуги банка, которые продаются по промо и квази-промо.
    const promoBankOptions = bankAdditionalList?.filter(
      option => option.optionId === currentRateMod?.optionId,
    )

    return [
      // // возвращаем найденные промо услуги
      ...(promoBankOptions ?? []),
      // и валидные услуги найденные в первом шаге, но имеющие признак saleMethod === 1,
      ...(bankAdditionalList?.filter(option => option.saleMethod === SaleMethod.STAND_ALONE) ?? []),
    ] as BankAdditionalOption[]
  }, [creditProduct, vendorOptions?.additionalOptions, clientAge, currentRateMod?.optionId])
  // если КП не выбран или не загрузился список кредитных продуктов
  const isShowAdditionalServices = !!creditProduct && isLoadedCreditProducts
  const additionalEquipmentsRef = useRef(additionalEquipments)
  const dealerAdditionalServicesRef = useRef(dealerAdditionalServices)
  const bankAdditionalServicesRef = useRef(bankAdditionalServices)
  const prevSubmitCountRef = useRef<number>(submitCount)
  const prevCurrentProduct = useRef<string | null>(null)
  const prevPrevCurrentProduct = useRef<string | null>(null)

  const isPrevCurrentProductEqual = prevCurrentProduct.current === creditProduct
  const isPrevPrevCurrentProductEqual = prevPrevCurrentProduct.current === creditProduct
  const isPrevCurrentProductNull = !prevCurrentProduct.current

  const updateAdditionalOptions = useCallback(
    (
      isNeedUpdate: boolean,
      servicesGroupName: ServicesGroupName,
      initialOptions: AdditionalOptions,
      currentOptions: OrderCalculatorAdditionalService[] | OrderCalculatorBankAdditionalService[],
      savedOptionsRef: React.MutableRefObject<
        OrderCalculatorAdditionalService[] | OrderCalculatorBankAdditionalService[]
      >,
    ) => {
      // Если продукт не менялся, то ничего не делаем или кредитные продукты еще не загрузились
      if (isPrevCurrentProductEqual || !isLoadedCreditProducts) {
        return
      }
      // Если предыдущий КП не был пустым значением,
      // cохраняем текущие значения доп. услуг в рефе, и очишаем в форме
      if (!isNeedUpdate && !isEqual(currentOptions, initialOptions) && !isPrevCurrentProductNull) {
        savedOptionsRef.current = currentOptions
        setFieldValue(servicesGroupName, initialOptions)
      }
      // Загружаем из рефа значения доп. услуг в форму
      if (
        isNeedUpdate &&
        isPrevCurrentProductNull &&
        savedOptionsRef.current &&
        !isEqual(currentOptions, savedOptionsRef.current)
      ) {
        setFieldValue(servicesGroupName, savedOptionsRef.current)
      }
    },
    [isLoadedCreditProducts, isPrevCurrentProductEqual, isPrevCurrentProductNull, setFieldValue],
  )

  useEffect(() => {
    // Если нажали на кнопку рассчитать
    // то сбрасываем сохраненные значения допников, так как их больше подставлять в форму не нужно
    if (isValid && submitCount > prevSubmitCountRef.current) {
      additionalEquipmentsRef.current = [initialAdditionalEquipment]
      dealerAdditionalServicesRef.current = [initialDealerAdditionalService]
      bankAdditionalServicesRef.current = [initialBankAdditionalService]
      prevSubmitCountRef.current = submitCount
    }
  }, [
    initialAdditionalEquipment,
    initialBankAdditionalService,
    initialDealerAdditionalService,
    isValid,
    submitCount,
  ])

  // Сохраняем доп.оборудование в реф, или загружаем их из рефа в форму
  useEffect(() => {
    updateAdditionalOptions(
      !!creditProduct,
      ServicesGroupName.additionalEquipments,
      [initialAdditionalEquipment],
      additionalEquipments,
      additionalEquipmentsRef,
    )
  }, [additionalEquipments, creditProduct, initialAdditionalEquipment, updateAdditionalOptions])

  // Сохраняем доп.услуги дилера в реф, или загружаем их из рефа в форму
  useEffect(() => {
    updateAdditionalOptions(
      !!creditProduct,
      ServicesGroupName.dealerAdditionalServices,
      [initialDealerAdditionalService],
      dealerAdditionalServices,
      dealerAdditionalServicesRef,
    )
  }, [creditProduct, dealerAdditionalServices, initialDealerAdditionalService, updateAdditionalOptions])

  /* Сохраняем банковские доп.услуги банка в реф, или загружаем их из рефа в форму
  Отличие от других доп услуг в том, что банковские доп услуги очищаются из формы при любом изменении КП,
  а загружаются только, если КП сменился из пустого значение на то, которое было до выборо пустого
  (конкретный КП -> КП не выбран -> конкретный КП(тот же самый)) */
  useEffect(() => {
    updateAdditionalOptions(
      !!isPrevPrevCurrentProductEqual,
      ServicesGroupName.bankAdditionalServices,
      [initialBankAdditionalService],
      bankAdditionalServices,
      bankAdditionalServicesRef,
    )
  }, [
    bankAdditionalServices,
    initialBankAdditionalService,
    isPrevPrevCurrentProductEqual,
    updateAdditionalOptions,
  ])

  // Сохраняем предыдущее КП и пред-предыдущее КП
  useEffect(() => {
    prevPrevCurrentProduct.current = prevCurrentProduct.current || null
    prevCurrentProduct.current = creditProduct || null
  }, [creditProduct])

  return {
    additionalEquipmentOptions,
    dealerAdditionalServiceOptions,
    bankAdditionalServiceOptions,
    isShowAdditionalServices,
  }
}
