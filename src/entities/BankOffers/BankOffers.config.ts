export enum HeaderCellKey {
  PRODUCT_NAME = 'productName',
  DOWNPAYMENT = 'downpayment',
  TERM = 'term',
  MONTHLY_PAYMENT = 'monthlyPayment',
  LAST_PAYMENT = 'lastPayment',
  OVERPAYMENT = 'overpayment',
  CURRENT_RATE = 'currentRate',
  CASCO_FLAG = 'cascoFlag',
  REQUIRED_SERVICE_FLAG = 'requiredServiceFlag',
  TOTAL_SUM = 'totalSum',
  ATTACHMENT = 'attachment',
  INCOME_FLAG = 'incomeFlag',
}

export enum TableCellType {
  ICON = 'icon',
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export type BankOffersTableHeader = {
  key: HeaderCellKey
  label: string
  isCanSort?: boolean
  type?: TableCellType
}

export const BANK_OFFERS_TABLE_HEADERS = [
  { key: HeaderCellKey.PRODUCT_NAME, label: 'Продукт', isCanSort: true },
  { key: HeaderCellKey.DOWNPAYMENT, label: 'ПВ' },
  { key: HeaderCellKey.TERM, label: 'Срок' },
  { key: HeaderCellKey.MONTHLY_PAYMENT, label: 'Платеж', isCanSort: true },
  // убрали тк не будет функционала в пилоте
  // { key: HeaderCell.LAST_PAYMENT, label: 'Последний платеж' },
  { key: HeaderCellKey.OVERPAYMENT, label: 'Переплата', isCanSort: true },
  { key: HeaderCellKey.CURRENT_RATE, label: '% ставка', isCanSort: true },
  // { key: HeaderCellKey.CASCO_FLAG, label: 'КАСКО', isCanSort: true },
  { key: HeaderCellKey.REQUIRED_SERVICE_FLAG, label: 'Обязательность услуги', isCanSort: true },
  { key: HeaderCellKey.TOTAL_SUM, label: 'Сумма кредита' },
  { key: HeaderCellKey.ATTACHMENT, label: '', type: TableCellType.ICON }, //пустой столбец для отображения иконоки графика платежей
  { key: HeaderCellKey.INCOME_FLAG, label: '', type: TableCellType.ICON }, //пустой столбец для отображения иконки обязательности подтверждения дохода
]
