import { createSelector } from '@reduxjs/toolkit'

/** Получаем поля для шага поиска заявки (например, если мы перешли сюда с более позднего шага) */
export const slStorageOrder = createSelector(
  (state: RootState) => state.order,
  order => ({
    birthDate: order.order?.birthDate,
    firstName: order.order?.firstName,
    lastName: order.order?.lastName,
    middleName: order.order?.middleName,
    passportSeries: order.order?.passportSeries,
    passportNumber: order.order?.passportNumber,
    phoneNumber: order.order?.phoneNumber,
  }),
)

/** Есть ли заявка в процессе заполнения */
export const slIsOrderExist = createSelector(
  (state: RootState) => slStorageOrder(state),
  (order): boolean =>
    Object.keys(order).reduce<boolean>((prev, currKey) => {
      const key = currKey as keyof typeof order

      return prev && !!order[key]
    }, true),
)
