import { useCallback, useState } from 'react'

import { ApplicationTable } from 'entities/application/ApplicationTable/ApplicationTable'
import { OrderData, OrderForm } from 'pages/CreateOrderPage/OrderSearching/components/OrderForm'
import { useAppDispatch } from 'shared/hooks/store/useAppDispatch'
import { useAppSelector } from 'shared/hooks/store/useAppSelector'

import { clearOrder, setOrder } from '../model/orderSlice'
import { NoMatchesModal } from './components/NoMatchesModal/NoMatchesModal'
import { useFindApplicationsQuery } from './OrderSearching.api'
import { useCheckIfSberClient } from './OrderSearching.hooks'
import { slIsOrderExist, slStorageOrder } from './OrderSearching.selectors'

type Props = {
  nextStep: () => void
  onApplicationOpen: (applicationId: string) => void
}

export function OrderSearching({ nextStep, onApplicationOpen }: Props) {
  const dispatch = useAppDispatch()
  const storageOrder = useAppSelector(slStorageOrder)
  const isOrderExist = useAppSelector(slIsOrderExist)

  const [isVisibleModal, setVisibleModal] = useState(false)
  const [isVisibleNewOrderForm, setIsVisibleNewOrderForm] = useState(() => isOrderExist)
  /** Данные для формы поиска */
  const [initialOrderData, setInitialOrderData] = useState<OrderData | undefined>(() => storageOrder)

  const openModal = useCallback(() => {
    setVisibleModal(true)
  }, [])

  const closeModal = useCallback(() => setVisibleModal(false), [])

  const {
    isSuccess: isSuccessFindApplicationsQuery,
    isLoading: isLoadingFindApplicationsQuery,
    refetch,
    data: orderData = [],
  } = useFindApplicationsQuery(initialOrderData)

  const findOrders = useCallback(
    (data: OrderData) => {
      // Если менеджер начал искать заявку, значит считаем что со старой он уже не работает
      dispatch(clearOrder())
      // Показываем форму создания заявки после нажатия на кнопку "Найти"
      setIsVisibleNewOrderForm(true)

      setInitialOrderData(data)

      requestAnimationFrame(() => {
        refetch()
      })
    },
    [dispatch, refetch],
  )

  const onCreateOrder = useCallback(
    (isClient: boolean, orderData?: OrderData) => {
      if (isClient && orderData) {
        /** Проверяем изменились ли данные на форме после перехода на нее
         * Если на этом шаге не изменились, то не обновляем данные заявки.
         * Иначе перезаписываем данные по заявке */
        const isDataChange = !Object.keys(orderData).reduce((prev, currKey) => {
          const key = currKey as keyof OrderData

          return prev && storageOrder[key] === orderData[key]
        }, true)

        if (isDataChange) {
          dispatch(setOrder(orderData))
        }

        nextStep()
      } else {
        openModal()
      }
    },
    [dispatch, nextStep, openModal, storageOrder],
  )

  const checkIfSberClient = useCheckIfSberClient({ onSuccess: onCreateOrder })

  const checkClient = useCallback(
    (data: OrderData) => checkIfSberClient.mutateAsync(data),
    [checkIfSberClient],
  )

  const onHideCreateForm = useCallback(() => {
    // скрываем форму создания заявки если в форме поиска были изменены данные
    setIsVisibleNewOrderForm(false)
  }, [])

  const isShowNewForm =
    isSuccessFindApplicationsQuery &&
    !isLoadingFindApplicationsQuery &&
    !orderData?.length &&
    isVisibleNewOrderForm

  return (
    <>
      <OrderForm
        onSubmit={findOrders}
        initialData={initialOrderData}
        isLoading={isLoadingFindApplicationsQuery}
        onChange={onHideCreateForm}
      />
      {isShowNewForm && (
        <OrderForm
          isNewOrder
          onSubmit={checkClient}
          initialData={initialOrderData}
          isLoading={checkIfSberClient.isLoading}
        />
      )}

      {isSuccessFindApplicationsQuery && !!orderData?.length && (
        <ApplicationTable
          // TODO DCB-194: Slice использован как временное решение на период работы с моками,
          // т.к. столько строк не нужно
          // Убрать slice.метод при интеграции с бэком
          data={orderData.slice(0, 3)}
          isLoading={false}
          rowsPerPage={-1}
          onClickRow={onApplicationOpen}
        />
      )}

      <NoMatchesModal isVisible={isVisibleModal} onClose={closeModal} />
    </>
  )
}
