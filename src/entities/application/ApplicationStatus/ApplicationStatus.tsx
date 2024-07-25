import { StatusCode } from '@sberauto/loanapplifecycledc-proto/public'

import { theme } from 'app/theme'
import { Status } from 'shared/ui/Status/Status'

import { getStatus, PreparedStatus } from '../application.utils'

export const statusListItems: Record<string, string> = {
  [PreparedStatus.initial]: theme.palette.status.initial,
  [PreparedStatus.processed]: theme.palette.status.processed,
  [PreparedStatus.approved]: theme.palette.status.approved,
  [PreparedStatus.finallyApproved]: theme.palette.status.approved,
  [PreparedStatus.formation]: theme.palette.status.approved,
  [PreparedStatus.rejected]: theme.palette.status.rejected,
  [PreparedStatus.clientRejected]: theme.palette.status.rejected,
  [PreparedStatus.canceledDeal]: theme.palette.status.canceled,
  [PreparedStatus.canceled]: theme.palette.status.canceled,
  [PreparedStatus.signed]: theme.palette.status.approved,
  [PreparedStatus.authorized]: theme.palette.status.processed,
  [PreparedStatus.financed]: theme.palette.status.approved,
  [PreparedStatus.error]: theme.palette.status.error,
  [PreparedStatus.issueError]: theme.palette.status.error,
}

type Props = {
  status: StatusCode
}

export const ApplicationStatus = ({ status }: Props) => {
  const preparedStatus = getStatus(status)

  return <Status bgColor={statusListItems[preparedStatus]}>{preparedStatus}</Status>
}
