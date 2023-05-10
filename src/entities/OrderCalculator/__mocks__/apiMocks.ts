import { sleep } from 'shared/lib/sleep'

//TODO DCB-238: Убрать мок после интеграции
export const mockGetVendorOptionsResponse = async () => {
  await sleep(1000)

  return {
    options: [
      {
        type: 'Страхование',
        optionName: 'ОСАГО',
      },
      {
        type: 'Страхование',
        optionName: 'КАСКО',
      },
      {
        type: 'Тюнинг',
        optionName: 'Перекрасить авто',
      },
      {
        type: 'Тюнинг',
        optionName: 'Графика на кузове',
      },
    ],
  }
}
