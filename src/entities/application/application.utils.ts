import { StatusCode } from '@sberauto/loanapplifecycledc-proto/public'

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
  issueError = 'Ошибка финансирования',
}

export enum ApplicationTypes {
  incomplete = 0,
  complete = 1,
}

export const getStatus = (status: StatusCode) => {
  switch (status) {
    case StatusCode.INITIAL:
      return PreparedStatus.initial
    case StatusCode.PROCESSED:
      return PreparedStatus.processed
    case StatusCode.APPROVED:
      return PreparedStatus.approved
    case StatusCode.NEED_REFORMATION:
    case StatusCode.FINALLY_APPROVED:
      return PreparedStatus.finallyApproved
    case StatusCode.FORMATION:
      return PreparedStatus.formation
    case StatusCode.REJECTED:
      return PreparedStatus.rejected
    case StatusCode.CANCELED_DEAL:
      return PreparedStatus.canceledDeal
    case StatusCode.CANCELED:
      return PreparedStatus.canceled
    case StatusCode.SIGNED:
      return PreparedStatus.signed
    case StatusCode.ISSUED:
      return PreparedStatus.financed
    case StatusCode.AUTHORIZED:
      return PreparedStatus.authorized
    case StatusCode.ISSUE_ERROR:
      return PreparedStatus.issueError
    default:
      return PreparedStatus.error
  }
}
