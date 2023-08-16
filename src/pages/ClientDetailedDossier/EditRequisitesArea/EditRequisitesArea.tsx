import React, { useCallback, useState } from 'react'

import { Box, Button, Divider } from '@mui/material'
import { Form, Formik } from 'formik'

import { ModalDialog } from 'shared/ui/ModalDialog/ModalDialog'
import SberTypography from 'shared/ui/SberTypography/SberTypography'

import { editRequisitesValidationSchema } from '../../../entities/application/AdditionalOptionsRequisites/configs/editRequisitesValidation'
import { ServicesGroupName } from '../../../entities/application/AdditionalOptionsRequisites/hooks/useAdditionalServicesOptions'
import {
  AdditionalEquipmentRequisites,
  DealerCenterRequisites,
  DealerServicesRequisites,
} from '../../../entities/application/AdditionalOptionsRequisites/ui'
import { AdditionalOptions, mockRequisites } from './__tests__/EditRequisitesArea.mock'
import { useStyles } from './EditRequisitesArea.styles'
import { useInitialValues } from './useInitialValues'

export interface DossierRequisites {
  legalPerson: string
  loanAmount: string
  isCustomFields: boolean
  bankIdentificationCode: string
  beneficiaryBank: string
  bankAccountNumber: string
  correspondentAccount: string
  taxPresence: boolean
  dealerAdditionalServices: AdditionalOptions[]
  additionalEquipments: AdditionalOptions[]
  taxation: string
}

type Props = {
  applicationId: string
  changeRequisites: (value: boolean) => void
}

export function EditRequisitesArea({ applicationId, changeRequisites }: Props) {
  const classes = useStyles()
  // const requisites = mockRequisites()

  const [isReturnDialogOpen, setIsReturnDialogOpen] = useState(false)
  const [isSendToDecisionDialogOpen, setIsSendToDecisionDialogOpen] = useState(false)
  const [values, setValues] = useState<DossierRequisites>()

  const initialValues = useInitialValues(applicationId)

  const showReturnDialog = useCallback(() => {
    setIsReturnDialogOpen(true)
  }, [])

  const closeReturnDialog = useCallback(() => {
    setIsReturnDialogOpen(false)
  }, [])

  const closeSendToDecisionDialog = useCallback(() => {
    setIsSendToDecisionDialogOpen(false)
  }, [])

  const returnToDetailedDossier = useCallback(() => {
    changeRequisites(false)
  }, [changeRequisites])

  const sendToDecision = useCallback(() => {
    setIsSendToDecisionDialogOpen(false)
  }, [values])

  const onSubmit = useCallback((values: DossierRequisites) => {
    setValues(values)
    setIsSendToDecisionDialogOpen(true)
  }, [])

  return (
    <Box className={classes.editRequisitesBlockContainer}>
      <SberTypography sberautoVariant="h2" component="p">
        Редактирование реквизитов
      </SberTypography>
      <Formik
        initialValues={initialValues}
        validationSchema={editRequisitesValidationSchema}
        onSubmit={onSubmit}
      >
        <Form className={classes.editingAreaContainer}>
          <SberTypography gridColumn="span 15" sberautoVariant="h5" component="p">
            Реквизиты дилерского центра
          </SberTypography>
          {/* <DealerCenterRequisites
            requisites={requisites.dealerCenterRequisites}
            isRequisiteEditable={false}
          /> */}
          <Divider className={classes.divider} />

          {!!initialValues.dealerAdditionalServices.length && (
            <>
              <SberTypography gridColumn="span 15" sberautoVariant="h5" component="p">
                Дополнительные услуги дилера
              </SberTypography>
              {initialValues.dealerAdditionalServices.map((dealerService, index, array) => (
                <React.Fragment key={dealerService.productType + index}>
                  {/* <DealerServicesRequisites
                    requisites={requisites.dealerServicesRequisites}
                    index={index}
                    parentName={ServicesGroupName.dealerAdditionalServices}
                    isRequisiteEditable={false}
                  /> */}
                  {index < array.length - 1 && <Divider />}
                </React.Fragment>
              ))}
              <Divider className={classes.divider} />
            </>
          )}

          {!!initialValues.additionalEquipments.length && (
            <>
              <SberTypography gridColumn="span 15" sberautoVariant="h5" component="p">
                Дополнительное оборудование
              </SberTypography>
              {initialValues.additionalEquipments.map((additionalEquipment, index, array) => (
                <React.Fragment key={additionalEquipment.productType + index}>
                  {/* <AdditionalEquipmentRequisites
                    requisites={requisites.additionalEquipmentRequisites}
                    index={index}
                    parentName={ServicesGroupName.additionalEquipments}
                    isRequisiteEditable={false}
                  /> */}
                  {index < array.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </>
          )}

          <Box className={classes.buttonsContainer}>
            <SberTypography
              sberautoVariant="body3"
              component="p"
              className={classes.textButton}
              onClick={showReturnDialog}
            >
              Назад к заявке
            </SberTypography>
            <Button type="submit" variant="contained">
              Отправить на решение
            </Button>
          </Box>

          <ModalDialog isVisible={isReturnDialogOpen} label="" onClose={closeReturnDialog}>
            <Box width="100px">
              <SberTypography sberautoVariant="body3" component="span" width="100px">
                Возвращаясь назад, вы не сохраните те
                <br />
                изменения, что внесли
              </SberTypography>
            </Box>
            <Box className={classes.buttonsContainer}>
              <Button
                className={classes.dialogButton}
                variant="contained"
                autoFocus
                onClick={returnToDetailedDossier}
              >
                Продолжить
              </Button>
              <Button className={classes.dialogButton} variant="outlined" onClick={closeReturnDialog}>
                Назад
              </Button>
            </Box>
          </ModalDialog>
          <ModalDialog isVisible={isSendToDecisionDialogOpen} label="" onClose={closeSendToDecisionDialog}>
            <Box width="100px">
              <SberTypography sberautoVariant="body3" component="span" width="100px">
                После отправки на решение заявка будет обновлена и будет находится в стадии “Ожидает решения”
              </SberTypography>
            </Box>
            <Box className={classes.buttonsContainer}>
              <Button className={classes.dialogButton} variant="contained" autoFocus onClick={sendToDecision}>
                Продолжить
              </Button>
              <Button className={classes.dialogButton} variant="outlined" onClick={closeSendToDecisionDialog}>
                Назад
              </Button>
            </Box>
          </ModalDialog>
        </Form>
      </Formik>
    </Box>
  )
}
