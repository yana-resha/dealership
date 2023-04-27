import { useCallback, useMemo, useState } from 'react'

import { Box, Step, StepIcon, StepLabel, Stepper, Typography } from '@mui/material'

import { ClientDetailedDossier } from 'common/findApplication/ClientDetailedDossier/ClientDetailedDossier'
import { OrderSearching } from 'common/OrderSearching'

import { ClientForm } from '../../entities/ClientForm'
import { useStyles } from './CreateOrderPage.styles'

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

export function CreateOrderPage() {
  const classes = useStyles()

  const [currentStepIdx, setCurrentStepIdx] = useState(0)
  const currentStep = useMemo(() => steps[currentStepIdx], [currentStepIdx])

  const handleStepChange = useCallback(
    (stepIdx: number) => () => setCurrentStepIdx(prevIdx => (prevIdx > stepIdx ? stepIdx : prevIdx)),
    [],
  )
  const nextStep = useCallback(
    () => setCurrentStepIdx(prevIdx => (currentStepIdx < steps.length - 1 ? prevIdx + 1 : prevIdx)),
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
            {steps.map((step, idx) => (
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
          {currentStep.label === StepKey.ClientForm && <ClientForm />}
        </Box>
      )}
    </div>
  )
}
