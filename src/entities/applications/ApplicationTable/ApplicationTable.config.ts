export enum ApplicationHeaders {
  AppId = 'Номер заявки',
  Date = 'Дата',
  ClientName = 'ФИО Клиента',
  Source = 'Источник',
  PermitTerm = 'Срок действия решения',
  Status = 'Статус',
}

export const APPLICATION_HEADERS = [
  ApplicationHeaders.AppId,
  ApplicationHeaders.Date,
  ApplicationHeaders.ClientName,
  ApplicationHeaders.Source,
  ApplicationHeaders.PermitTerm,
  ApplicationHeaders.Status,
]

export const HEADERS_WITH_TOOLTIP = [ApplicationHeaders.Date, ApplicationHeaders.PermitTerm]

export const HEADERS_WITH_FILTER = [ApplicationHeaders.Date, ApplicationHeaders.Status]

export const ALIGNED_CELL = [ApplicationHeaders.Source, ApplicationHeaders.PermitTerm]
export const alignedCellIdx = APPLICATION_HEADERS.map((header, i) =>
  ALIGNED_CELL.includes(header) ? i : null,
).filter(header => header !== null)
