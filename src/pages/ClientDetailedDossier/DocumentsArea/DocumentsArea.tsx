import { useCallback, useEffect, useMemo, useState } from 'react'

import { Box } from '@mui/material'
import { DocumentType, StatusCode } from '@sberauto/loanapplifecycledc-proto/public'
import { useParams } from 'react-router-dom'

import { PreparedStatus, getStatus } from 'entities/application/application.utils'
import { DocumentDownloader } from 'entities/downloader/DocumentsDownloader/DocumentDownloader'
import { updateApplication } from 'entities/reduxStore/orderSlice'
import { FileInfo, UploaderConfig, DocumentUploadStatus } from 'features/ApplicationFileLoader'
import { Uploader } from 'features/ApplicationFileLoader/ApplicationFileUploader'
import { useDownloadDocument } from 'features/ApplicationFileLoader/hooks/useDownloadDocument'
import { UPLOADED_DOCUMENTS } from 'pages/CreateOrder/ClientForm/config/clientFormInitialValues'
import { useAppDispatch } from 'shared/hooks/store/useAppDispatch'
import { useAppSelector } from 'shared/hooks/store/useAppSelector'
import { AreaContainer } from 'shared/ui/DossierAreaContainer'
import SberTypography from 'shared/ui/SberTypography'

import { useAgreementDocs } from '../hooks/useAgreementDocs'
import { useStyles } from './DocumentsArea.styles'

type Props = {
  status: StatusCode
}

export function DocumentsArea({ status }: Props) {
  const classes = useStyles()
  const { applicationId = '' } = useParams()
  const dispatch = useAppDispatch()

  const scans = useAppSelector(state => state.order.order?.orderData?.application?.scans || [])

  const { downloadFile } = useDownloadDocument()
  const { agreementDocs } = useAgreementDocs(true)

  const questionnaireScan = useMemo(
    () => scans.find(scan => scan.type === DocumentType.CONSENT_FORM),
    [scans],
  )

  const [fileQuestionnaire, setFileQuestionnaire] = useState<FileInfo | undefined>()

  const preparedStatus = getStatus(status)
  const isShowDownloadLoanAgreement = [
    PreparedStatus.signed,
    PreparedStatus.authorized,
    PreparedStatus.financed,
  ].includes(preparedStatus)
  const isDisabledRemove = [
    PreparedStatus.formation,
    PreparedStatus.signed,
    PreparedStatus.authorized,
    PreparedStatus.financed,
    PreparedStatus.issueError,
  ].includes(preparedStatus)

  const uploadQuestionnaire = useCallback(
    (file: FileInfo['file'], documentName: string, status: FileInfo['status']) => {
      setFileQuestionnaire({ file, status })
      const filteredScans = scans.filter(scan => scan.type !== DocumentType.CONSENT_FORM)
      if (status === DocumentUploadStatus.Uploaded) {
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

  const removeQuestionnaire = useCallback(() => {
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
        status: DocumentUploadStatus.Uploaded,
      })
    }
  }, [applicationId, questionnaireScan])

  const uploaderConfig: UploaderConfig = {
    ...UPLOADED_DOCUMENTS.questionnaireFile,
    documentFile: fileQuestionnaire ? fileQuestionnaire : null,
    documentError:
      fileQuestionnaire?.status === DocumentUploadStatus.Error ? 'Ошибка при загрузке анкеты' : undefined,
  }

  return (
    <AreaContainer>
      <Box className={classes.blockContainer}>
        <SberTypography sberautoVariant="h5" component="p">
          Документы
        </SberTypography>

        <Uploader
          uploaderConfig={uploaderConfig}
          loadingMessage="Анкета загружается"
          motivateMessage="Загрузить анкету"
          onUploadDocument={uploadQuestionnaire}
          onRemoveDocument={removeQuestionnaire}
          isDisabledRemove={isDisabledRemove}
          isShowLabel={!isShowDownloadLoanAgreement}
        />

        {isShowDownloadLoanAgreement && (
          <Box gridColumn="1 / -1" className={classes.documentsBlock}>
            {agreementDocs.map((document, index) => (
              <DocumentDownloader
                key={index}
                fileOrMetadata={document}
                index={index}
                dcAppId={document.dcAppId}
                documentType={document.documentType}
                loadingMessage="Файл загружается"
                onDownloadDocuments={downloadFile}
              />
            ))}
          </Box>
        )}
      </Box>
    </AreaContainer>
  )
}
