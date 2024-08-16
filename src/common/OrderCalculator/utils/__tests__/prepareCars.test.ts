import { prepareBrands } from '../prepareCars'
import { EXPECTED_PREPARE_CARS_DATA, INITIAL_PREPARE_CARS_DATA } from './prepareCars.mock'

describe('prepareCars', () => {
  it('Функция преобразовывает данные корректно', () => {
    expect(prepareBrands(INITIAL_PREPARE_CARS_DATA)).toEqual(EXPECTED_PREPARE_CARS_DATA)
  })

  it('Если в бренде нет ни одной модели, то бренд отфильтровывается', () => {
    const initialValue = {
      ...INITIAL_PREPARE_CARS_DATA,
      Fiat: {
        ...INITIAL_PREPARE_CARS_DATA.Fiat,
        modelInfo: undefined,
      },
    }
    const expectedValue = {
      ...EXPECTED_PREPARE_CARS_DATA,
      brandMap: {
        ...EXPECTED_PREPARE_CARS_DATA.brandMap,
        Fiat: undefined,
      },
      brands: ['BMW'],
    }
    expect(prepareBrands(initialValue)).toEqual(expectedValue)
  })

  it('Если в объекте модели нет названия модели, то этот объект отфильтровывается', () => {
    const initialValue = {
      ...INITIAL_PREPARE_CARS_DATA,
      Fiat: {
        ...INITIAL_PREPARE_CARS_DATA.Fiat,
        modelInfo: {
          ...INITIAL_PREPARE_CARS_DATA.Fiat.modelInfo,
          Punto: {
            ...INITIAL_PREPARE_CARS_DATA.Fiat.modelInfo?.Punto,
            model: undefined,
          },
        },
      },
    }
    const expectedValue = {
      ...EXPECTED_PREPARE_CARS_DATA,
      brandMap: {
        ...EXPECTED_PREPARE_CARS_DATA.brandMap,
        Fiat: {
          ...EXPECTED_PREPARE_CARS_DATA.brandMap.Fiat,
          models: ['500', 'Ducato'],
          modelMap: {
            ...EXPECTED_PREPARE_CARS_DATA.brandMap.Fiat.modelMap,
            Punto: undefined,
          },
        },
      },
    }
    expect(prepareBrands(initialValue)).toEqual(expectedValue)
  })

  it('Если в объекте бренда нет названия бренда, то этот объект отфильтровывается', () => {
    const initialValue = {
      ...INITIAL_PREPARE_CARS_DATA,
      Fiat: {
        ...INITIAL_PREPARE_CARS_DATA.Fiat,
        brand: undefined,
      },
    }
    const expectedValue = {
      ...EXPECTED_PREPARE_CARS_DATA,
      brands: ['BMW'],
      brandMap: {
        ...EXPECTED_PREPARE_CARS_DATA.brandMap,
        Fiat: undefined,
      },
    }
    expect(prepareBrands(initialValue)).toEqual(expectedValue)
  })

  it('Если в объекте бренда нет maxCarAge, то этот объект отфильтровывается', () => {
    const initialValue = {
      ...INITIAL_PREPARE_CARS_DATA,
      Fiat: {
        ...INITIAL_PREPARE_CARS_DATA.Fiat,
        maxCarAge: undefined,
      },
    }
    const expectedValue = {
      ...EXPECTED_PREPARE_CARS_DATA,
      brands: ['BMW'],
      brandMap: {
        ...EXPECTED_PREPARE_CARS_DATA.brandMap,
        Fiat: undefined,
      },
    }
    expect(prepareBrands(initialValue)).toEqual(expectedValue)
  })
})
