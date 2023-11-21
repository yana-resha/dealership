export const HELPDESK_MAIL = '911@sberauto.com'

export enum MailFormFields {
  UserName = 'ФИО пользователя:',
  DealershipNumber = 'Номер дилерского центра:',
  ApplicationNumber = 'Номер заявки на кредит:',
  ClientName = 'ФИО клиента:',
  Request = 'Описание проблемы:',
}

export const MAIL_FORM_FIELDS = [
  MailFormFields.UserName,
  MailFormFields.DealershipNumber,
  MailFormFields.ApplicationNumber,
  MailFormFields.ClientName,
  MailFormFields.Request,
]
