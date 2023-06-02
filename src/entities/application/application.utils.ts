import { StatusCode } from '@sberauto/loanapplifecycledc-proto/public'

export enum AdditionalOptionsTypes {
  credit = 'credit',
  additionalEquipment = 'additionalEquipment',
  dealerServices = 'dealerServices',
  bankServices = 'bankServices',
}

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

export enum ApplicationTypes {
  initial = 1,
}

export const getStatus = (status: StatusCode) => {
  switch (status) {
    case StatusCode.INITIAL:
      return PreparedStatus.initial
    case StatusCode.PROCESSED:
      return PreparedStatus.processed
    case StatusCode.APPROVED:
      return PreparedStatus.approved
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
    default:
      return PreparedStatus.error
  }
}
