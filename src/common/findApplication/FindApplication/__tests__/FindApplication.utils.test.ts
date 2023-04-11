import { transformResToTableData } from '../FindApplication.utils'
import { dataMock, preparedMock } from './FindApplication.mock'

describe('transformResToTableData', () => {
  it('возвращает верные обработанные значения', () => {
    expect(transformResToTableData(dataMock)).toMatchObject(preparedMock)
  })

  describe('фио формируется корректно', () => {
    it('если все поля пустые', () => {
      expect(
        transformResToTableData([{ ...dataMock[0], firstName: '', lastName: '', middleName: '' }]),
      ).toMatchObject([{ ...preparedMock[0], fullName: '' }])
    })
    it('если заполнено только имя', () => {
      expect(
        transformResToTableData([{ ...dataMock[0], firstName: 'а', lastName: '', middleName: '' }]),
      ).toMatchObject([{ ...preparedMock[0], fullName: 'а' }])
    })
    it('если заполнено только фамилия', () => {
      expect(
        transformResToTableData([{ ...dataMock[0], firstName: '', lastName: 'а', middleName: '' }]),
      ).toMatchObject([{ ...preparedMock[0], fullName: 'а' }])
    })
    it('если заполнено только отчество', () => {
      expect(
        transformResToTableData([{ ...dataMock[0], firstName: '', lastName: '', middleName: 'а' }]),
      ).toMatchObject([{ ...preparedMock[0], fullName: 'а' }])
    })
  })
})
