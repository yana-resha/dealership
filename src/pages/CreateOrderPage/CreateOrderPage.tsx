import { useCallback, useMemo, useState } from 'react'

import { Box, Step, StepIcon, StepLabel, Stepper, Typography } from '@mui/material'
import { useLocation } from 'react-router-dom'

import { ClientDetailedDossier } from 'common/findApplication/ClientDetailedDossier/ClientDetailedDossier'
import { SpecialMarkContextWrapper } from 'entities/SpecialMark'

import { Calculator } from '../../common/OrderCalculator/ui/Calculator/Calculator'
import { ClientForm } from './ClientForm'
import { useStyles } from './CreateOrderPage.styles'
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
  const state = location.state as CreateOrderPageState
  const applicationId = state ? state.applicationId : undefined
  const isFullCalculator = state ? state.isFullCalculator : false
  const saveDraftDisabled = state && state.saveDraftDisabled != undefined ? state.saveDraftDisabled : false
  const [currentStepIdx, setCurrentStepIdx] = useState(0)
  const applicationSteps = state ? steps.slice(1) : steps
  const currentStep = useMemo(() => applicationSteps[currentStepIdx], [currentStepIdx, applicationSteps])

  const handleStepChange = useCallback(
    (stepIdx: number) => () => setCurrentStepIdx(prevIdx => (prevIdx > stepIdx ? stepIdx : prevIdx)),
    [],
  )
  const nextStep = useCallback(
    () =>
      setCurrentStepIdx(prevIdx => (currentStepIdx < applicationSteps.length - 1 ? prevIdx + 1 : prevIdx)),
    [currentStepIdx],
  )

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

          <SpecialMarkContextWrapper>
            {currentStep.label === StepKey.OrderSearchingForm && (
              <OrderSearching nextStep={nextStep} onApplicationOpen={handleApplicationOpen} />
            )}
            {currentStep.label === StepKey.OrderSettings && <Calculator nextStep={nextStep} />}
            {currentStep.label === StepKey.ClientForm && <ClientForm />}
          </SpecialMarkContextWrapper>
        </Box>
      )}
    </div>
  )
}
