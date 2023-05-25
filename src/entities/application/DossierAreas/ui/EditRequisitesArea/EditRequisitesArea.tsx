import React, { useCallback, useMemo, useState } from 'react'

import { Box, Button, Divider } from '@mui/material'
import { Form, Formik } from 'formik'

import { ModalDialog } from 'shared/ui/ModalDialog/ModalDialog'
import SberTypography from 'shared/ui/SberTypography/SberTypography'

import { AdditionalEquipmentRequisites, DealerCenterRequisites, DealerServicesRequisites } from '../'
import { AdditionalOptionsTypes } from '../../../application.utils'
import {
  AdditionalOptions,
  ClientDossier,
  mockRequisites,
} from '../../__tests__/mocks/clientDetailedDossier.mock'
import { editRequisitesValidationSchema } from '../../configs/editRequisitesValidation'
import { useStyles } from './EditRequisitesArea.styles'

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
  clientDossier: ClientDossier
  changeRequisites: (value: boolean) => void
}

export function EditRequisitesArea({ clientDossier, changeRequisites }: Props) {
  const classes = useStyles()
  const requisites = mockRequisites()
  const { additionalOptions, creditLegalEntity, creditSum, creditReceiverBank, creditBankAccountNumber } =
    clientDossier
  const [isReturnDialogOpen, setIsReturnDialogOpen] = useState(false)
  const [isSendToDecisionDialogOpen, setIsSendToDecisionDialogOpen] = useState(false)
  const [dealerServices, additionalEquipment] = useMemo(
    () => [
      additionalOptions.filter(option => option.optionType === AdditionalOptionsTypes.dealerServices),
      additionalOptions.filter(option => option.optionType === AdditionalOptionsTypes.additionalEquipment),
    ],
    [additionalOptions],
  )
  const [values, setValues] = useState<DossierRequisites>()

  const initialValues: DossierRequisites = {
    legalPerson: creditLegalEntity,
    loanAmount: creditSum.toString(),
    isCustomFields: false,
    bankIdentificationCode: '',
    beneficiaryBank: creditReceiverBank,
    bankAccountNumber: creditBankAccountNumber,
    correspondentAccount: '',
    taxPresence: false,
    dealerAdditionalServices: dealerServices,
    additionalEquipments: additionalEquipment,
    taxation: '0',
  }

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
    console.log(values)
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
          <DealerCenterRequisites
            requisites={requisites.dealerCenterRequisites}
            isRequisiteEditable={false}
          />
          <Divider className={classes.divider} />

          {!!dealerServices.length && (
            <>
              <SberTypography gridColumn="span 15" sberautoVariant="h5" component="p">
                Дополнительные услуги дилера
              </SberTypography>
              {dealerServices.map((dealerService, index, array) => (
                <React.Fragment key={dealerService.productType + index}>
                  <DealerServicesRequisites
                    requisites={requisites.dealerServicesRequisites}
                    index={index}
                    parentName="dealerAdditionalServices"
                    isRequisiteEditable={false}
                  />
                  {index < array.length - 1 && <Divider />}
                </React.Fragment>
              ))}
              <Divider className={classes.divider} />
            </>
          )}

          {!!additionalEquipment.length && (
            <>
              <SberTypography gridColumn="span 15" sberautoVariant="h5" component="p">
                Дополнительное оборудование
              </SberTypography>
              {additionalEquipment.map((additionalEquipment, index, array) => (
                <React.Fragment key={additionalEquipment.productType + index}>
                  <AdditionalEquipmentRequisites
                    requisites={requisites.additionalEquipmentRequisites}
                    index={index}
                    parentName="additionalEquipments"
                    isRequisiteEditable={false}
                  />
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
