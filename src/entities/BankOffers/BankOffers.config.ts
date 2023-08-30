export enum TableCellKey {
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

export const BANK_OFFERS_TABLE_HEADERS = [
  { key: TableCellKey.ProductName, label: 'Продукт' },
  { key: TableCellKey.Downpayment, label: 'ПВ' },
  { key: TableCellKey.Term, label: 'Срок' },
  { key: TableCellKey.MonthlyPayment, label: 'Платеж' },
  // убрали тк не будет функционала в пилоте
  // { key: TableCellKey.LastPayment, label: 'Последний платеж' },
  { key: TableCellKey.Overpayment, label: 'Переплата' },
  { key: TableCellKey.CurrentRate, label: '% ставка' },
  { key: TableCellKey.CascoFlag, label: 'КАСКО' },
  { key: TableCellKey.TotalSum, label: 'Сумма кредита' },
  { key: TableCellKey.Attachment, label: '', type: TableCellType.Icon }, //пустой столбец для отображения иконоки графика платежей
  { key: TableCellKey.IncomeFlag, label: '', type: TableCellType.Icon }, //пустой столбец для отображения иконки обязательности подтверждения дохода
]
