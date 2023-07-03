import React from 'react'

import { useLocation } from 'react-router-dom'

import { CreateOrderPageState } from 'pages/CreateOrderPage/CreateOrderPage'
import { FullOrderSettings } from 'pages/CreateOrderPage/FullOrderSettings'
import { OrderSettings } from 'pages/CreateOrderPage/OrderSettings'

type Props = {
  nextStep: () => void
}

export function Calculator({ nextStep }: Props) {
  const location = useLocation()
  const state = location.state as CreateOrderPageState
  const isFullCalculator = state?.isFullCalculator ?? false

  return (
    <>
      {isFullCalculator ? <FullOrderSettings nextStep={nextStep} /> : <OrderSettings nextStep={nextStep} />}
    </>
  )
}
