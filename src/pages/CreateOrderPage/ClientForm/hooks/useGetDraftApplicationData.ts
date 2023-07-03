import { useCallback } from 'react'

import { ApplicationFrontdc } from '@sberauto/loanapplifecycledc-proto/public'

import { ApplicationTypes } from 'entities/application/application.utils'
import { getPointOfSaleFromCookies } from 'entities/pointOfSale'
import { useGetUserQuery } from 'shared/api/requests/authdc'
import { useAppSelector } from 'shared/hooks/store/useAppSelector'
import { getFullName } from 'shared/utils/clientNameTransform'

export const useGetDraftApplicationData = () => {
  const { data: user } = useGetUserQuery()
  const { vendorCode } = getPointOfSaleFromCookies()
  const initialOrder = useAppSelector(state => state.order.order)
  const applicationId = initialOrder?.orderData?.application?.dcAppId

  return useCallback(
    (): ApplicationFrontdc => ({
      dcAppId: applicationId,
      anketaType: ApplicationTypes.initial,
      vendor: {
        vendorCode,
      },
      employees: {
        tabNumActual: user?.employeeId,
        fullNameCreated: getFullName(user?.firstName, user?.lastName),
      },
      specialMark: initialOrder?.orderData?.application?.specialMark,
      applicant: initialOrder?.orderData?.application?.applicant,
      loanCar: initialOrder?.orderData?.application?.loanCar,
      loanData: initialOrder?.orderData?.application?.loanData,
    }),
    [user, vendorCode],
  )
}
