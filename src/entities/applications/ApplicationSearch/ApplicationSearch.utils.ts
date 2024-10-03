import { FormikErrors } from 'formik'

import { FormApplicationFiltersValues, FindApplicationsReq } from './ApplicationSearch.types'

const PASSPORT_NUMBER_LENGTH = 10

const standardError = 'Формат ввода данных: Паспорт - 10 цифр, Номер заявки - более 10 цифр, Фамилия - буквы'

export const validateFiltersFields = (
  values: {
    findApplication: string
    onlyUserApplications: {
      employeeId?: string
      onlyUserApplicationsFlag?: boolean
    }
  },
  onSubmit: (req: FindApplicationsReq) => void,
  setErrors: (errors: FormikErrors<FormApplicationFiltersValues>) => void,
) => {
  const { findApplication, onlyUserApplications } = values
  const noSpacing = findApplication.replace(/ /g, '')

  if (/[а-яА-ЯёЁ]/g.test(noSpacing)) {
    onSubmit({
      ...onlyUserApplications,
      lastName: noSpacing,
    })
    //Если длина значения соответствует длине номера паспорта
  } else if (noSpacing.length === PASSPORT_NUMBER_LENGTH) {
    //Разбиваем число на серию номер и отправляем на бекенд с остальными введенными параметрами
    const passportSeries = noSpacing.substring(0, 4)
    const passportNumber = noSpacing.substring(4, 10)
    onSubmit({
      ...onlyUserApplications,
      passportNumber,
      passportSeries,
    })
    //И длина значения соответствует длине номера заявки
  } else if (noSpacing.length > PASSPORT_NUMBER_LENGTH) {
    //отправляем на бекенд с остальными введенными параметрами
    onSubmit({
      ...onlyUserApplications,
      applicationNumber: noSpacing,
    })
    //И длина значения не соответствует ни номеру паспорта ни номеру заявки
  } else {
    //Устанавливаем ошибку
    setErrors({ findApplication: standardError })
  }
}
