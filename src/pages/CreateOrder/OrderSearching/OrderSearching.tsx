import { useCallback, useState } from 'react'

import { Skeleton } from '@mui/material'
import { useNavigate } from 'react-router-dom'

import { useFindApplicationsQuery } from 'common/findApplication/findApplications'
import { ApplicationTable } from 'entities/application/ApplicationTable/ApplicationTable'
import { updateApplication, updateFillingProgress, updateOrder } from 'entities/reduxStore/orderSlice'
import { OrderData, OrderForm } from 'pages/CreateOrder/OrderSearching/components/OrderForm'
import { useAppDispatch } from 'shared/hooks/store/useAppDispatch'
import { useAppSelector } from 'shared/hooks/store/useAppSelector'
import { appRoutes } from 'shared/navigation/routerPath'

import { NoMatchesModal } from './components/NoMatchesModal/NoMatchesModal'
import { useCheckIfSberClient } from './OrderSearching.hooks'
import { slIsOrderExist, slStorageOrder } from './OrderSearching.selectors'

type Props = {
  nextStep: () => void
}

export function OrderSearching({ nextStep }: Props) {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const storageOrder = useAppSelector(slStorageOrder)
  const isOrderExist = useAppSelector(slIsOrderExist)

  const [isVisibleModal, setVisibleModal] = useState(false)
  const [isCreatingFormTouched, setCreatingFormTouched] = useState(false)
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
    remove,
    data: orderData = [],
  } = useFindApplicationsQuery(initialOrderData, { enabled: false })

  const findOrders = useCallback(
    (data: OrderData) => {
      remove()
      // Показываем форму создания заявки после нажатия на кнопку "Найти"
      setIsVisibleNewOrderForm(true)

      setInitialOrderData(data)

      requestAnimationFrame(() => {
        refetch()
      })
    },
    [refetch, remove],
  )

  const onCreateOrder = useCallback(
    (isClient: boolean, orderData?: OrderData) => {
      // Моковый сценарий для тестировщиков: если в поле паспорта ввести нули,
      // то всегда будет всплывать модалка
      if (orderData?.passportSeries === '0000' && orderData?.passportNumber === '000000') {
        openModal()

        return
      }
      // Конец мокового сценария

      if (isClient && orderData) {
        /** Проверяем изменились ли данные на форме после перехода на нее
         * Если на этом шаге не изменились, то не обновляем данные заявки.
         * Иначе обновляем данные по заявке */
        const isDataChange = !Object.keys(orderData).reduce((prev, currKey) => {
          const key = currKey as keyof OrderData

          return prev && storageOrder[key] === orderData[key]
        }, true)
        dispatch(updateFillingProgress({ isFilledElementaryClientData: true }))
        if (isDataChange) {
          // Не перезаписываем, а дополняем заявку, т.к. юзер мог ранее заполнить шаг 2 (страница Калькулятор)
          dispatch(updateOrder(orderData))
          // Удаляем applicant - требование бизнеса - новый клиент, значит новая пустая анкета
          dispatch(updateApplication({ applicant: undefined }))
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

  const handleRowClick = (applicationId: string) => {
    navigate(appRoutes.order(applicationId))
  }

  const handleSearchingFormChange = useCallback(() => {
    // скрываем форму создания заявки если в форме поиска были изменены данные, скрываем предупреждения
    setIsVisibleNewOrderForm(false)
    setCreatingFormTouched(false)
    // Форма изменилась, значит isFilledElementaryClientData: false до новой проверки клиента
    dispatch(updateFillingProgress({ isFilledElementaryClientData: false }))
  }, [dispatch])

  const handleCreatingFormChange = useCallback(() => {
    // скрываем предупреждения если в форме создания новой заявки начался ввод данных
    setCreatingFormTouched(true)
    // Форма изменилась, значит isFilledElementaryClientData: false до новой проверки клиента
    dispatch(updateFillingProgress({ isFilledElementaryClientData: false }))
  }, [dispatch])

  const isShowNewForm =
    isSuccessFindApplicationsQuery &&
    !isLoadingFindApplicationsQuery &&
    !orderData?.length &&
    isVisibleNewOrderForm

  return (
    <>
      <OrderForm
        isShowWarning={isShowNewForm && !isCreatingFormTouched}
        initialData={initialOrderData}
        isLoading={isLoadingFindApplicationsQuery}
        onSubmit={findOrders}
        onChange={handleSearchingFormChange}
        isDisabledSubmit={isShowNewForm}
      />

      {isLoadingFindApplicationsQuery ? (
        <>
          <Skeleton height={72} width="100%" />
          <Skeleton height={72} width="100%" />
          <Skeleton height={72} width="100%" />
        </>
      ) : (
        <>
          {isShowNewForm && (
            <OrderForm
              isNewOrder
              initialData={initialOrderData}
              isLoading={checkIfSberClient.isLoading}
              onSubmit={checkClient}
              onChange={handleCreatingFormChange}
            />
          )}

          {isSuccessFindApplicationsQuery && !!orderData?.length && (
            <ApplicationTable
              data={orderData}
              isLoading={false}
              rowsPerPage={-1}
              onClickRow={handleRowClick}
            />
          )}
        </>
      )}

      <NoMatchesModal isVisible={isVisibleModal} onClose={closeModal} />
    </>
  )
}
