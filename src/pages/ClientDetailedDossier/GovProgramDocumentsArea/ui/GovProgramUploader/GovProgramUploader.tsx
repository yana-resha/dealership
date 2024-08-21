import { DocumentType, Scan } from '@sberauto/loanapplifecycledc-proto/public'

import { FileInfo, Uploader, UploaderConfig } from 'features/ApplicationFileLoader'
import { DEFAULT_MAX_FILE_SIZE_MB } from 'shared/config/fileLoading.config'

import { getGovProgramDocumentStatus } from '../../GovProgramDocumentsArea.utils'

type Props = {
  config: UploaderConfig
  scan: Scan | undefined
  onUploadDocument: (file: File, documentName: string, status: FileInfo['status']) => void
  onRemoveDocument: (documentName: string) => void
  onChangeOption: (documentName: string, documentType: string | DocumentType) => void
  isAllSendToEcm: boolean
  isAllReceivedFromEcm: boolean
  isAllReceivedFromRmoc: boolean
  isSomeAgreeFromRmocNull: boolean
  isRemoveDisabled: boolean
}

export function GovProgramUploader({
  config,
  scan,
  onUploadDocument,
  onRemoveDocument,
  onChangeOption,
  isAllSendToEcm,
  isAllReceivedFromEcm,
  isAllReceivedFromRmoc,
  isSomeAgreeFromRmocNull,
  isRemoveDisabled,
}: Props) {
  const { isDocumentBlocked } = getGovProgramDocumentStatus(
    scan,
    isAllSendToEcm,
    isAllReceivedFromEcm,
    isAllReceivedFromRmoc,
    isSomeAgreeFromRmocNull,
  )

  return (
    <Uploader
      uploaderConfig={config}
      suggest={`Одним документом не более ${DEFAULT_MAX_FILE_SIZE_MB} мб.`}
      loadingMessage="Документ загружается"
      motivateMessage="Загрузить документ"
      isShowLabel
      onUploadDocument={onUploadDocument}
      onRemoveDocument={onRemoveDocument}
      onChangeOption={onChangeOption}
      isRemoveDisabled={isRemoveDisabled || isDocumentBlocked}
    />
  )
}
