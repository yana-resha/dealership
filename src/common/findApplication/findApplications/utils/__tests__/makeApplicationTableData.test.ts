import { makeApplicationTableData } from '../makeApplicationTableData'
import { dataMock, preparedMock } from './makeApplicationTableData.mock'

describe('makeApplicationTableData', () => {
  it('возвращает верные обработанные значения', () => {
    expect(makeApplicationTableData(dataMock)).toMatchObject(preparedMock)
  })

  describe('фио формируется корректно', () => {
    it('если все поля пустые', () => {
      expect(
        makeApplicationTableData([{ ...dataMock[0], firstName: '', lastName: '', middleName: '' }]),
      ).toMatchObject([{ ...preparedMock[0], fullName: '' }])
    })
    it('если заполнено только имя', () => {
      expect(
        makeApplicationTableData([{ ...dataMock[0], firstName: 'а', lastName: '', middleName: '' }]),
      ).toMatchObject([{ ...preparedMock[0], fullName: 'а' }])
    })
    it('если заполнено только фамилия', () => {
      expect(
        makeApplicationTableData([{ ...dataMock[0], firstName: '', lastName: 'а', middleName: '' }]),
      ).toMatchObject([{ ...preparedMock[0], fullName: 'а' }])
    })
    it('если заполнено только отчество', () => {
      expect(
        makeApplicationTableData([{ ...dataMock[0], firstName: '', lastName: '', middleName: 'а' }]),
      ).toMatchObject([{ ...preparedMock[0], fullName: 'а' }])
    })
  })
})
