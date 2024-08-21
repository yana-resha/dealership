import React, { useCallback } from 'react'

import { Button } from '@mui/material'
import { DocumentType } from '@sberauto/loanapplifecycledc-proto/public'

import { theme } from 'app/theme'
import { useFormGovProgramStatementMutation } from 'shared/api/requests/loanAppLifeCycleDc'
import { CircularProgressWheel } from 'shared/ui/CircularProgressWheel'
import { Downloader } from 'shared/ui/Downloader'
import { transformFileName } from 'shared/utils/fileLoading'

import { useStyles } from './GovProgramStatement.styles'

type Props = {
  dcAppId: string
  onDownloadStatement: () => void
}

export function GovProgramStatement({ dcAppId, onDownloadStatement }: Props) {
  const classes = useStyles()

  const { mutateAsync: formGovProgramStatementMutate, isLoading: isFormGovProgramStatementLoading } =
    useFormGovProgramStatementMutation({
      dcAppId,
    })

  const handleGovProgramStatementBtnClick = useCallback(async () => {
    const blob = await formGovProgramStatementMutate()
    if (blob) {
      onDownloadStatement()

      return new File(
        [blob],
        transformFileName(DocumentType.COMMITMENT_STATEMENT, dcAppId) || 'Заявление-обязательство',
        {
          type: blob.type,
        },
      )
    }
  }, [dcAppId, formGovProgramStatementMutate, onDownloadStatement])

  return (
    <Downloader onDownloadFile={handleGovProgramStatementBtnClick} isDisabledLoader>
      <Button classes={{ root: classes.button }} variant="contained">
        {isFormGovProgramStatementLoading ? (
          <CircularProgressWheel size="small" color={theme.palette.background.default} />
        ) : (
          <>Сформировать заявление</>
        )}
      </Button>
    </Downloader>
  )
}
