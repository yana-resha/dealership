import { StatusCode } from '@sberauto/loanapplifecycledc-proto/public'

import { Status } from 'shared/ui/Status/Status'

import { getStatus, PreparedStatus } from '../application.utils'

//FIXME: Брать цвета из темы
export const statusListItems: Record<string, string> = {
  [PreparedStatus.initial]: '#0B6B9D',
  [PreparedStatus.processed]: '#FF971E',
  [PreparedStatus.approved]: '#17A131',
  [PreparedStatus.finallyApproved]: '#17A131',
  [PreparedStatus.formation]: '#17A131',
  [PreparedStatus.rejected]: '#FF2E43',
  [PreparedStatus.canceledDeal]: '#D3D3D3',
  [PreparedStatus.canceled]: '#D7DCE1',
  [PreparedStatus.signed]: '#17A131',
  [PreparedStatus.authorized]: '#FF971E',
  [PreparedStatus.financed]: '#17A131',
  [PreparedStatus.error]: '#FF0000',
  [PreparedStatus.issueError]: '#FF0000',
}

type Props = {
  status: StatusCode
}

export const ApplicationStatus = ({ status }: Props) => {
  const preparedStatus = getStatus(status)

  return <Status bgColor={statusListItems[preparedStatus]}>{preparedStatus}</Status>
}
