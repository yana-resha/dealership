import { ApplicantDocsType, OccupationType, MaritalStatus } from '@sberauto/loanapplifecycledc-proto/public'
import { DateTime, Interval } from 'luxon'
import * as Yup from 'yup'
import { AnyObject, InternalOptions } from 'yup/lib/types'

import { FileInfo } from 'features/ApplicationFileLoader'
import {
  clientNameIsCorrect,
  getMaxBirthDate,
  getMinBirthDate,
} from 'pages/CreateOrderPage/CreateOrderPage.utils'
import { MIN_AGE } from 'shared/config/client.config'

import { SubmitAction } from '../ClientForm.types'

export const JOB_DISABLED_OCCUPATIONS = [OccupationType.UNEMPLOYED, OccupationType.PENSIONER]

function validatePassportDate(value: Date | null | undefined, context: Yup.TestContext<AnyObject>) {
  const birthDate = (context.options as InternalOptions)?.from?.[0].value.birthDate as Date | null
  if (!birthDate || !value) {
    return true
  }
  const age = Interval.fromDateTimes(
    DateTime.fromJSDate(birthDate),
    DateTime.now().minus({ months: 3 }),
  ).toDuration('years').years
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

function isIncomeProofUploadedCorrectly(value: string | undefined, context: Yup.TestContext<AnyObject>) {
  const { occupation, incomeConfirmation, ndfl2File, ndfl3File, bankStatementFile, submitAction } =
    (context.options as InternalOptions)?.from?.[0].value || {}

  if (!incomeConfirmation || submitAction === SubmitAction.Draft) {
    return true
  }

  const uploadingErrorFile = [ndfl2File, ndfl3File, bankStatementFile].find(
    file => file && file.status === 'error',
  )
  if (uploadingErrorFile) {
    return context.createError({
      message: `Ошибка загрузки файла ${uploadingErrorFile.name}`,
    })
  }

  switch (occupation) {
    case OccupationType.INDIVIDUAL_ENTREPRENEUR:
      if (!ndfl3File) {
        return context.createError({
          message: 'Необходимо загрузить подтверждающие документы (3НДФЛ обязателен)',
        })
      }
      break
    case OccupationType.WORKING_ON_A_TEMPORARY_CONTRACT:
    case OccupationType.WORKING_ON_A_PERMANENT_CONTRACT:
    case OccupationType.AGENT_ON_COMMISSION_CONTRACT:
    case OccupationType.CONTRACTOR_UNDER_CIVIL_LAW_CONTRACT:
      if (!ndfl2File) {
        return context.createError({
          message: 'Необходимо загрузить подтверждающие документы (2НДФЛ обязателен)',
        })
      }
      break
    case OccupationType.PRIVATE_PRACTICE:
    case OccupationType.PENSIONER:
    case OccupationType.UNEMPLOYED:
    case OccupationType.SELF_EMPLOYED:
      if (!ndfl2File && !bankStatementFile) {
        return context.createError({
          message: 'Необходимо загрузить подтверждающие документы - 2НДФЛ или Прочие документы',
        })
      }
      break
  }

  return true
}

function fileUploadStatusNotError(file: FileInfo | null | undefined) {
  if (file) {
    return file.status !== 'error'
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
  additionalNumber: Yup.string()
    .test('additionalNumberIsDuplicate', 'Такой номер уже есть', (value: string | undefined, context) => {
      const { mobileNumber, employerPhone } = (context.options as InternalOptions)?.from?.[0].value || {}

      return !value || (value !== mobileNumber && value !== employerPhone)
    })
    .when('occupation', {
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
  additionalIncome: Yup.string().max(13, 'Значение слишком большое'),
  incomeProofUploadValidator: Yup.string().test(
    'isIncomeProofUploadedCorrectly',
    'submitAction',
    isIncomeProofUploadedCorrectly,
  ),
  familyIncome: Yup.string()
    .max(13, 'Значение слишком большое')
    .when(['familyStatus'], {
      is: (familyStatus: number) =>
        familyStatus === MaritalStatus.MARRIED || familyStatus === MaritalStatus.CIVILMARRIAGE,
      then: schema => setRequiredIfSave(schema),
    }),
  expenses: setRequiredIfSave(Yup.string()).max(13, 'Значение слишком большое'),
  relatedToPublic: setRequiredIfSave(Yup.number().nullable()),
  secondDocumentType: setRequiredIfSave(Yup.number().nullable()),
  secondDocumentNumber: setRequiredIfSave(
    Yup.string()
      .when('secondDocumentType', {
        is: (secondDocumentType: number | null) =>
          secondDocumentType === ApplicantDocsType.INTERNATIONALPASSPORTFORRFCITIZENS,
        then: schema => schema.min(9, 'Введите серию и номер полностью'),
      })
      .when('secondDocumentType', {
        is: (secondDocumentType: number | null) => secondDocumentType === ApplicantDocsType.DRIVERLICENSE,
        then: schema => schema.min(10, 'Введите серию и номер полностью'),
      })
      .when('secondDocumentType', {
        is: (secondDocumentType: number | null) =>
          secondDocumentType === ApplicantDocsType.PENSIONCERTIFICATE,
        then: schema => schema.min(11, 'Введите номер полностью'),
      })
      .when('secondDocumentType', {
        is: (secondDocumentType: number | null) => secondDocumentType === ApplicantDocsType.INN,
        then: schema => schema.min(12, 'Введите номер полностью'),
      }),
  ),
  secondDocumentDate: Yup.date()
    .nullable()
    .when('secondDocumentType', {
      is: (secondDocumentType: number | null) =>
        secondDocumentType !== ApplicantDocsType.INN &&
        secondDocumentType !== ApplicantDocsType.PENSIONCERTIFICATE,
      then: schema => setRequiredIfSave(schema).min(getMinBirthDate(), 'Дата слишком ранняя'),
    }),
  secondDocumentIssuedBy: Yup.string()
    .nullable()
    .when('secondDocumentType', {
      is: (secondDocumentType: number | null) =>
        secondDocumentType !== ApplicantDocsType.INN &&
        secondDocumentType !== ApplicantDocsType.PENSIONCERTIFICATE,
      then: schema => setRequiredIfSave(schema),
    }),
  secondDocumentIssuedCode: Yup.string()
    .nullable()
    .when('secondDocumentType', {
      is: (secondDocumentType: number | null) => secondDocumentType === ApplicantDocsType.DRIVERLICENSE,
      then: schema => setRequiredIfSave(schema.min(4, 'Введите код полностью')),
    }),
  occupation: setRequiredIfSave(Yup.number().nullable()).when('isIncomeProofUploaderTouched', {
    is: (isIncomeProofUploaderTouched: boolean, submitAction: string) =>
      isIncomeProofUploaderTouched && (submitAction === SubmitAction.Save || !submitAction),
    then: schema => schema.test('isHasNotOccupation', '', value => !!value),
  }),
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
  employerPhone: Yup.string()
    .test('additionalNumberIsDuplicate', 'Такой номер уже есть', (value: string | undefined, context) => {
      const { mobileNumber, additionalNumber } = (context.options as InternalOptions)?.from?.[0].value || {}

      return !value || (value !== mobileNumber && value !== additionalNumber)
    })
    .when('occupation', {
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
  questionnaireFile: Yup.object()
    .nullable()
    .test('badUpload', 'Ошибка при выгрузке файла', questionnaireFile =>
      fileUploadStatusNotError(questionnaireFile as unknown as FileInfo | null),
    )
    .when(['submitAction', 'isSameVendor'], {
      is: (submitAction: string, isSameVendor: boolean) =>
        submitAction === SubmitAction.Save || !isSameVendor,
      then: schema => schema.required('Необходимо загрузить анкету'),
    }),
})
