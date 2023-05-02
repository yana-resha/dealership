import { ADDITIONAL_CELL_NAME } from './BankOffers.config'
import { PreparedTableData } from './BankOffers.types'

export const getCellsChildrens = (row: PreparedTableData) => [
  ...Object.entries(row).reduce((acc, [key, value]) => {
    if (key === 'id') {
      return acc
    }

    acc.push({ name: key, value })

    return acc
  }, [] as { name: string; value: string | boolean }[]),
  { name: ADDITIONAL_CELL_NAME, value: '' },
]

const prettifyString = (str: string) => str.replace(/(\d{1,3}(?=(?:\d\d\d)+(?!\d)))/g, '$1' + ' ')

export const prepareData = (data: PreparedTableData[]) =>
  data.map(d => {
    const initialPayment = prettifyString(d.initialPayment)
    const loanTerm = `${d.loanTerm} мес`
    const monthlyPayment = prettifyString(d.monthlyPayment)
    const lastPayment = prettifyString(d.lastPayment)
    const overpayment = prettifyString(d.overpayment)
    const loanAmount = prettifyString(d.loanAmount)

    return { ...d, initialPayment, loanTerm, monthlyPayment, lastPayment, overpayment, loanAmount }
  })
