import React from 'react'

import { useLocation } from 'react-router-dom'

import { FullOrderSettings } from 'pages/CreateOrderPage/FullOrderSettings'
import { OrderSettings } from 'pages/CreateOrderPage/OrderSettings'
import { useGetFullApplicationQuery } from 'shared/api/requests/loanAppLifeCycleDc'

import { CreateOrderPageState } from '../../../../pages/CreateOrderPage/CreateOrderPage'

type Props = {
  nextStep: () => void
}

export function Calculator({ nextStep }: Props) {
  const location = useLocation()
  const state = location.state as CreateOrderPageState
  const applicationId = state ? state.applicationId : undefined
  const isFullCalculator = state ? state.isFullCalculator : false
  const { isLoading } = useGetFullApplicationQuery({ applicationId }, { enabled: !!applicationId })

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
