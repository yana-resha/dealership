import { Box } from '@mui/material'
import { StatusCode } from '@sberauto/loanapplifecycledc-proto/public'
import cx from 'classnames'

import { useStyles } from '../InformationArea.styles'

type Props = {
  statusCode: StatusCode
}
export function ApplicationWarning({ statusCode }: Props) {
  const classes = useStyles()

  return (
    <>
      {statusCode === StatusCode.NEED_REFORMATION && (
        <Box className={cx(classes.textButtonContainer, classes.warningTextContainer)} gridColumn="1/-1">
          Данные индивидуальных условий кредитования могли устареть. Требуется переформировать печатные формы.
        </Box>
      )}

      {statusCode === StatusCode.CLIENT_REJECTED && (
        <Box className={cx(classes.textButtonContainer, classes.warningTextContainer)} gridColumn="1/-1">
          Клиенту необходимо обратиться в отделение банка для актуализации данных.
        </Box>
      )}
    </>
  )
}