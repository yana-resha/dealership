import { DocumentType } from '@sberauto/loanapplifecycledc-proto/public'

export const progressBarConfig = {
  steps: ['Сформировать договор', 'Скачать КД', 'Подписать КД', 'Проверка реквизитов'],
}

// TODO DCB-890 Тут должен быть еще DocumentType.STATEMENT_FORM, но пока Бэк не сделал его формирование,
// и он не приходит. Добавить по готовности Бэка
export const agreementDocTypes = [DocumentType.CREDIT_CONTRACT, DocumentType.ACCOUNT_OPEN_FORM]
