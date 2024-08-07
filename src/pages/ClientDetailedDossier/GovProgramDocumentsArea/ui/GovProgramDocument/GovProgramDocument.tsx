import { Box } from '@mui/material'
import { Scan } from '@sberauto/loanapplifecycledc-proto/public'
import cx from 'classnames'

import { ReactComponent as AlarmIcon } from 'assets/icons/alarm.svg'
import { ReactComponent as SuccessIcon } from 'assets/icons/success.svg'
import { Uploader, UploaderConfig } from 'features/ApplicationFileLoader'
import { CustomTooltip } from 'shared/ui/CustomTooltip'

import { getGovProgramDocumentStatus } from '../../GovProgramDocumentsArea.utils'
import { useStyles } from './GovProgramDocument.styles'

type Props = {
  config: UploaderConfig
  onRemoveDocument: (documentName: string) => void
  scan: Scan | undefined
  isAllSendToEcm: boolean
  isAllReceivedFromEcm: boolean
  isAllReceivedFromRmoc: boolean
  isSomeAgreeFromRmocNull: boolean
  isRemoveDisabled: boolean
}

export function GovProgramDocument({
  config,
  onRemoveDocument,
  scan,
  isAllSendToEcm,
  isAllReceivedFromEcm,
  isAllReceivedFromRmoc,
  isSomeAgreeFromRmocNull,
  isRemoveDisabled = false,
}: Props) {
  const classes = useStyles()
  const { isDocumentBlocked, isDocumentError, isDocumentSuccess, errorDescription } =
    getGovProgramDocumentStatus(
      scan,
      isAllSendToEcm,
      isAllReceivedFromEcm,
      isAllReceivedFromRmoc,
      isSomeAgreeFromRmocNull,
    )

  return (
    <Box className={classes.container}>
      <Uploader
        uploaderConfig={config}
        onRemoveDocument={onRemoveDocument}
        isShowLabel
        isRemoveDisabled={isRemoveDisabled || isDocumentBlocked}
      />
      {isDocumentError && (
        <CustomTooltip title={errorDescription} placement="right" arrow>
          <AlarmIcon className={cx(classes.icon, { [classes.errorIcon]: errorDescription })} />
        </CustomTooltip>
      )}

      {isDocumentSuccess && <SuccessIcon className={classes.icon} />}
    </Box>
  )
}
