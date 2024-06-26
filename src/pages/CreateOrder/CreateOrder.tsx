import { useCallback, useEffect, useMemo, useRef } from 'react'

import { Box, Step, StepIcon, StepLabel, Stepper, Typography } from '@mui/material'
import cx from 'classnames'
import { useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'

import { OrderCalculator } from 'common/OrderCalculator'
import { OrderContext } from 'common/OrderCalculator'
import { clearOrder, setCurrentStep, updateApplication, updateOrder } from 'entities/reduxStore/orderSlice'
import { useAppSelector } from 'shared/hooks/store/useAppSelector'
import { CustomTooltip } from 'shared/ui/CustomTooltip/CustomTooltip'

import { ClientForm } from './ClientForm'
import { useStyles } from './CreateOrder.styles'
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
const getTitle = ({
  isExistingApplication,
  isFullCalculator,
  isHasEmailId,
}: {
  isExistingApplication: boolean
  isFullCalculator: boolean
  isHasEmailId: boolean
}) => {
  if (isHasEmailId) {
    return 'Заявка на кредит (из письма)'
  }
  if (isExistingApplication) {
    if (isFullCalculator) {
      return 'Дополнение заявки на кредит'
    } else {
      return 'Редактирование заявки на кредит'
    }
  }

  return 'Заявка на кредит'
}

export interface CreateOrderPageState {
  isFullCalculator: boolean
  saveDraftDisabled?: boolean
  isHasLoanData?: boolean
  isExistingApplication?: boolean
  emailId?: number
}

export function CreateOrder() {
  const classes = useStyles()
  const dispatch = useDispatch()
  const location = useLocation()
  const order = useAppSelector(state => state.order.order)
  const { isFilledElementaryClientData = false, isFilledLoanData = false } = useAppSelector(
    state => state.order.order?.fillingProgress || {},
  )
  // Если locationState определено, значит на страницу попали из существующей заявки
  const locationState = (location.state || {}) as CreateOrderPageState
  const {
    isExistingApplication = false,
    isHasLoanData = false,
    isFullCalculator = false,
    emailId,
  } = locationState

  const title = getTitle({ isExistingApplication, isFullCalculator, isHasEmailId: !!emailId })
  const steps = useMemo(() => (isExistingApplication ? STEPS.slice(1) : STEPS), [isExistingApplication])
  const currentStepIdx = order?.currentStep ?? 0
  const saveValueToStoreRef = useRef<(() => void) | null>(null)

  const currentStep = useMemo(() => steps[currentStepIdx], [currentStepIdx, steps])

  const checkIsActiveStep = (idx: number) => {
    switch (idx) {
      case 1:
        return isExistingApplication ? isFilledLoanData : isFilledElementaryClientData
      case 2:
        return isFilledElementaryClientData && isFilledLoanData
      default:
        return currentStepIdx >= idx
    }
  }

  const handleStepChange = (stepIdx: number) => () => {
    if (checkIsActiveStep(stepIdx)) {
      /* Если на каком-то шаге не было изменений, то при смене этого шага будет вызван saveValueToStoreRef
      предыдущего шага, что может привести к багам. Потому после вызова saveValueToStoreRef удаляем его */
      saveValueToStoreRef.current?.()
      saveValueToStoreRef.current = null
      dispatch(setCurrentStep(stepIdx))
    }
  }

  const nextStep = useCallback(
    (nextId?: number) => {
      if (currentStepIdx < steps.length - 1) {
        scrollContainerRef.current?.parentElement?.scroll({ top: 0 })
        dispatch(setCurrentStep(nextId ?? currentStepIdx + 1))
      }
    },
    [currentStepIdx, dispatch, steps.length],
  )

  const handleFormChange = useCallback((saveValuesToStore: () => void) => {
    saveValueToStoreRef.current = saveValuesToStore
  }, [])

  // Очищаем store если пришли на страницу не из существующей заявки и не из калькулятора
  useEffect(() => {
    if (!isExistingApplication && !isHasLoanData) {
      dispatch(clearOrder())
    }
  }, [dispatch, isExistingApplication, isHasLoanData])

  useEffect(() => {
    dispatch(updateOrder({ currentStep: currentStepIdx }))
  }, [currentStepIdx, dispatch])

  // Если есть emailId, значит пришли на страницу из письма, добавляем emailId в заявку
  useEffect(() => {
    if (emailId) {
      dispatch(updateApplication({ emailId }))
    }
  }, [dispatch, emailId])

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
                disabled={!checkIsActiveStep(idx)}
                active={checkIsActiveStep(idx)}
              >
                <CustomTooltip
                  key={step.label}
                  arrow
                  title={checkIsActiveStep(idx) ? '' : 'Для продолжения заполните данные предыдущего шага'}
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
        </Box>

        <OrderContext onChangeForm={handleFormChange}>
          {currentStep.label === StepKey.OrderSearchingForm && <OrderSearching nextStep={nextStep} />}
          {currentStep.label === StepKey.OrderSettings && <OrderCalculator nextStep={nextStep} />}
          {currentStep.label === StepKey.ClientForm && <ClientForm />}
        </OrderContext>
      </Box>
    </div>
  )
}
