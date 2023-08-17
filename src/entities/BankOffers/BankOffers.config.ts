export const BANK_OFFERS_TABLE_HEADERS = [
  { key: 'productName', label: 'Продукт' },
  { key: 'downpayment', label: 'ПВ' },
  { key: 'term', label: 'Срок' },
  { key: 'monthlyPayment', label: 'Платеж' },
  // убрали тк не будет функционала в пилоте
  // { key: 'lastPayment', label: 'Последний платеж' },
  { key: 'overpayment', label: 'Переплата' },
  { key: 'currentRate', label: '% ставка' },
  { key: 'cascoFlag', label: 'КАСКО' },
  { key: 'amountWithoutPercent', label: 'Сумма кредита' },
  // убрали тк не будет функционала в пилоте
  // { key: 'attachment', label: '', type: 'icon' }, //пустой столбец для отображения иконоки графика платежей
  { key: 'incomeFlag', label: '', type: 'icon' }, //пустой столбец для отображения иконки обязательности подтверждения дохода
]
