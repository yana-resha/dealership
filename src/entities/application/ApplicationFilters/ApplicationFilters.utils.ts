import { FindApplicationsRequest } from '@sberauto/loanapplifecycledc-proto/public'
import { FormikErrors } from 'formik'
import { DateTime } from 'luxon'

import { applicationFiltersValues } from './ApplicationFilters.types'

const PASSPORT_NUMBER_LENGTH = 10
const APPLICATION_NUMBER_LENGTH = 12
const standardError =
  'Формат ввода данных: \n Паспорт - ХХХХ ХХХХХХ \n Номер заявки - ХХХХХХХХХХХХ \n ФИО - Фамилия Имя Отчество'

export const validateFiltersFields = (
  values: applicationFiltersValues,
  onSubmit: (req: Omit<FindApplicationsRequest, 'vendorCode'>) => void,
  setErrors: (errors: FormikErrors<applicationFiltersValues>) => void,
) => {
  const applicationUpdateDate = DateTime.fromJSDate(new Date(values.applicationUpdateDate)).toISODate()
  const noSpacing = values.findApplication.replace(/ /g, '')

  //Если значение полностью числовое
  if (!isNaN(parseInt(noSpacing, 10))) {
    //И длина значения соответствует длине номера паспорта
    if (noSpacing.length === PASSPORT_NUMBER_LENGTH) {
      //Разбиваем число на серию номер и отправляем на бекенд с остальными введенными параметрами
      const passportSeries = noSpacing.substring(0, 4)
      const passportNumber = noSpacing.substring(3, 6)
      onSubmit({
        //FIXME: добавить findApplication и isMyApplication
        passportNumber,
        passportSeries,
        applicationUpdateDate,
      })
      //И длина значения соответствует длине номера заявки
    } else if (noSpacing.length === APPLICATION_NUMBER_LENGTH) {
      //отправляем на бекенд с остальными введенными параметрами
      onSubmit({
        //FIXME: добавить findApplication и isMyApplication
        applicationNumber: noSpacing,
        applicationUpdateDate,
      })
      //И длина значения не соответствует ни номеру паспорта ни номеру заявки
    } else {
      //Устанавливаем ошибку
      setErrors({ findApplication: standardError })
    }
    //Если значение не числовое
  } else {
    //Но в нем присутствуют цифры
    if (/[0-9]/.test(noSpacing)) {
      //Устанавливаем ошибку
      setErrors({ findApplication: standardError })
      //И в нем отсутствуют цифры
    } else {
      //отправляем на бекенд с остальными введенными параметрами
      onSubmit({
        //FIXME: добавить findApplication и isMyApplication
        applicationUpdateDate,
      })
    }
  }
}
