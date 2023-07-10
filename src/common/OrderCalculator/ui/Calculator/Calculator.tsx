import React from 'react'

import { useLocation } from 'react-router-dom'

import { CreateOrderPageState } from 'pages/CreateOrderPage/CreateOrderPage'
import { FullOrderSettings } from 'pages/CreateOrderPage/FullOrderSettings'
import { OrderSettings } from 'pages/CreateOrderPage/OrderSettings'

type Props = {
  nextStep: () => void
  onChangeForm: () => void
}

export function Calculator({ nextStep, onChangeForm }: Props) {
  const location = useLocation()
  const state = location.state as CreateOrderPageState
  const isFullCalculator = state?.isFullCalculator ?? false

  return (
    <>
      {isFullCalculator ? (
        <FullOrderSettings nextStep={nextStep} onChangeForm={onChangeForm} />
      ) : (
        <OrderSettings nextStep={nextStep} onChangeForm={onChangeForm} />
      )}
    </>
  )
}
