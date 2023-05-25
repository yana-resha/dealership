import { prepareCars } from '../prepareCars'

describe('prepareCars', () => {
  it('Функция преобразовывает данные корректно', () => {
    const initialValue = [
      { brand: 'BMW', models: ['1 series', '3 series'] },
      { brand: 'Fiat', models: ['Ducato', 'Punto', '500'] },
    ]
    const expectedValue = {
      cars: {
        BMW: ['1 series', '3 series'],
        Fiat: ['Ducato', 'Punto', '500'],
      },
    }
    expect(prepareCars(initialValue)).toEqual(expectedValue)
  })

  it('Функция обробатывает ошибки', () => {
    const initialValue = [
      { brand: 'BMW' },
      { models: ['Ducato', 'Punto', '500'] },
      { brand: 'KIA', models: ['Picanto', 'Rio', 'Ceed'] },
    ]
    const expectedValue = { cars: { KIA: ['Picanto', 'Rio', 'Ceed'] } }
    expect(prepareCars(initialValue)).toEqual(expectedValue)
  })
})
