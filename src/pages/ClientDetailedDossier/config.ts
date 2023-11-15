import { DocumentType } from '@sberauto/loanapplifecycledc-proto/public'

export const progressBarConfig = {
  steps: ['Сформировать договор', 'Скачать КД', 'Подписать КД', 'Проверка реквизитов'],
}

export const agreementDocTypes = [
  DocumentType.CREDIT_CONTRACT,
  DocumentType.ACCOUNT_OPEN_FORM,
  DocumentType.STATEMENT_FORM,
]
