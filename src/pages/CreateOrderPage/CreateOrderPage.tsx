import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { Box, Step, StepIcon, StepLabel, Stepper, Typography } from '@mui/material'
import { FormikProps } from 'formik'
import { useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'

import { ClientDetailedDossier } from 'common/findApplication/ClientDetailedDossier/ClientDetailedDossier'
import { Calculator } from 'common/OrderCalculator/ui/Calculator/Calculator'

import { useAppSelector } from '../../shared/hooks/store/useAppSelector'
import { ClientForm } from './ClientForm'
import { ClientData } from './ClientForm/ClientForm.types'
import { useInitialValues } from './ClientForm/useInitialValues'
import { useStyles } from './CreateOrderPage.styles'
import { updateOrder } from './model/orderSlice'
import { OrderSearching } from './OrderSearching'

enum StepKey {
  OrderSearchingForm = 'orderSearchingForm',
  OrderSettings = 'orderSettings',
  ClientForm = 'clientForm',
}

const steps = [
  {
    label: StepKey.OrderSearchingForm,
    title: 'Проверка клиента',
    pageTitle: 'Заявка на кредит',
  },
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
  const location = useLocation()
  const locationState = location.state as CreateOrderPageState
  const initialOrder = useAppSelector(state => state.order.order)
  const dispatch = useDispatch()
  const [currentStepIdx, setCurrentStepIdx] = useState(initialOrder?.currentStep ?? 0)
  const applicationSteps = locationState ? steps.slice(1) : steps
  const currentStep = useMemo(() => applicationSteps[currentStepIdx], [currentStepIdx, applicationSteps])
  const formRef = useRef<FormikProps<ClientData>>(null)
  const { remapApplicationValues } = useInitialValues()

  useEffect(() => {
    dispatch(updateOrder({ currentStep: currentStepIdx }))
  }, [currentStepIdx])

  const handleStepChange = useCallback(
    (stepIdx: number) => () => {
      if (formRef.current) {
        remapApplicationValues(formRef.current.values)
      }
      setCurrentStepIdx(prevIdx => (prevIdx > stepIdx ? stepIdx : prevIdx))
    },
    [remapApplicationValues],
  )
  const nextStep = useCallback(() => {
    setCurrentStepIdx(prevIdx => (currentStepIdx < applicationSteps.length - 1 ? prevIdx + 1 : prevIdx))
  }, [currentStepIdx])

  const [detailedApplicationId, setDetailedApplicationId] = useState<string | undefined>(undefined)
  const onBackButton = () => {
    setDetailedApplicationId(undefined)
  }
  const handleApplicationOpen = (applicationId: string) => {
    setDetailedApplicationId(applicationId)
  }

  return (
    <div className={classes.page} data-testid="dealershipPage">
      {detailedApplicationId ? (
        <ClientDetailedDossier applicationId={detailedApplicationId} onBackButton={onBackButton} />
      ) : (
        <Box className={classes.loaderContainer}>
          <Typography className={classes.pageTitle}>{currentStep.pageTitle}</Typography>

          <Stepper activeStep={currentStepIdx} className={classes.stepContainer}>
            {applicationSteps.map((step, idx) => (
              <Step key={step.label} className={classes.step} onClick={handleStepChange(idx)}>
                <StepLabel
                  StepIconComponent={props => (
                    <StepIcon
                      {...props}
                      icon={props.icon}
                      active={props.active || props.completed}
                      completed={false}
                    />
                  )}
                >
                  {step.title}
                </StepLabel>
              </Step>
            ))}
          </Stepper>

          {currentStep.label === StepKey.OrderSearchingForm && (
            <OrderSearching nextStep={nextStep} onApplicationOpen={handleApplicationOpen} />
          )}
          {currentStep.label === StepKey.OrderSettings && <Calculator nextStep={nextStep} />}
          {currentStep.label === StepKey.ClientForm && <ClientForm formRef={formRef} />}
        </Box>
      )}
    </div>
  )
}
