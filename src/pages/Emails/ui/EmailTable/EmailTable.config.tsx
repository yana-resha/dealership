export enum EmailTableHeader {
  VIEWED_STATUS = 'Не прочитано',
  SENDER = 'Отправитель',
  TOPIC = 'Тема',
  DATE = 'Дата',
  STATUS = 'Статус',
  APPLICATION_NUMBER = 'Номер',
}

export const EMAIL_TABLE_HEADERS = [
  EmailTableHeader.VIEWED_STATUS,
  EmailTableHeader.SENDER,
  EmailTableHeader.TOPIC,
  EmailTableHeader.DATE,
  EmailTableHeader.STATUS,
  EmailTableHeader.APPLICATION_NUMBER,
]
