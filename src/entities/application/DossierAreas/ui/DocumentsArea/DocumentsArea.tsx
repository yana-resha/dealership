import { useCallback, useEffect, useMemo, useState } from 'react'

import { Box } from '@mui/material'
import { DocumentType, StatusCode } from '@sberauto/loanapplifecycledc-proto/public'
import { useParams } from 'react-router-dom'

import { updateApplication } from 'entities/reduxStore/orderSlice'
import { FileInfo, UploaderConfig, DocumentUploadStatus } from 'features/ApplicationFileUploader'
// TODO DCB-754 : Разрешить эту зависимость, нельзя что бы feature импортировались в нижележащий слой entities
import { Uploader } from 'features/ApplicationFileUploader/ApplicationFileUploader'
import { UPLOADED_DOCUMENTS } from 'pages/CreateOrderPage/ClientForm/config/clientFormInitialValues'
import { useAppDispatch } from 'shared/hooks/store/useAppDispatch'
import { useAppSelector } from 'shared/hooks/store/useAppSelector'
import { FileDownloader } from 'shared/ui/FileDownloader/FileDownloader'
import SberTypography from 'shared/ui/SberTypography'

import { PreparedStatus, getStatus } from '../../../application.utils'
import { getMockAgreement } from '../../__tests__/mocks/clientDetailedDossier.mock'
import { useStyles } from './DocumentsArea.styles'

type Props = {
  agreementDocs: (File | undefined)[]
  setAgreementDocs: (files: (File | undefined)[]) => void
  status: StatusCode
}

export function DocumentsArea({ agreementDocs, setAgreementDocs, status }: Props) {
  const classes = useStyles()
  const { applicationId = '' } = useParams()
  const dispatch = useAppDispatch()

  const scans = useAppSelector(state => state.order.order?.orderData?.application?.scans || [])
  const questionnaireScan = useMemo(
    () => scans.find(scan => scan.type === DocumentType.CONSENT_FORM),
    [scans],
  )

  const [fileQuestionnaire, setFileQuestionnaire] = useState<FileInfo | undefined>()
  const [isDocsLoading, setIsDocsLoading] = useState(false)

  const preparedStatus = getStatus(status)
  const showDownloadLoanAgreement = [
    PreparedStatus.authorized,
    PreparedStatus.financed,
    PreparedStatus.signed,
  ].includes(preparedStatus)

  const uploadQuestionnaire = useCallback(
    (file: FileInfo['file'], documentName: string, status: FileInfo['status']) => {
      setFileQuestionnaire({ file, status })
      const filteredScans = scans.filter(scan => scan.type !== DocumentType.CONSENT_FORM)
      if (status === DocumentUploadStatus.Upload) {
        dispatch(
          updateApplication({
            scans: [
              ...filteredScans,
              {
                type: DocumentType.CONSENT_FORM,
                name: file.name,
              },
            ],
          }),
        )
      }
    },
    [dispatch, scans],
  )

  const deleteQuestionnaire = useCallback(() => {
    setFileQuestionnaire(undefined)
    dispatch(updateApplication({ scans: scans.filter(scan => scan.type !== DocumentType.CONSENT_FORM) }))
  }, [dispatch, scans])

  useEffect(() => {
    if (questionnaireScan) {
      setFileQuestionnaire({
        file: {
          dcAppId: applicationId,
          documentType: DocumentType.CONSENT_FORM,
          name: questionnaireScan.name,
        },
        status: DocumentUploadStatus.Upload,
      })
    }
  }, [applicationId, questionnaireScan])

  useEffect(() => {
    const fetchAgreement = async () => {
      const documents = await getMockAgreement()
      setAgreementDocs(documents)
      setIsDocsLoading(false)
    }

    if (showDownloadLoanAgreement && !agreementDocs.length) {
      setIsDocsLoading(true)
      fetchAgreement()
    }
    // Должен срабатывать только на изменение showDownloadLoanAgreement
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showDownloadLoanAgreement])

  const uploaderConfig: UploaderConfig = {
    ...UPLOADED_DOCUMENTS.questionnaireFile,
    documentFile: fileQuestionnaire ? fileQuestionnaire : null,
    documentError:
      fileQuestionnaire?.status === DocumentUploadStatus.Error ? 'Ошибка при загрузке анкеты' : undefined,
  }

  return (
    <Box className={classes.blockContainer}>
      <SberTypography sberautoVariant="h5" component="p">
        Документы
      </SberTypography>

      <Uploader
        uploaderConfig={uploaderConfig}
        loadingMessage="Анкета загружается"
        motivateMessage="Загрузить анкету"
        onUploadDocument={uploadQuestionnaire}
        onDeleteDocument={deleteQuestionnaire}
      />

      {showDownloadLoanAgreement && (
        <Box gridColumn="1 / -1">
          {isDocsLoading ? (
            <FileDownloader
              file={undefined}
              index={0}
              loadingMessage="Идет формирование договора. Это может занять 2-5 мин."
            />
          ) : (
            <Box className={classes.documentsBlock}>
              {agreementDocs.map((document, index) => (
                <FileDownloader key={index} file={document} index={index} loadingMessage="Файл загружается" />
              ))}
            </Box>
          )}
        </Box>
      )}
    </Box>
  )
}
