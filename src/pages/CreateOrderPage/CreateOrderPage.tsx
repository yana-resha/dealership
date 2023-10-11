import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { Box, Button, Step, StepIcon, StepLabel, Stepper, Typography } from '@mui/material'
import cx from 'classnames'
import { useDispatch } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'

import { ReactComponent as KeyboardArrowLeft } from 'assets/icons/keyboardArrowLeft.svg'
import { clearOrder, updateOrder } from 'entities/reduxStore/orderSlice'
import { Calculator } from 'pages/CreateOrderPage/Calculator/Calculator'
import { OrderContext } from 'pages/CreateOrderPage/Calculator/OrderContext'
import { appRoutes } from 'shared/navigation/routerPath'
import { CustomTooltip } from 'shared/ui/CustomTooltip/CustomTooltip'

import { useAppSelector } from '../../shared/hooks/store/useAppSelector'
import { ClientForm } from './ClientForm'
import { useStyles } from './CreateOrderPage.styles'
import { OrderSearching } from './OrderSearching'

enum StepKey {
  OrderSearchingForm = 'orderSearchingForm',
  OrderSettings = 'orderSettings',
  ClientForm = 'clientForm',
}

const STEPS = [
  {
    label: StepKey.OrderSearchingForm,
    title: 'Проверка клиента',
  },
  {
    label: StepKey.OrderSettings,
    title: 'Параметры кредита',
  },
  {
    label: StepKey.ClientForm,
    title: 'Анкета клиента',
  },
]

export interface CreateOrderPageState {
  isFullCalculator: boolean
  applicationId?: string
  saveDraftDisabled?: boolean
}

export function CreateOrderPage() {
  const classes = useStyles()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const initialOrder = useAppSelector(state => state.order.order)
  const isSkippedClientData = useAppSelector(state => state.order.order?.isSkippedClientData)

  // Если locationState определено, значит на страницу попали из существующей заявки
  const locationState = location.state as CreateOrderPageState
  const isNewOrder = !locationState
  const title = isNewOrder
    ? 'Заявка на кредит'
    : locationState.isFullCalculator
    ? 'Дополнение заявки на кредит'
    : 'Редактирование заявки на кредит'

  const steps = useMemo(() => (isNewOrder ? STEPS : STEPS.slice(1)), [isNewOrder])

  const [currentStepIdx, setCurrentStepIdx] = useState(initialOrder?.currentStep ?? 0)
  const [isEnabledLastStep, setEnabledLastStep] = useState(false)

  const saveValueToStoreRef = useRef<() => void>(() => {})

  const currentStep = useMemo(() => steps[currentStepIdx], [currentStepIdx, steps])

  const handleStepChange = (stepIdx: number) => () => {
    if ((isEnabledLastStep && stepIdx === steps.length - 1) || currentStepIdx > stepIdx) {
      saveValueToStoreRef.current()
      setCurrentStepIdx(stepIdx)
    }
  }
  const isActiveLastStep = (idx: number) => isEnabledLastStep && idx === steps.length - 1
  const checkIsDisabledStep = (idx: number) => !(isActiveLastStep(idx) || currentStepIdx >= idx)

  const nextStep = useCallback(() => {
    if (!isSkippedClientData) {
      scrollContainerRef.current?.parentElement?.scroll({ top: 0 })
      setCurrentStepIdx(prevIdx => (currentStepIdx < steps.length - 1 ? prevIdx + 1 : prevIdx))
    }
  }, [currentStepIdx, isSkippedClientData, steps.length])

  const skipStep = useCallback(() => {
    dispatch(updateOrder({ isSkippedClientData: true }))

    nextStep()
  }, [dispatch, nextStep])

  const handleApplicationOpen = (applicationId: string) => {
    navigate(appRoutes.order(applicationId))
  }

  const enableLastStep = useCallback(() => setEnabledLastStep(true), [])
  const disableLastStep = useCallback(() => setEnabledLastStep(false), [])

  const handleOrderSearchingMount = useCallback(() => {
    dispatch(updateOrder({ isSkippedClientData: false }))
    disableLastStep()
  }, [disableLastStep, dispatch])

  const handleFormChange = useCallback((saveValuesToStore: () => void) => {
    saveValueToStoreRef.current = saveValuesToStore
  }, [])

  const handleCalculatorFormChange = useCallback(
    (saveValuesToStore: () => void) => {
      handleFormChange(saveValuesToStore)
      disableLastStep()
    },
    [disableLastStep, handleFormChange],
  )

  useEffect(() => {
    if (isNewOrder) {
      dispatch(clearOrder())
    }
  }, [dispatch, isNewOrder])

  useEffect(() => {
    dispatch(updateOrder({ currentStep: currentStepIdx }))
  }, [currentStepIdx, dispatch, isSkippedClientData])

  const scrollContainerRef = useRef<HTMLDivElement | null>(null)

  return (
    <div className={classes.page} data-testid="dealershipPage" ref={scrollContainerRef}>
      <Box className={classes.loaderContainer}>
        <Typography className={classes.pageTitle}>{title}</Typography>

        <Box className={classes.stepContainer}>
          <Stepper activeStep={currentStepIdx}>
            {steps.map((step, idx) => (
              <Step
                key={step.label}
                className={cx(classes.step, { [classes.currentStep]: currentStepIdx === idx })}
                onClick={handleStepChange(idx)}
                disabled={checkIsDisabledStep(idx)}
                active={isActiveLastStep(idx) || currentStepIdx >= idx}
              >
                <CustomTooltip
                  key={step.label}
                  arrow
                  title={checkIsDisabledStep(idx) ? 'Для продолжения заполните данные предыдущего шага' : ''}
                >
                  <StepLabel
                    StepIconComponent={props => <StepIcon {...props} icon={props.icon} completed={false} />}
                  >
                    {step.title}
                  </StepLabel>
                </CustomTooltip>
              </Step>
            ))}
          </Stepper>

          {currentStep.label === StepKey.OrderSearchingForm && (
            <Button
              className={classes.skipBtn}
              type="button"
              variant="outlined"
              endIcon={<KeyboardArrowLeft className={classes.skipBtnIcon} />}
              onClick={skipStep}
            >
              Пропустить
            </Button>
          )}
        </Box>

        <OrderContext onChangeForm={handleFormChange} onChangeCalculatorForm={handleCalculatorFormChange}>
          {currentStep.label === StepKey.OrderSearchingForm && (
            <OrderSearching
              nextStep={nextStep}
              onApplicationOpen={handleApplicationOpen}
              onMount={handleOrderSearchingMount}
            />
          )}
          {currentStep.label === StepKey.OrderSettings && <Calculator nextStep={nextStep} />}
          {currentStep.label === StepKey.ClientForm && <ClientForm onMount={enableLastStep} />}
        </OrderContext>
      </Box>
    </div>
  )
}
