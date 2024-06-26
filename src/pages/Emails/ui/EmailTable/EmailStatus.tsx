import { Box } from '@mui/system'
import { EmailStatusCode } from '@sberauto/emailappdc-proto/public'

import { EmailStatus, getEmailStatus } from 'entities/email'
import { Status } from 'shared/ui/Status/Status'

const EMAIL_STATUS_BAR_TEST_ID = 'dealershipclient.Emails.EmailTable.EmailStatus'

const STATUS_LIST_ITEMS: Record<string, string> = {
  [EmailStatus.PROCESSED]: '#0B6B9D',
  [EmailStatus.ANSWERED]: '#17A131',
}

type Props = {
  status: EmailStatusCode | null | undefined
}

export const EmailStatusBar = ({ status }: Props) => {
  const emailStatus = getEmailStatus(status)

  if (emailStatus === EmailStatus.INITIAL) {
    return <Box width="150px" data-testid={EMAIL_STATUS_BAR_TEST_ID} />
  }

  return (
    <Status bgColor={STATUS_LIST_ITEMS[emailStatus]} dataTestId={EMAIL_STATUS_BAR_TEST_ID}>
      {emailStatus}
    </Status>
  )
}
