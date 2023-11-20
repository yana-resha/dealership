export enum ApplicationHeaders {
  AppId = 'Номер заявки',
  Data = 'Дата',
  ClientName = 'ФИО Клиента',
  DcNumber = 'Номер ДЦ',
  Source = 'Источник',
  PermitTerm = 'Срок действия решения',
  Status = 'Статус',
}

export const APPLICATION_HEADERS = [
  ApplicationHeaders.AppId,
  ApplicationHeaders.Data,
  ApplicationHeaders.ClientName,
  ApplicationHeaders.DcNumber,
  ApplicationHeaders.Source,
  ApplicationHeaders.PermitTerm,
  ApplicationHeaders.Status,
]

export const ALIGNED_CELL = [ApplicationHeaders.Source, ApplicationHeaders.PermitTerm]
export const alignedCellIdx = APPLICATION_HEADERS.map((header, i) =>
  ALIGNED_CELL.includes(header) ? i : null,
).filter(header => header !== null)
