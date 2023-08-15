import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { Box, Step, StepIcon, StepLabel, Stepper, Typography } from '@mui/material'
import { FormikProps } from 'formik'
import { useDispatch } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'

import { Calculator } from 'common/OrderCalculator/ui/Calculator/Calculator'
import { OrderContext } from 'common/OrderCalculator/ui/OrderContext'
import { updateOrder } from 'entities/reduxStore/orderSlice'
import { appRoutes } from 'shared/navigation/routerPath'

import { useAppSelector } from '../../shared/hooks/store/useAppSelector'
import { ClientForm } from './ClientForm'
import { ClientData } from './ClientForm/ClientForm.types'
import { useInitialValues } from './ClientForm/hooks/useInitialValues'
import { useStyles } from './CreateOrderPage.styles'
import { OrderSearching } from './OrderSearching'

enum StepKey {
  OrderSearchingForm = 'orderSearchingForm',
  OrderSettings = 'orderSettings',
  ClientForm = 'clientForm',
}

const steps = [
  // {
  //   label: StepKey.OrderSearchingForm,
  //   title: 'Проверка клиента',
  //   pageTitle: 'Заявка на кредит',
  // },
  {
    label: StepKey.OrderSettings,
    title: 'Параметры кредита',
    pageTitle: 'Заявка на кредит',
  },
  {
    label: StepKey.ClientForm,
    title: 'Анкета клиента',
    pageTitle: 'Персональные данные',
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
  const { remapApplicationValues } = useInitialValues()

  const locationState = location.state as CreateOrderPageState

  const [currentStepIdx, setCurrentStepIdx] = useState(initialOrder?.currentStep ?? 0)
  const [isEnabledLastStep, setEnabledLastStep] = useState(false)
  const [isEnabledSearchOrder, setEnabledSearchOrder] = useState(!locationState)

  const changeEnabledSearchOrder = useCallback(() => {
    setEnabledSearchOrder(false)
    navigate(location.pathname, {
      state: { ...locationState, currentStep: currentStepIdx },
      replace: true,
    })
  }, [currentStepIdx, location.pathname, locationState, navigate])

  const formRef = useRef<FormikProps<ClientData>>(null)

  const currentStep = useMemo(() => steps[currentStepIdx], [currentStepIdx])

  const handleStepChange = useCallback(
    (stepIdx: number) => () => {
      if ((isEnabledLastStep && stepIdx === steps.length - 1) || currentStepIdx > stepIdx) {
        if (formRef.current) {
          remapApplicationValues(formRef.current.values)
        }
        setCurrentStepIdx(stepIdx)
      }
    },
    [currentStepIdx, isEnabledLastStep, remapApplicationValues],
  )
  const nextStep = useCallback(() => {
    setCurrentStepIdx(prevIdx => (currentStepIdx < steps.length - 1 ? prevIdx + 1 : prevIdx))
  }, [currentStepIdx])

  const handleApplicationOpen = (applicationId: string) => {
    navigate(appRoutes.order(applicationId))
  }

  const enableLastStep = useCallback(() => setEnabledLastStep(true), [])
  const disableLastStep = useCallback(() => setEnabledLastStep(false), [])

  useEffect(() => {
    dispatch(updateOrder({ currentStep: currentStepIdx }))
  }, [currentStepIdx, dispatch])

  const isActiveLastStep = (idx: number) => isEnabledLastStep && idx === steps.length - 1

  const scrolContainerRef = useRef<HTMLDivElement | null>(null)

  return (
    <div className={classes.page} data-testid="dealershipPage" ref={scrolContainerRef}>
      <OrderContext scrolContainer={scrolContainerRef.current?.parentElement ?? null}>
        <Box className={classes.loaderContainer}>
          <Typography className={classes.pageTitle}>{currentStep.pageTitle}</Typography>

          {isEnabledSearchOrder ? (
            <OrderSearching
              nextStep={changeEnabledSearchOrder}
              onApplicationOpen={handleApplicationOpen}
              onMount={disableLastStep}
            />
          ) : (
            <>
              <Stepper activeStep={currentStepIdx} className={classes.stepContainer}>
                {steps.map((step, idx) => (
                  <Step
                    key={step.label}
                    className={classes.step}
                    onClick={handleStepChange(idx)}
                    disabled={!(isActiveLastStep(idx) || currentStepIdx >= idx)}
                    active={isActiveLastStep(idx) || currentStepIdx >= idx}
                  >
                    <StepLabel
                      StepIconComponent={props => <StepIcon {...props} icon={props.icon} completed={false} />}
                    >
                      {step.title}
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>
              {currentStep.label === StepKey.OrderSettings && (
                <Calculator nextStep={nextStep} onChangeForm={disableLastStep} />
              )}
              {currentStep.label === StepKey.ClientForm && (
                <ClientForm formRef={formRef} onMount={enableLastStep} />
              )}
            </>
          )}
        </Box>
      </OrderContext>
    </div>
  )
}
