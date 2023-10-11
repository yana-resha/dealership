import { useEffect, useMemo } from 'react'

import { useField, useFormikContext } from 'formik'

import { usePrevious } from 'shared/hooks/usePrevious'

import { FormFieldNameMap } from '../types'
import { useCarSection } from './useCarSection'

export const compareStrings = (a: string, b: string) => {
  // Необходимо выбрать группы состоящие из цифр \d+ , но так же нужны оставшиеся группы,
  // потому добавлено [^\d]+
  const rx = /[^\d]+|\d+/gi
  const aSplit = a.match(rx) ?? []
  const bSplit = b.match(rx) ?? []
  // Разбиваем строку на фрагменты из одних цифр и остальных символов
  // Проходимся по фрагментам сравнивая фрагменты от a и b одинакового индекса.
  for (let i = 0, l = Math.min(aSplit.length, bSplit.length); i < l; i++) {
    const aSubStr = aSplit[i]
    const bSubStr = bSplit[i]
    if (aSubStr === bSubStr) {
      continue
    }
    const aNum = parseInt(aSubStr, 10)
    const bNum = parseInt(bSubStr, 10)
    // Сравниваем номера, значит 2 будет перед 12
    if (aNum && bNum) {
      return aNum - bNum
    }
    // При сравнении номера и текста, номер ставим последним
    if (aNum || bNum) {
      return aSubStr < bSubStr ? 1 : -1
    }

    // Текст сравниваем как обычно
    return aSubStr > bSubStr ? 1 : -1
  }

  return 0
}

export function useCarBrands() {
  const { setFieldValue } = useFormikContext()
  const { cars } = useCarSection()

  const [carBrandField] = useField<string | null>(FormFieldNameMap.carBrand)
  const prevCarBrandValue = usePrevious(carBrandField.value)
  const carBrands = useMemo(() => Object.keys(cars).sort(compareStrings), [cars])
  const carModels = useMemo(
    () =>
      (carBrandField.value && cars[carBrandField.value]?.models ? cars[carBrandField.value].models : []).sort(
        compareStrings,
      ),
    [carBrandField.value, cars],
  )

  useEffect(() => {
    if (prevCarBrandValue !== carBrandField.value) {
      setFieldValue(FormFieldNameMap.carModel, null)
    }
  }, [carBrandField.value, prevCarBrandValue, setFieldValue])

  return { carBrands, carModels, isDisabledCarModel: !carBrandField.value }
}
