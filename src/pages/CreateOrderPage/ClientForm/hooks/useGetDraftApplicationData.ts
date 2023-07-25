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
    (fullApplication: GetFullApplicationResponse, isFormValid: boolean): ApplicationFrontdc => ({
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
      loanCar: fullApplication?.application?.loanCar,
      loanData: fullApplication?.application?.loanData,
    }),
    [user, unit, vendorCode],
  )
}
