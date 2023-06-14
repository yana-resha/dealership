import React from 'react'

import { FullOrderSettings } from 'pages/CreateOrderPage/FullOrderSettings'
import { OrderSettings } from 'pages/CreateOrderPage/OrderSettings'
import { useGetFullApplicationQuery } from 'shared/api/requests/loanAppLifeCycleDc'

type Props = {
  applicationId?: string
  nextStep: () => void
}

export function Calculator({ applicationId, nextStep }: Props) {
  const { data: fullApplicationData, isLoading } = useGetFullApplicationQuery(
    { applicationId },
    { enabled: !!applicationId },
  )
  const isFullCalculator =
    applicationId != undefined &&
    !isLoading &&
    fullApplicationData &&
    fullApplicationData.application &&
    fullApplicationData.application.appType === 2

  if (isLoading) {
    return <>Loading Calculator...</>
  } else {
    return (
      <>
        {isFullCalculator ? (
          <FullOrderSettings nextStep={nextStep} applicationId={applicationId} />
        ) : (
          <OrderSettings nextStep={nextStep} applicationId={applicationId} />
        )}
      </>
    )
  }
}
