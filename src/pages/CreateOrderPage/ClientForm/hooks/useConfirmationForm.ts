import { useCallback, useRef, useState } from 'react'

import { FormikProps } from 'formik'

import { getPointOfSaleFromCookies } from 'entities/pointOfSale'
import { DocumentUploadStatus } from 'features/ApplicationFileLoader'
import { useAppSelector } from 'shared/hooks/store/useAppSelector'

import { ClientData } from '../ClientForm.types'
import { QUESTIONNAIRE_FIELD_NAME } from '../FormAreas/QuestionnaireUploadArea/QuestionnaireUploadArea'

export function useConfirmationForm(formRef: React.RefObject<FormikProps<ClientData>>) {
  const { vendorCode } = getPointOfSaleFromCookies()
  const applicationVendorCode = useAppSelector(
    state => state.order.order?.orderData?.application?.vendor?.vendorCode,
  )
  const isSameVendor = vendorCode === applicationVendorCode

  const handleQuestionnaireUploadRef = useRef<() => void>()
  const confirmedActionRef = useRef<() => void>()
  const [actionText, setActionText] = useState('')
  const [isConfirmationModalVisible, setConfirmationModalVisible] = useState(false)
  const [isAllowedUploadQuestionnaire, setAllowedUploadQuestionnaire] = useState(isSameVendor)
  const [isReuploadedQuestionnaire, setReuploadedQuestionnaire] = useState(false)

  const checkQuestionnaireUploading = useCallback(
    (actionForConfirmation: () => void) => {
      const isError =
        formRef.current?.values[QUESTIONNAIRE_FIELD_NAME]?.status === DocumentUploadStatus.Error ||
        !!formRef.current?.errors[QUESTIONNAIRE_FIELD_NAME]

      if (isError) {
        return
      }

      if (!isAllowedUploadQuestionnaire && isReuploadedQuestionnaire) {
        handleQuestionnaireUploadRef.current = actionForConfirmation
        confirmedActionRef.current = () => setAllowedUploadQuestionnaire(true)
      } else {
        confirmedActionRef.current = actionForConfirmation
      }
    },
    [formRef, isAllowedUploadQuestionnaire, isReuploadedQuestionnaire],
  )

  const confirmActionWrapper = useCallback(
    (actionForConfirmation: () => void, actionText: string) => {
      if (!isSameVendor) {
        checkQuestionnaireUploading(actionForConfirmation)
        setActionText(actionText)
        setConfirmationModalVisible(true)
      } else {
        actionForConfirmation()
      }
    },
    [checkQuestionnaireUploading, isSameVendor],
  )

  const closeConfirmationModal = useCallback(() => {
    setConfirmationModalVisible(false)
  }, [])

  return {
    isSameVendor,
    actionText,
    handleQuestionnaireUploadRef,
    confirmedActionRef,
    isConfirmationModalVisible,
    isAllowedUploadQuestionnaire,
    isReuploadedQuestionnaire,
    setReuploadedQuestionnaire,
    confirmActionWrapper,
    closeConfirmationModal,
  }
}
