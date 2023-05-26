import { useCallback } from 'react'

import { ArrayHelpers, useFormikContext } from 'formik'

import { ChangingIdsOption } from '../constants'

const MIN_ITEMS_LENGTH = 1

type Params = {
  parentName: string
  index: number
  arrayHelpers?: ArrayHelpers
  arrayLength?: number
  changeIds?: (idx: number, changingOption: string, minItems?: number) => void
}

// Хук для работы с айтемами доп.оборудования или доп, услуг. Принимает:
// parentName - имя поля в, котором отображается массив айтемов
//  (каждый айтем в данном случае это объект доп. оборудования/услуги);
// index - индекс айтема;
// arrayLength - текущая длина массива айтемов;
// arrayHelpers - объект с хэлперами, который отдает компонент FieldArray;
// changeIds - вспомогательная функция из хука useAdditionalServiceIds - служит для задания
//  уникальных key для айтемов.
// Возвращает:
// namePrefix - необходим formik-у для корректной обработки значений в FieldArray.
//  Например, массив доп оборудования содержит объекты, в которых записаны значения полей
//  "Вид оборудования", "стоимость" и т.д. Каждое поле в первом айтеме в этом случае
//  должно иметь имя, начинающееся с "additionalEquipments.0. ".
// addItem - функция добавления айтема в массив доп. оборудования или доп. услуг
// removeItem - функция удаления айтема из массива доп. оборудования или доп. услуг.
// Но в форме должен всегда отображаться хотя бы один айтем (с пустыми полями для ввода).
// Потому если длина массива не превышает 1 (MIN_ITEMS_LENGTH), то айтем не удаляется,
// а заменяется на айтем со значениями из initialValues
export function useAdditionalServices({ parentName, index, arrayLength, arrayHelpers, changeIds }: Params) {
  const namePrefix = `${parentName}[${index}].`
  const { initialValues } = useFormikContext<any>()

  const removeItem = useCallback(() => {
    if (arrayLength && arrayHelpers && changeIds) {
      if (arrayLength > MIN_ITEMS_LENGTH) {
        arrayHelpers.remove(index)
        changeIds(index, ChangingIdsOption.remove)
      } else {
        arrayHelpers.replace(index, initialValues[parentName][0])
        changeIds(index, ChangingIdsOption.clear, MIN_ITEMS_LENGTH)
      }
    }
  }, [arrayHelpers, arrayLength, changeIds, index, initialValues, parentName])

  const addItem = useCallback(() => {
    if (arrayHelpers && changeIds) {
      arrayHelpers.insert(index + 1, initialValues[parentName][0])
      changeIds(index, ChangingIdsOption.add)
    }
  }, [arrayHelpers, changeIds, index, initialValues, parentName])

  return { namePrefix, removeItem, addItem }
}
