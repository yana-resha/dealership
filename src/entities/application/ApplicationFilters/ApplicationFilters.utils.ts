import { FormikErrors } from 'formik'
import zipObject from 'lodash/zipObject'
import { DateTime } from 'luxon'

import { FormApplicationFiltersValues, FindApplicationsReq } from './ApplicationFilters.types'

const PASSPORT_NUMBER_LENGTH = 10
const MIN_APPLICATION_NUMBER_LENGTH = 12

const standardError = 'Формат ввода данных: \n Паспорт - ХХХХХХХХХХ \n Номер заявки - ХХХХХХХХХХХХ'

export const validateFiltersFields = (
  values: {
    findApplication: string
    lastName: string
    firstName: string
    middleName: string
    applicationUpdateDate: Date | null
    onlyUserApplications: {
      employeeId?: string
      onlyUserApplicationsFlag?: boolean
    }
  },
  onSubmit: (req: FindApplicationsReq) => void,
  setErrors: (errors: FormikErrors<FormApplicationFiltersValues>) => void,
) => {
  const {
    findApplication,
    applicationUpdateDate: updateDate,
    onlyUserApplications,
    lastName,
    firstName,
    middleName,
  } = values
  const applicationUpdateDate = updateDate ? DateTime.fromJSDate(updateDate).toISODate() : undefined
  const noSpacing = findApplication.replace(/ /g, '')

  console.log('values', values)

  if (lastName !== '' && firstName !== '') {
    onSubmit({
      ...onlyUserApplications,
      lastName,
      firstName,
      middleName,
      applicationUpdateDate,
    })
  } else {
    //Если длина значения соответствует длине номера паспорта
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
  }
}
