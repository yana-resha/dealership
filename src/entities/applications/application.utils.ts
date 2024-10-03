import { StatusCode } from '@sberauto/loanapplifecycledc-proto/public'

export enum PreparedStatus {
  initial = 'Черновик',
  processed = 'Ожидает решение',
  approved = 'Предварительно одобрен',
  finallyApproved = 'Кредит одобрен',
  formation = 'Подписание КД',
  rejected = 'Отказ',
  canceledDeal = 'Истек срок одобрения',
  canceled = 'Отменен',
  signed = 'КД подписан',
  signing = 'Ожидание финансирования',
  financed = 'Клиент профинансирован',
  error = 'Ошибка',
  issueError = 'Ошибка финансирования',
  clientRejected = 'Отказ по клиенту',
  waitingConfirmation = 'Ожидает СМС подтверждения',
  lackConfirmation = 'Отказ СМС подтверждения',
  dcFinanced = 'Кредит выдан',
  smsFailed = 'Ошибка СМС подтверждения',
}

export enum AnketaType {
  Incomplete = 0,
  Complete = 1,
  Full = 2,
}

const StatusMap = new Map([
  [StatusCode.INITIAL, PreparedStatus.initial],
  [StatusCode.PROCESSED, PreparedStatus.processed],
  [StatusCode.APPROVED, PreparedStatus.approved],
  [StatusCode.NEED_REFORMATION, PreparedStatus.finallyApproved],
  [StatusCode.FINALLY_APPROVED, PreparedStatus.finallyApproved],
  [StatusCode.FORMATION, PreparedStatus.formation],
  [StatusCode.REJECTED, PreparedStatus.rejected],
  [StatusCode.CANCELED_DEAL, PreparedStatus.canceledDeal],
  [StatusCode.CANCELED, PreparedStatus.canceled],
  [StatusCode.SIGNED, PreparedStatus.signed],
  [StatusCode.ISSUED, PreparedStatus.financed],
  [StatusCode.AUTHORIZED, PreparedStatus.signing],
  [StatusCode.ISSUE_ERROR, PreparedStatus.issueError],
  [StatusCode.CLIENT_REJECTED, PreparedStatus.clientRejected],
  [StatusCode.SIGNING, PreparedStatus.signing],
  [StatusCode.SIGN_ERROR, PreparedStatus.issueError],
  [StatusCode.ERROR, PreparedStatus.error],
  [StatusCode.WAITING_CONFIRMATION, PreparedStatus.waitingConfirmation],
  [StatusCode.LACK_CONFIRMATION, PreparedStatus.lackConfirmation],
  [StatusCode.DC_FINANCED, PreparedStatus.dcFinanced],
  [StatusCode.SMS_FAILED, PreparedStatus.smsFailed],
])

export enum ApplicationSource {
  CAR_LOAN_APPLICATION_DC = 'CARLOANAPPLICATIONDC',
}
export const getStatus = (status: StatusCode) => StatusMap.get(status) ?? PreparedStatus.error

export const getStatusCodeByPrepared = (preparedStatus: PreparedStatus) =>
  Array.from(StatusMap.entries())
    .filter(([k, v]) => v === preparedStatus)
    .map(([k, v]) => k)
