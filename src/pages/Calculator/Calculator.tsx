import { useCallback, useEffect, useState } from 'react'

import { Typography } from '@mui/material'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { OrderCalculator } from 'common/OrderCalculator'
import { clearOrder } from 'entities/order'
import { appRoutePaths } from 'shared/navigation/routerPath'
import { CircularProgressWheel } from 'shared/ui/CircularProgressWheel'

import { useStyles } from './Calculator.styles'

export interface CreateOrderPageState {
  isFullCalculator: boolean
  applicationId?: string
  saveDraftDisabled?: boolean
}

export function Calculator() {
  const classes = useStyles()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // Необходим, чтобы калькулятор не успел подтянуть данные из стора
  const [isLoading, setLoading] = useState(true)

  const nextStep = useCallback(() => {
    navigate(appRoutePaths.createOrder, {
      state: { isHasLoanData: true },
    })
  }, [navigate])

  useEffect(() => {
    dispatch(clearOrder())
    setLoading(false)
  }, [dispatch])

  return (
    <div className={classes.page} data-testid="calculator">
      <Typography className={classes.pageTitle}>Параметры кредита</Typography>
      {isLoading ? <CircularProgressWheel size="extraLarge" /> : <OrderCalculator nextStep={nextStep} />}
    </div>
  )
}
