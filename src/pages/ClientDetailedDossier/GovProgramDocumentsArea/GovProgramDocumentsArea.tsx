import { useCallback, useEffect, useState } from 'react'

import { Box, Button } from '@mui/material'

import { ReactComponent as AttachIcon } from 'assets/icons/attach.svg'
import { AreaContainer } from 'shared/ui/AreaContainer'
import { ModalDialog } from 'shared/ui/ModalDialog'
import SberTypography from 'shared/ui/SberTypography/SberTypography'

import { useStyles } from './GosProgramDocumentsArea.styles'
import { useGovProgramDocuments } from './hooks/useGovProgramDocuments'
import { useGovProgramScans } from './hooks/useGovProgramScans'
import { GovProgramDocument } from './ui/GovProgramDocument/GovProgramDocument'
import { GovProgramStatement } from './ui/GovProgramStatement/GovProgramStatement'
import { GovProgramUploader } from './ui/GovProgramUploader/GovProgramUploader'

type Props = {
  dcAppId: string
  isBlocked: boolean
}

export function GovProgramDocumentsArea({ dcAppId, isBlocked }: Props) {
  const classes = useStyles()
  const [isVisible, setVisible] = useState(false)
  const [isStatementDownloaded, setStatementDownloaded] = useState(false)
  const changeStatementDownloaded = useCallback(() => {
    setStatementDownloaded(false)
  }, [])

  const {
    necessaryGovProgramDocuments,
    govProgramScans,
    currentGovProgramScans,
    isAllSendToEcm,
    isAllReceivedFromEcm,
    isAllReceivedFromRmoc,
    isSomeAgreeFromRmocNull,
    isDocumentsChangeBlocked,
  } = useGovProgramScans()

  const {
    uploaderConfigs,
    downloaderConfigs,
    handleUploadDocument,
    handleChangeOption,
    handleRemoveDocument,
  } = useGovProgramDocuments({
    dcAppId,
    necessaryGovProgramDocuments,
    govProgramScans,
    currentGovProgramScans,
    onRemoveStatement: changeStatementDownloaded,
  })

  const isHasCommitmentStatement = !!currentGovProgramScans[0] || isStatementDownloaded

  const handleStatementDownload = useCallback(() => {
    setStatementDownloaded(true)
  }, [])

  const openUploadDialog = useCallback(() => {
    setVisible(true)
  }, [setVisible])

  const closeUploadDialog = useCallback(() => {
    setVisible(false)
  }, [setVisible])

  useEffect(() => {
    if (isDocumentsChangeBlocked && isVisible) {
      setVisible(false)
    }
  }, [isDocumentsChangeBlocked, isVisible])

  return (
    <>
      <AreaContainer>
        <Box className={classes.container}>
          <Box className={classes.blockContainer}>
            <SberTypography sberautoVariant="h5" component="p">
              Документы для госпрограммы
            </SberTypography>
          </Box>

          {!isHasCommitmentStatement && !isBlocked && (
            <GovProgramStatement dcAppId={dcAppId} onDownloadStatement={handleStatementDownload} />
          )}

          <Box>
            {downloaderConfigs.map((config, i) => (
              <GovProgramDocument
                key={config.documentLabel}
                config={config}
                onRemoveDocument={handleRemoveDocument}
                scan={currentGovProgramScans[i]}
                isAllSendToEcm={isAllSendToEcm}
                isAllReceivedFromEcm={isAllReceivedFromEcm}
                isAllReceivedFromRmoc={isAllReceivedFromRmoc}
                isSomeAgreeFromRmocNull={isSomeAgreeFromRmocNull}
                isRemoveDisabled={isDocumentsChangeBlocked || isBlocked}
              />
            ))}
          </Box>

          {!isDocumentsChangeBlocked && !isBlocked && (
            <Button
              classes={{ root: classes.textButton, startIcon: classes.startIcon }}
              startIcon={<AttachIcon />}
              component="label"
              onClick={openUploadDialog}
            >
              Загрузить документы
            </Button>
          )}
        </Box>
      </AreaContainer>

      <ModalDialog isVisible={isVisible} label="Документы для госпрограммы" onClose={closeUploadDialog}>
        <Box className={classes.content}>
          <Box className={classes.uploadArea}>
            {uploaderConfigs.map((config, i) => (
              <GovProgramUploader
                key={config.documentLabel}
                config={config}
                scan={currentGovProgramScans[i]}
                onUploadDocument={handleUploadDocument}
                onRemoveDocument={handleRemoveDocument}
                onChangeOption={handleChangeOption}
                isAllSendToEcm={isAllSendToEcm}
                isAllReceivedFromEcm={isAllReceivedFromEcm}
                isAllReceivedFromRmoc={isAllReceivedFromRmoc}
                isSomeAgreeFromRmocNull={isSomeAgreeFromRmocNull}
                isRemoveDisabled={isDocumentsChangeBlocked}
              />
            ))}
          </Box>
        </Box>
      </ModalDialog>
    </>
  )
}
