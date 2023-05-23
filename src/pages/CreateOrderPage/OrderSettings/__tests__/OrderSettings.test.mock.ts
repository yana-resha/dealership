import { sleep } from 'shared/lib/sleep'

//TODO DCB-239: Убрать мок после интеграции
export const mockCalculateCreditResponse = async () => {
  await sleep(1000)

  return {
    products: [
      {
        productFamilyCode: 'DRVBF',
        productCode: 'DRVB',
        productName: 'Драйв В', //creditProduct
        downpayment: 200000, //initialPayment
        term: 24, //term
        monthlyPayment: 9400, //monthlyPayment
        lastPayment: 9400, //lastPayment
        overpayment: 0, //overpayment
        currentRate: 18, //interestRate
        cascoFlag: true, //insurance
        totalSum: 1821466, //loanAmount
      },
      {
        productFamilyCode: 'DRVCF',
        productCode: 'DRVC',
        productName: 'Драйв C',
        downpayment: 300000,
        term: 36,
        monthlyPayment: 10400,
        lastPayment: 10400,
        overpayment: 10000,
        currentRate: 17.5,
        cascoFlag: false,
        totalSum: 2100000,
      },
      {
        productFamilyCode: 'DRVDF',
        productCode: 'DRVD',
        productName: 'Драйв D',
        downpayment: 250000,
        term: 24,
        monthlyPayment: 15400,
        lastPayment: 15400,
        overpayment: 15000,
        currentRate: 16.3,
        cascoFlag: true,
        totalSum: 3000000,
      },
    ],
  }
}

export const mockCalculateCreditResponseForTest = () => ({
  products: [
    {
      productFamilyCode: 'DRVBF',
      productCode: 'DRVB',
      productName: 'Драйв В',
      downpayment: 200000,
      term: 24,
      monthlyPayment: 9400,
      lastPayment: 9400,
      overpayment: 0,
      currentRate: 18,
      cascoFlag: true,
      totalSum: 1821466,
    },
  ],
})