import { DocumentType } from '@sberauto/loanapplifecycledc-proto/public'

export const progressBarConfig = {
  steps: ['Сформировать договор', 'Скачать КД', 'Подписать КД', 'Проверка реквизитов'],
}

export const AGREEMENT_DOC_TYPES = [
  DocumentType.CREDIT_CONTRACT,
  DocumentType.ACCOUNT_OPEN_FORM,
  DocumentType.STATEMENT_FORM,
]

export const ADDITIONAL_AGREEMENT_DOC_TYPES = [
  DocumentType.PDN_NOTIFICATION_FORM,
  DocumentType.ADD_OPTION_APPLICATION,
]
