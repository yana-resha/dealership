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
}

export const getStatus = (status: StatusCode) => {
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
