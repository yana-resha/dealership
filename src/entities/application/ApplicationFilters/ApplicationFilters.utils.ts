import { FormikErrors } from 'formik'
import zipObject from 'lodash/zipObject'
import { DateTime } from 'luxon'

import { FormApplicationFiltersValues, FindApplicationsReq } from './ApplicationFilters.types'

const PASSPORT_NUMBER_LENGTH = 10
const MIN_APPLICATION_NUMBER_LENGTH = 12

const standardError =
  'Формат ввода данных: \n Паспорт - ХХХХ ХХХХХХ \n Номер заявки - ХХХХХХХХХХХХ \n ФИО - Фамилия Имя Отчество'

export const validateFiltersFields = (
  values: {
    findApplication: string
    applicationUpdateDate: Date | null
    onlyUserApplications: {
      employeeId?: string
      onlyUserApplicationsFlag?: boolean
    }
  },
  onSubmit: (req: FindApplicationsReq) => void,
  setErrors: (errors: FormikErrors<FormApplicationFiltersValues>) => void,
) => {
  const { findApplication, applicationUpdateDate: updateDate, onlyUserApplications } = values
  const applicationUpdateDate = updateDate ? DateTime.fromJSDate(updateDate).toISODate() : undefined
  const noSpacing = findApplication.replace(/ /g, '')

  //Если значение полностью числовое
  if (!isNaN(parseInt(noSpacing, 10))) {
    //И длина значения соответствует длине номера паспорта
    if (noSpacing.length === PASSPORT_NUMBER_LENGTH) {
      //Разбиваем число на серию номер и отправляем на бекенд с остальными введенными параметрами
      const passportSeries = noSpacing.substring(0, 4)
      const passportNumber = noSpacing.substring(4, 10)
      onSubmit({
        ...onlyUserApplications,
        passportNumber,
        passportSeries,
        applicationUpdateDate,
      })
      //И длина значения соответствует длине номера заявки
    } else if (noSpacing.length >= MIN_APPLICATION_NUMBER_LENGTH) {
      //отправляем на бекенд с остальными введенными параметрами
      onSubmit({
        ...onlyUserApplications,
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
      const fullValuesName = findApplication.split(' ')

      //И в значениях присутствуют имя фамилия и отчество
      if (fullValuesName.length >= 3) {
        // [Фамилия Имя Отчество]
        const fullName = ['lastName', 'firstName', 'middleName']
        //по умолчанию считаем что первое слово - фамилия, второе - имя, а все что дальше отчество
        const values = [fullValuesName[0], fullValuesName[1], fullValuesName.slice(2).join(' ')]
        //отправляем на бекенд с остальными введенными параметрами
        onSubmit({
          ...onlyUserApplications,
          applicationUpdateDate,
          ...zipObject(fullName, values),
        })
      } else if (fullValuesName.length >= 2) {
        // [Фамилия Имя]
        const fullName = ['lastName', 'firstName']
        //по умолчанию считаем что первое слово - фамилия, второе - имя
        const values = [fullValuesName[0], fullValuesName[1]]
        //отправляем на бекенд с остальными введенными параметрами
        onSubmit({
          ...onlyUserApplications,
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
