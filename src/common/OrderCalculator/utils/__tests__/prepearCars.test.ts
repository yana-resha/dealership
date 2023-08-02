import { prepareCars } from '../prepareCars'

describe('prepareCars', () => {
  it('Функция преобразовывает данные корректно', () => {
    const initialValue = [
      { brand: 'BMW', models: ['1 series', '3 series'], maxCarAge: 10, autoCategory: 'A' },
      { brand: 'Fiat', models: ['Ducato', 'Punto', '500'], maxCarAge: 20, autoCategory: 'A' },
    ]
    const expectedValue = {
      cars: {
        BMW: { brand: 'BMW', models: ['1 series', '3 series'], maxCarAge: 10, autoCategory: 'A' },
        Fiat: { brand: 'Fiat', models: ['Ducato', 'Punto', '500'], maxCarAge: 20, autoCategory: 'A' },
      },
    }
    expect(prepareCars(initialValue)).toEqual(expectedValue)
  })

  it('Функция обробатывает ошибки', () => {
    const initialValue = [
      { brand: 'BMW' },
      { models: ['Ducato', 'Punto', '500'] },
      { brand: 'BMW', models: ['Ducato', 'Punto', '500'] },
      { brand: 'KIA', models: ['Picanto', 'Rio', 'Ceed'], maxCarAge: 10 },
    ]
    const expectedValue = {
      cars: { KIA: { brand: 'KIA', models: ['Picanto', 'Rio', 'Ceed'], maxCarAge: 10 } },
    }
    expect(prepareCars(initialValue)).toEqual(expectedValue)
  })
})
