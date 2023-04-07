import { StatusCode } from '@sberauto/loanapplifecycledc-proto/public'

import { Status } from 'shared/ui/Status/Status'

import { getStatus, PreparedStatus } from '../application.utils'

//FIXME: Брать цвета из темы
export const statusListItems: Record<string, string> = {
  [PreparedStatus.initial]: '#0B6B9D',
  [PreparedStatus.processed]: '#FF971E',
  [PreparedStatus.approved]: '#17A131',
  [PreparedStatus.finallyApproved]: '#008000',
  [PreparedStatus.formation]: '#008000',
  [PreparedStatus.rejected]: '#FF2E43',
  [PreparedStatus.canceledDeal]: '#D3D3D3',
  [PreparedStatus.canceled]: '#D7DCE1',
  [PreparedStatus.signed]: '#008000',
  [PreparedStatus.authorized]: '#00FF00',
  [PreparedStatus.financed]: '#00FF7F',
  [PreparedStatus.error]: '#FF0000',
}

type Props = {
  status: StatusCode
}

export const ApplicationStatus = ({ status }: Props) => {
  const preparedStatus = getStatus(status)

  return <Status bgColor={statusListItems[preparedStatus]}>{preparedStatus}</Status>
}
