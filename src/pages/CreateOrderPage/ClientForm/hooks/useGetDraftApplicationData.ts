import { useCallback } from 'react'

import { ApplicationFrontdc, GetFullApplicationResponse } from '@sberauto/loanapplifecycledc-proto/public'

import { AnketaType } from 'entities/application/application.utils'
import { getPointOfSaleFromCookies } from 'entities/pointOfSale'
import { useGetUserQuery } from 'shared/api/requests/authdc'
import { getFullName } from 'shared/utils/clientNameTransform'

export const useGetDraftApplicationData = () => {
  const { data: user } = useGetUserQuery()
  const { vendorCode, unit } = getPointOfSaleFromCookies()

  return useCallback(
    (fullApplication: GetFullApplicationResponse, isFormValid: boolean): ApplicationFrontdc => {
      // Форматируем значения для loanCar
      const preparedLoanCar = fullApplication?.application?.loanCar
        ? { ...fullApplication?.application?.loanCar }
        : undefined
      if (preparedLoanCar && preparedLoanCar.mileage === '') {
        // mileage не должен быть пустой строкой
        preparedLoanCar.mileage = '0'
      }

      const anketaType =
        fullApplication?.application?.anketaType === AnketaType.Full
          ? AnketaType.Full
          : isFormValid
          ? AnketaType.Complete
          : AnketaType.Incomplete

      /* TODO Обсудить - кажется, этот хук уже не нужен. useCallback используется всегда в компоненте
      ClientForm, и всегда на вход получает данные из функции remapApplicationValues, которая также
      занимается подготовкой данных. Может стоит их объеденить? */
      return {
        // Раньше spread не было, т.е. не все входные данные уходили на выход. Так было задумано намеренно?
        ...fullApplication.application,
        dcAppId: fullApplication?.application?.dcAppId,
        unit,
        anketaType,
        vendor: {
          ...fullApplication?.application?.vendor,
          vendorCode,
        },
        employees: {
          tabNumActual: user?.employeeId,
          fullNameCreated: getFullName(user?.firstName, user?.lastName),
        },
        specialMark: fullApplication?.application?.specialMark,
        applicant: fullApplication?.application?.applicant,
        loanCar: preparedLoanCar,
        loanData: fullApplication?.application?.loanData,
      }
    },
    [user, unit, vendorCode],
  )
}
