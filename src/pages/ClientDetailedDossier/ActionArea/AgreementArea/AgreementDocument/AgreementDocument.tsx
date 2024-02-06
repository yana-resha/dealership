import { ChangeEvent, Dispatch, SetStateAction, useCallback } from 'react'

import { Box, Divider } from '@mui/material'
import { DocumentType } from '@sberauto/loanapplifecycledc-proto/public'

import { useDownloadDocument } from 'features/ApplicationFileLoader/hooks/useDownloadDocument'
import { FileDownloader } from 'shared/ui/FileDownloader/FileDownloader'
import { RadioGroupInput } from 'shared/ui/RadioGroupInput/RadioGroupInput'
import SberTypography from 'shared/ui/SberTypography'
import { SwitchInput } from 'shared/ui/SwitchInput/SwitchInput'

import { DocsStatus } from '../AgreementArea.config'
import { useStyles } from './AgreementDocument.styles'

type Props = {
  document: {
    dcAppId: string
    documentType: DocumentType
    name: string
  }
  index: number
  isRightsAssigned: boolean | undefined
  docsStatus: string[]
  setDocsStatus: Dispatch<SetStateAction<string[]>>
  setRightsAssigned: Dispatch<SetStateAction<boolean | undefined>>
  changeApplicationStatusToSigned: () => void
}

export function AgreementDocument({
  document,
  index,
  isRightsAssigned,
  docsStatus,
  setDocsStatus,
  setRightsAssigned,
  changeApplicationStatusToSigned,
}: Props) {
  const classes = useStyles()

  const { downloadFile } = useDownloadDocument()

  const setDocumentToDownloaded = useCallback(() => {
    const newDocsStatus = [...docsStatus]
    newDocsStatus[index] = DocsStatus.Downloaded
    setDocsStatus(newDocsStatus)
  }, [docsStatus, index, setDocsStatus])

  const updateDocumentStatus = useCallback(
    (evt: ChangeEvent<HTMLInputElement>) => {
      const newDocsStatus = [...docsStatus]
      newDocsStatus[index] = evt.target.checked ? DocsStatus.Signed : DocsStatus.Downloaded
      setDocsStatus(newDocsStatus)
      const signCounter = newDocsStatus.reduce((acc, cur) => (cur === DocsStatus.Signed ? ++acc : acc), 0)
      if (signCounter === newDocsStatus.length) {
        changeApplicationStatusToSigned()
      }
    },
    [docsStatus, index, setDocsStatus, changeApplicationStatusToSigned],
  )

  const changeRightsAssigned = useCallback(
    (value: boolean) => {
      setRightsAssigned(value)
    },
    [setRightsAssigned],
  )

  const isDisabled = isRightsAssigned === undefined

  return (
    <Box key={document?.name} className={classes.documentContainer} data-testid="agreementDocument">
      <Box className={classes.document}>
        <FileDownloader
          dcAppId={document.dcAppId}
          documentType={document.documentType}
          fileOrMetadata={document}
          index={index}
          loadingMessage="Файл загружается"
          onClick={setDocumentToDownloaded}
          onDownloadFile={downloadFile}
        />

        {docsStatus[index] !== DocsStatus.Received && (
          <SwitchInput
            label="Подписан"
            id={'document_' + index}
            value={docsStatus[index] === 'signed'}
            afterChange={updateDocumentStatus}
            disabled={document.documentType === DocumentType.CREDIT_CONTRACT && isDisabled}
          />
        )}
      </Box>
      {document.documentType === DocumentType.CREDIT_CONTRACT &&
        docsStatus[index] !== DocsStatus.Received && (
          <Box className={classes.radioGroup}>
            <SberTypography sberautoVariant="body2" component="p">
              Согласие на уступку прав
            </SberTypography>
            <RadioGroupInput
              radioValues={[
                { radioValue: true, radioLabel: 'Согласен' },
                { radioValue: false, radioLabel: 'Не согласен' },
              ]}
              defaultValue={null}
              onChange={changeRightsAssigned}
            />
          </Box>
        )}
      {docsStatus[index] !== DocsStatus.Received && <Divider />}
    </Box>
  )
}
