import { useCallback } from 'react'

import { ApplicationFrontdc, GetFullApplicationResponse } from '@sberauto/loanapplifecycledc-proto/public'

import { ApplicationTypes } from 'entities/application/application.utils'
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

      return {
        dcAppId: fullApplication?.application?.dcAppId,
        unit,
        anketaType: isFormValid ? ApplicationTypes.complete : ApplicationTypes.incomplete,
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
