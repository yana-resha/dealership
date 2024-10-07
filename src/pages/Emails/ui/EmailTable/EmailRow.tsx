import { useCallback } from 'react'

import { Box, TableCell, TableRow } from '@mui/material'
import { EmailStatusCode } from '@sberauto/emailappdc-proto/public'
import cx from 'classnames'

import { ReactComponent as UnreadIcon } from 'assets/icons/unread.svg'
import { RequiredEmail } from 'entities/email'
import { convertedDateToString } from 'shared/utils/dateTransform'

import { EmailStatusBar } from './EmailStatus'
import { useStyles } from './EmailTable.styles'

type Props = {
  row: RequiredEmail
  onRowClick: (emailId: number) => void
}

export function EmailRow({ row, onRowClick }: Props) {
  const classes = useStyles()
  const handleRowClick = useCallback(() => onRowClick(row.emailId), [onRowClick, row.emailId])

  return (
    <TableRow
      className={cx(classes.bodyRow, { [classes.unreadEmail]: row.status === EmailStatusCode.INITIAL })}
      onClick={handleRowClick}
      data-testid="dealershipclient.Emails.EmailTable.EmailRow"
    >
      <TableCell className={cx(classes.bodyCell, classes.unreadIcon)}>
        {row.status === EmailStatusCode.INITIAL && (
          <Box marginBottom="5px">
            <UnreadIcon />
          </Box>
        )}
      </TableCell>
      <TableCell className={classes.bodyCell}>{row.from}</TableCell>
      <TableCell className={classes.bodyCell}>{row.topic}</TableCell>
      <TableCell className={classes.bodyCell}>
        {row.receivedAt ? convertedDateToString(new Date(row.receivedAt), 'dd.LL.yyyy HH:mm') : '-'}
      </TableCell>
      <TableCell className={classes.bodyCell}>
        <EmailStatusBar status={row.status} />
      </TableCell>
      <TableCell className={classes.bodyCell}>{row.dcAppId}</TableCell>
    </TableRow>
  )
}
