import { OccupationType } from '@sberauto/loanapplifecycledc-proto/public'
import { DateTime, Interval } from 'luxon'
import * as Yup from 'yup'
import { AnyObject, InternalOptions } from 'yup/lib/types'

import { SubmitAction } from '../ClientForm.types'

const MIN_AGE = 21
const MAX_AGE = 65

export const JOB_DISABLED_OCCUPATIONS = [OccupationType.UNEMPLOYED, OccupationType.PENSIONER]

function clientNameIsCorrect(value: string | undefined) {
  if (value == undefined) {
    return false
  }
  const nameParts = value.trim().split(' ')
  // ФИО может быть без отчества
  if (nameParts.length >= 2 && nameParts.length <= 3) {
    return true
  }

  return false
}

function getMaxBirthDate() {
  const maxBirthDay = new Date()
  maxBirthDay.setFullYear(maxBirthDay.getFullYear() - MIN_AGE)

  return maxBirthDay
}

function getMinBirthDate() {
  const minBirthDay = new Date()
  minBirthDay.setFullYear(minBirthDay.getFullYear() - MAX_AGE)

  return minBirthDay
}

function validatePassportDate(value: Date | null | undefined, context: Yup.TestContext<AnyObject>) {
  const birthDate = (context.options as InternalOptions)?.from?.[0].value.birthDate as Date | null
  if (!birthDate || !value) {
    return true
  }
  const age = Interval.fromDateTimes(DateTime.fromJSDate(birthDate), DateTime.now()).toDuration('years').years
  const delta = age >= 45 ? 45 : age >= 20 ? 20 : 14

  const formalPassportDate = DateTime.fromObject({
    year: birthDate.getFullYear(),
    month: birthDate.getMonth() + 1,
    day: birthDate.getDate(),
  }).plus({ years: delta })

  const passportDate = DateTime.fromObject({
    year: value.getFullYear(),
    month: value.getMonth() + 1,
    day: value.getDate(),
  })

  return passportDate.diff(formalPassportDate, ['days']).days >= 0
}

function isIncomeProofUploadedCorrectly(
  ndfl2File: File | null,
  ndfl3File: File | null,
  bankStatementFile: File | null,
) {
  if (ndfl2File !== null) {
    if (ndfl3File !== null || bankStatementFile !== null) {
      return false
    }
  }

  return true
}

function isIncomeProofUploaded(
  incomeConfirmation: boolean,
  ndfl2File: File | null,
  ndfl3File: File | null,
  bankStatementFile: File | null,
) {
  if (incomeConfirmation) {
    return ndfl2File !== null || ndfl3File !== null || bankStatementFile !== null
  }

  return true
}

function isJobDisabled(occupation: number | null) {
  return occupation !== null && JOB_DISABLED_OCCUPATIONS.includes(occupation)
}

function setRequiredIfSave<T extends Yup.BaseSchema<any, AnyObject, any>>(schema: T, message?: string) {
  return schema.when(['submitAction'], {
    is: (submitAction: string) => submitAction === SubmitAction.Save,
    then: schema => schema.required(message || 'Поле обязательно для заполнения'),
  })
}

export const clientAddressValidationSchema = Yup.object().shape(
  {
    regCode: Yup.string().nullable().required('Поле обязательно для заполнения'),
    settlement: Yup.string().when('city', {
      is: undefined,
      then: schema => schema.required('Необходимо указать город или населенный пункт'),
    }),
    city: Yup.string().when('settlement', {
      is: undefined,
      then: schema => schema.required('Необходимо указать город или населенный пункт'),
    }),

    cityType: Yup.string()
      .nullable()
      .when('city', {
        is: (city?: string) => city,
        then: schema => schema.required('Необходимо указать тип города'),
      }),
    settlementType: Yup.string()
      .nullable()
      .when('settlement', {
        is: (settlement?: string) => settlement,
        then: schema => schema.required('Необходимо указать тип населенного пункта'),
      }),
    areaType: Yup.string()
      .nullable()
      .when('area', {
        is: (area?: string) => area,
        then: schema => schema.required('Необходимо указать тип района'),
      }),

    streetType: Yup.string().nullable().required('Поле обязательно для заполнения'),
    house: Yup.string().required('Поле обязательно для заполнения'),
  },
  [['settlement', 'city']],
)

export const clientFormValidationSchema = Yup.object().shape({
  clientName: Yup.string()
    .required('Поле обязательно для заполнения')
    .test('nameIsCorrect', 'Введите корректное ФИО', clientNameIsCorrect),
  clientFormerName: Yup.string().when('hasNameChanged', {
    is: true,
    then: schema =>
      setRequiredIfSave(schema).test('nameIsCorrect', 'Введите корректное ФИО', clientNameIsCorrect),
  }),
  numOfChildren: setRequiredIfSave(Yup.number()).max(20, 'Введено слишком большое значение'),
  familyStatus: setRequiredIfSave(Yup.number().nullable()),
  passport: Yup.string().required('Поле обязательно для заполнения').min(10, 'Введите данные полностью'),
  birthDate: Yup.date()
    .nullable()
    .required('Поле обязательно для заполнения')
    .min(getMinBirthDate(), 'Превышен максимальный возраст')
    .max(getMaxBirthDate(), `Минимальный возраст ${MIN_AGE} год`),
  birthPlace: setRequiredIfSave(Yup.string()),
  passportDate: setRequiredIfSave(Yup.date().nullable()).test(
    'isLessPassportDate',
    'Паспорт клиента не действителен',
    validatePassportDate,
  ),
  divisionCode: setRequiredIfSave(Yup.string().nullable()).min(6, 'Введите данные полностью'),
  sex: setRequiredIfSave(Yup.number().nullable()),
  issuedBy: setRequiredIfSave(Yup.string().nullable()),
  registrationAddressString: setRequiredIfSave(Yup.string()),
  livingAddressString: Yup.string().when('regAddrIsLivingAddr', {
    is: false,
    then: schema => setRequiredIfSave(schema),
  }),
  mobileNumber: Yup.string().required('Поле обязательно для заполнения').min(11, 'Введите номер полностью'),
  additionalNumber: Yup.string().when('occupation', {
    is: (occupation: number | null) => isJobDisabled(occupation),
    then: schema => setRequiredIfSave(schema).min(11, 'Введите номер полностью'),
    otherwise: schema =>
      schema.test(
        'additionalNumber',
        'Введите номер полностью',
        (value: string | undefined) => value === undefined || value.trim().length == 11,
      ),
  }),
  email: setRequiredIfSave(Yup.string()).email('Введите корректный Email'),
  averageIncome: setRequiredIfSave(Yup.string()).max(13, 'Значение слишком большое'),
  additionalIncome: setRequiredIfSave(Yup.string()).max(13, 'Значение слишком большое'),
  incomeProofUploadValidator: Yup.string()
    .when(['incomeConfirmation', 'ndfl2File', 'ndfl3File', 'bankStatementFile'], {
      is: isIncomeProofUploaded,
      otherwise: schema =>
        schema.test('badUpload', 'Необходимо загрузить подтверждающие документы', () => false),
    })
    .when(['ndfl2File', 'ndfl3File', 'bankStatementFile'], {
      is: isIncomeProofUploadedCorrectly,
      otherwise: schema =>
        schema.test('badUpload', '2НДФЛ не может быть загружен вместе с другими документами', () => false),
    }),
  familyIncome: setRequiredIfSave(Yup.string()).max(13, 'Значение слишком большое'),
  expenses: setRequiredIfSave(Yup.string()).max(13, 'Значение слишком большое'),
  relatedToPublic: setRequiredIfSave(Yup.number().nullable()),
  secondDocumentType: setRequiredIfSave(Yup.number().nullable()),
  secondDocumentNumber: setRequiredIfSave(Yup.string()),
  secondDocumentDate: setRequiredIfSave(Yup.date().nullable()).min(getMinBirthDate(), 'Дата слишком ранняя'),
  secondDocumentIssuedBy: setRequiredIfSave(Yup.string()),
  occupation: setRequiredIfSave(Yup.number().nullable()),
  employmentDate: Yup.date()
    .nullable()
    .when('occupation', {
      is: (occupation: number | null) => isJobDisabled(occupation),
      otherwise: schema => setRequiredIfSave(schema).min(getMinBirthDate(), 'Дата слишком ранняя'),
    }),
  employerName: Yup.string()
    .nullable()
    .when('occupation', {
      is: (occupation: number | null) => isJobDisabled(occupation),
      otherwise: schema => setRequiredIfSave(schema),
    }),
  employerPhone: Yup.string().when('occupation', {
    is: (occupation: number | null) => isJobDisabled(occupation),
    otherwise: schema => setRequiredIfSave(schema).min(11, 'Введите номер полностью'),
  }),
  employerAddressString: Yup.string().when('occupation', {
    is: (occupation: number | null) => isJobDisabled(occupation),
    otherwise: schema => setRequiredIfSave(schema),
  }),
  employerInn: Yup.string().when('occupation', {
    is: (occupation: number | null) => isJobDisabled(occupation),
    otherwise: schema => setRequiredIfSave(schema),
  }),
  questionnaireFile: setRequiredIfSave(Yup.string().nullable(), 'Необходимо загрузить анкету'),
})
