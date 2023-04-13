import { StatusCode } from '@sberauto/loanapplifecycledc-proto/public'

import { Status } from 'shared/ui/Status/Status'

const getStatus = (status: StatusCode) => {
  switch (status) {
    case StatusCode.STATUS_CODE_INITIAL:
      return PreparedStatus.initial
    case StatusCode.STATUS_CODE_PROCESSED:
      return PreparedStatus.processed
    case StatusCode.STATUS_CODE_APPROVED:
      return PreparedStatus.approved
    case StatusCode.STATUS_CODE_FINALLY_APPROVED:
      return PreparedStatus.finallyApproved
    case StatusCode.STATUS_CODE_FORMATION:
      return PreparedStatus.formation
    case StatusCode.STATUS_CODE_REJECTED:
      return PreparedStatus.rejected
    case StatusCode.STATUS_CODE_CANCELED_DEAL:
      return PreparedStatus.canceledDeal
    case StatusCode.STATUS_CODE_CANCELED:
      return PreparedStatus.canceled
    case StatusCode.STATUS_CODE_SIGNED:
      return PreparedStatus.signed
    case StatusCode.STATUS_CODE_FINANCED:
      return PreparedStatus.financed
    case StatusCode.STATUS_CODE_AUTHORIZED:
      return PreparedStatus.authorized
    default:
      return PreparedStatus.error
  }
}

//FIXME: не стала выносить что бы не плодить конфликты, вынесено в https://gitlab.com/sberauto/front/dealershipclient/-/merge_requests/34
export enum PreparedStatus {
  initial = 'Черновик',
  processed = 'Ожидает решение',
  approved = 'Предварительно одобрен',
  finallyApproved = 'Кредит одобрен',
  formation = 'Формирование КД',
  rejected = 'Отказ',
  canceledDeal = 'КД Отменен',
  canceled = 'Отменен',
  signed = 'КД подписан',
  authorized = 'Ожидание финансирования',
  financed = 'Кредит выдан',
  error = 'Ошибка',
}

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
