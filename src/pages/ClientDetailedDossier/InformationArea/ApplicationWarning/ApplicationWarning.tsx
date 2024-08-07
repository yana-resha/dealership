import { Box } from '@mui/material'
import { StatusCode } from '@sberauto/loanapplifecycledc-proto/public'
import cx from 'classnames'

import { useStyles } from '../InformationArea.styles'

type Props = {
  statusCode: StatusCode
  errorDescription: string | undefined
  isGovProgramDocumentsNecessaryRequest: boolean
  isGovProgramDocumentsPending: boolean
}
export function ApplicationWarning({
  statusCode,
  errorDescription,
  isGovProgramDocumentsNecessaryRequest,
  isGovProgramDocumentsPending,
}: Props) {
  const classes = useStyles()

  return (
    <>
      {statusCode === StatusCode.NEED_REFORMATION && (
        <Box className={cx(classes.textButtonContainer, classes.errorTextContainer)} gridColumn="1/-1">
          Данные индивидуальных условий кредитования могли устареть. Требуется переформировать печатные формы.
        </Box>
      )}

      {isGovProgramDocumentsNecessaryRequest && (
        <Box className={cx(classes.textButtonContainer, classes.errorTextContainer)} gridColumn="1/-1">
          Необходима повторная отправка документов для Госпрограммы.
        </Box>
      )}

      {isGovProgramDocumentsPending && (
        <Box className={cx(classes.textButtonContainer, classes.warningTextContainer)} gridColumn="1/-1">
          Документы для Госпрограммы проверяются.
        </Box>
      )}

      {/* Вся логика заполнения этого поля на Бэке. Фронт просто ориентируется на его наличие */}
      {!!errorDescription && (
        <Box className={cx(classes.textButtonContainer, classes.errorTextContainer)} gridColumn="1/-1">
          {errorDescription}
        </Box>
      )}
    </>
  )
}
