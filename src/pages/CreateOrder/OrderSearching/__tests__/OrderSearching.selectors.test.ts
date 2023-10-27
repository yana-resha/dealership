import { slStorageOrder, slIsOrderExist } from '../OrderSearching.selectors'

describe('Тестирование селекторов', () => {
  describe('slStorageOrder', () => {
    it('Должен выбирать корректные поля из состояния заявки', () => {
      const mockState = {
        order: {
          order: {
            birthDate: '2000-01-01',
            firstName: 'John',
            lastName: 'Doe',
            middleName: 'Smith',
            passportSeries: '1234',
            passportNumber: '567890',
            phoneNumber: '1234567890',
          },
        },
      } as unknown as RootState
      const result = slStorageOrder(mockState)
      expect(result).toEqual(mockState.order.order)
    })
  })

  describe('slIsOrderExist', () => {
    it('Должен возвращать true, если все поля в заявке присутствуют', () => {
      const mockState = {
        order: {
          order: {
            birthDate: '2000-01-01',
            firstName: 'John',
            lastName: 'Doe',
            middleName: 'Smith',
            passportSeries: '1234',
            passportNumber: '567890',
            phoneNumber: '1234567890',
          },
        },
      } as unknown as RootState
      const result = slIsOrderExist(mockState)
      expect(result).toBeTruthy()
    })

    it('Должен возвращать false, если хотя бы одно поле в заявке отсутствует', () => {
      const mockState = {
        order: {
          order: {
            birthDate: '2000-01-01',
            firstName: 'John',
            lastName: 'Doe',
            middleName: null,
            passportSeries: '1234',
            passportNumber: '567890',
            phoneNumber: '1234567890',
          },
        },
      } as unknown as RootState
      const result = slIsOrderExist(mockState)
      expect(result).toBeFalsy()
    })
  })
})
