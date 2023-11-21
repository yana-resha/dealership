export const MOCKED_USER = {
  lastName: 'lastName',
  middleName: 'middleName',
  firstName: 'firstName',
}

export const MOCKED_VENDOR_CODE = '2002985190'

export const EXPECTED_MAIL_BODY = `ФИО пользователя: lastName firstName middleName;
Номер дилерского центра: 2002985190;
Номер заявки на кредит:
ФИО клиента:
Описание проблемы:
`

export const MAIL_FORM_FIELDS = [
  'ФИО пользователя:',
  'Номер дилерского центра:',
  'Номер заявки на кредит:',
  'ФИО клиента:',
  'Описание проблемы:',
]
