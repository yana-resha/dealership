export enum HeaderCellKey {
  ProductName = 'productName',
  Downpayment = 'downpayment',
  Term = 'term',
  MonthlyPayment = 'monthlyPayment',
  LastPayment = 'lastPayment',
  Overpayment = 'overpayment',
  CurrentRate = 'currentRate',
  CascoFlag = 'cascoFlag',
  TotalSum = 'totalSum',
  Attachment = 'attachment',
  IncomeFlag = 'incomeFlag',
}

export enum TableCellType {
  Icon = 'icon',
}

export enum SortOrder {
  Asc = 'asc',
  Desc = 'desc',
}

export type BankOffersTableHeader = {
  key: HeaderCellKey
  label: string
  isCanSort?: boolean
  type?: TableCellType
}

export const BANK_OFFERS_TABLE_HEADERS = [
  { key: HeaderCellKey.ProductName, label: 'Продукт', isCanSort: true },
  { key: HeaderCellKey.Downpayment, label: 'ПВ' },
  { key: HeaderCellKey.Term, label: 'Срок' },
  { key: HeaderCellKey.MonthlyPayment, label: 'Платеж', isCanSort: true },
  // убрали тк не будет функционала в пилоте
  // { key: HeaderCell.LastPayment, label: 'Последний платеж' },
  { key: HeaderCellKey.Overpayment, label: 'Переплата', isCanSort: true },
  { key: HeaderCellKey.CurrentRate, label: '% ставка', isCanSort: true },
  { key: HeaderCellKey.CascoFlag, label: 'КАСКО', isCanSort: true },
  { key: HeaderCellKey.TotalSum, label: 'Сумма кредита' },
  { key: HeaderCellKey.Attachment, label: '', type: TableCellType.Icon }, //пустой столбец для отображения иконоки графика платежей
  { key: HeaderCellKey.IncomeFlag, label: '', type: TableCellType.Icon }, //пустой столбец для отображения иконки обязательности подтверждения дохода
]
