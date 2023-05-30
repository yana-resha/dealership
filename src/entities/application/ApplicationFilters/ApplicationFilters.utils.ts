import { FormikErrors } from 'formik'
import zipObject from 'lodash/zipObject'
import { DateTime } from 'luxon'

import { applicationFiltersValues, FindApplicationsReq } from './ApplicationFilters.types'

const PASSPORT_NUMBER_LENGTH = 10
const APPLICATION_NUMBER_LENGTH = 12
const FULL_NAME_LENGTH = 3
const standardError =
  'Формат ввода данных: \n Паспорт - ХХХХ ХХХХХХ \n Номер заявки - ХХХХХХХХХХХХ \n ФИО - Фамилия Имя Отчество'

export const validateFiltersFields = (
  values: applicationFiltersValues,
  onSubmit: (req: FindApplicationsReq) => void,
  setErrors: (errors: FormikErrors<applicationFiltersValues>) => void,
) => {
  const {
    findApplication,
    applicationUpdateDate: updateDate,
    isMyApplication: onlyUserApplicationsFlag,
  } = values
  const applicationUpdateDate = DateTime.fromJSDate(new Date(updateDate)).toISODate()
  const noSpacing = findApplication.replace(/ /g, '')

  //Если значение полностью числовое
  if (!isNaN(parseInt(noSpacing, 10))) {
    //И длина значения соответствует длине номера паспорта
    if (noSpacing.length === PASSPORT_NUMBER_LENGTH) {
      //Разбиваем число на серию номер и отправляем на бекенд с остальными введенными параметрами
      const passportSeries = noSpacing.substring(0, 4)
      const passportNumber = noSpacing.substring(3, 6)
      onSubmit({
        onlyUserApplicationsFlag,
        passportNumber,
        passportSeries,
        applicationUpdateDate,
      })
      //И длина значения соответствует длине номера заявки
    } else if (noSpacing.length === APPLICATION_NUMBER_LENGTH) {
      //отправляем на бекенд с остальными введенными параметрами
      onSubmit({
        onlyUserApplicationsFlag,
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
      const fullName = ['firstName', 'lastName', 'middleName']
      const fullValuesName = findApplication.split(' ')

      //И в значениях присутствуют имя фамилия и отчество
      if (fullValuesName.length >= FULL_NAME_LENGTH) {
        //по умолчанию считаем что первое слово - фамилия, второе - имя, а все что дальше отчество
        const values = [fullValuesName[0], fullValuesName[1], fullValuesName.slice(2).join(' ')]
        //отправляем на бекенд с остальными введенными параметрами
        onSubmit({
          onlyUserApplicationsFlag,
          applicationUpdateDate,
          ...zipObject(fullName, values),
        })
      } else {
        //Устанавливаем ошибку
        setErrors({ findApplication: standardError })
      }
    }
  }
}
