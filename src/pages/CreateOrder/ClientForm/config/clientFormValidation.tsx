import { ApplicantDocsType, OccupationType, MaritalStatus } from '@sberauto/loanapplifecycledc-proto/public'
import { DateTime, Interval } from 'luxon'
import * as Yup from 'yup'
import { AnyObject, InternalOptions } from 'yup/lib/types'

import { FileInfo } from 'features/ApplicationFileLoader'
import { getMaxBirthDate, getMinBirthDate } from 'pages/CreateOrder/CreateOrder.utils'
import { MIN_AGE } from 'shared/config/client.config'
import { FieldMessages } from 'shared/constants/fieldMessages'
import { checkIsNumber } from 'shared/lib/helpers'

import { SubmitAction } from '../ClientForm.types'
import { checkInn } from '../utils/checkInn'
import { getCurrentWorkExperience } from '../utils/getCurrentWorkExperience'

export const JOB_DISABLED_OCCUPATIONS = [OccupationType.UNEMPLOYED, OccupationType.PENSIONER]
export const QUESTIONNAIRE_FILE_IS_REQUIRED = 'Необходимо загрузить анкету'
const DFO_ADDRESS_CODES = ['03', '14', '75', '41', '25', '27', '28', '49', '65', '79', '87']
const INDIVIDUAL_PERSONS = [
  OccupationType.PRIVATE_PRACTICE,
  OccupationType.INDIVIDUAL_ENTREPRENEUR,
  OccupationType.AGENT_ON_COMMISSION_CONTRACT,
  OccupationType.SELF_EMPLOYED,
]

const LEGAL_OR_INDIVIDUAL_PERSONS = [
  OccupationType.WORKING_ON_A_TEMPORARY_CONTRACT,
  OccupationType.WORKING_ON_A_PERMANENT_CONTRACT,
  OccupationType.CONTRACTOR_UNDER_CIVIL_LAW_CONTRACT,
]

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

function validateRegion(
  value: string | null | undefined,
  isDfoOnly: boolean | undefined,
  context: Yup.TestContext<AnyObject>,
) {
  if (!isDfoOnly) {
    return true
  }
  const isHasRegion = DFO_ADDRESS_CODES.some(code => code === value)

  return isHasRegion ? true : context.createError({ message: FieldMessages.WRONG_REGION })
}

function validateEmplyeeInn(value: string | undefined, context: Yup.TestContext<AnyObject>) {
  const occupation = (context.options as InternalOptions)?.from?.[0].value.occupation as number | null

  if (occupation === null || !value) {
    return true
  }

  if (INDIVIDUAL_PERSONS.includes(occupation) && value?.length !== 12) {
    return context.createError({
      message: 'Длина ИНН должна составлять 12 цифр',
    })
  }
  if (LEGAL_OR_INDIVIDUAL_PERSONS.includes(occupation) && value?.length !== 10 && value?.length !== 12) {
    return context.createError({
      message: 'Длина ИНН должна составлять 10 или 12 цифр',
    })
  }

  if (!checkInn(value)) {
    return context.createError({
      message: 'Некорректный ИНН',
    })
  }

  return true
}

function isIncomeProofUploadedCorrectly(value: string | undefined, context: Yup.TestContext<AnyObject>) {
  const { occupation, incomeConfirmation, ndfl2File, ndfl3File, bankStatementFile, submitAction } =
    (context.options as InternalOptions)?.from?.[0].value || {}

  if (
    !incomeConfirmation ||
    submitAction === SubmitAction.DRAFT ||
    submitAction === SubmitAction.FORM_QUESTIONNAIRE
  ) {
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

function validateEmploymentDate(value: Date | null | undefined, context: Yup.TestContext<AnyObject>) {
  const { applicationCreatedDate } =
    (context.options as InternalOptions)?.from?.[0].value.validationParams || {}
  if (value) {
    return getCurrentWorkExperience(value, applicationCreatedDate ?? new Date()) >= 1
  }

  return true
}

function isJobDisabled(
  occupation: number | null,
  additionalDisabledOccupations = [] as typeof JOB_DISABLED_OCCUPATIONS,
) {
  return (
    occupation !== null &&
    [...JOB_DISABLED_OCCUPATIONS, ...additionalDisabledOccupations].includes(occupation)
  )
}

function setRequiredIfNotDraft<T extends Yup.BaseSchema<any, AnyObject, any>>(schema: T, message?: string) {
  return schema.when(['submitAction'], {
    is: (submitAction: string) =>
      submitAction === SubmitAction.SAVE || submitAction === SubmitAction.FORM_QUESTIONNAIRE,
    then: schema => schema.required(message || FieldMessages.required),
  })
}

export const clientAddressValidationSchema = Yup.object().shape(
  {
    regCode: Yup.string()
      .nullable()
      .required(FieldMessages.required)
      .test('isWrongRegion', (value, context) => {
        const { isDfoOnly } = (context.options as InternalOptions)?.from?.[0].value.validationParams || {}

        return validateRegion(value, isDfoOnly, context)
      }),

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

    streetType: Yup.string().nullable().required(FieldMessages.required),
    house: Yup.string().required(FieldMessages.required),
  },
  [['settlement', 'city']],
)

export const clientFormValidationSchema = Yup.object().shape({
  clientLastName: Yup.string().required(FieldMessages.required),
  clientFirstName: Yup.string().required(FieldMessages.required),
  clientFormerLastName: Yup.string().when('hasNameChanged', {
    is: true,
    then: schema => setRequiredIfNotDraft(schema),
  }),
  clientFormerFirstName: Yup.string().when('hasNameChanged', {
    is: true,
    then: schema => setRequiredIfNotDraft(schema),
  }),
  clientFormerMiddleName: Yup.string().when('hasNameChanged', {
    is: true,
    then: schema => setRequiredIfNotDraft(schema),
  }),
  numOfChildren: setRequiredIfNotDraft(
    Yup.number()
      .nullable()
      .test('isLessThenMin', (value, context) => {
        const { minChildrenCount } =
          (context.options as InternalOptions)?.from?.[0].value.validationParams || {}

        return checkIsNumber(value) && minChildrenCount && value < minChildrenCount
          ? context.createError({
              message: `По данной госпрограмме минимальное количество детей ${minChildrenCount}`,
            })
          : true
      }),
  ),
  familyStatus: setRequiredIfNotDraft(Yup.number().nullable()),
  passport: Yup.string().required(FieldMessages.required).min(10, 'Введите данные полностью'),
  birthDate: Yup.date()
    .nullable()
    .required(FieldMessages.required)
    .min(getMinBirthDate(), 'Превышен максимальный возраст')
    .max(getMaxBirthDate(), `Минимальный возраст ${MIN_AGE} год`),
  birthPlace: setRequiredIfNotDraft(Yup.string()),
  passportDate: setRequiredIfNotDraft(Yup.date().nullable()).test(
    'isLessPassportDate',
    'Паспорт клиента не действителен',
    validatePassportDate,
  ),
  divisionCode: setRequiredIfNotDraft(Yup.string().nullable()).min(6, 'Введите данные полностью'),
  sex: setRequiredIfNotDraft(Yup.number().nullable()),
  issuedBy: setRequiredIfNotDraft(Yup.string().nullable()),
  registrationAddressString: setRequiredIfNotDraft(
    Yup.string().test('isWrongRegion', (value, context) => {
      const { regCode } = (context.options as InternalOptions)?.from?.[0].value.registrationAddress || {}
      const { isDfoProgram } = (context.options as InternalOptions)?.from?.[0].value.validationParams || {}

      return validateRegion(regCode, isDfoProgram, context)
    }),
  ),

  livingAddressString: Yup.string().when('regAddrIsLivingAddr', {
    is: false,
    then: schema => setRequiredIfNotDraft(schema),
  }),
  mobileNumber: Yup.string().required(FieldMessages.required).min(11, FieldMessages.enterFullData),
  additionalNumber: Yup.string()
    .test('additionalNumberIsDuplicate', 'Такой номер уже есть', (value: string | undefined, context) => {
      const { mobileNumber, employerPhone } = (context.options as InternalOptions)?.from?.[0].value || {}

      return !value || (value !== mobileNumber && value !== employerPhone)
    })
    .when('occupation', {
      is: (occupation: number | null) => isJobDisabled(occupation),
      then: schema => setRequiredIfNotDraft(schema).min(11, FieldMessages.enterFullData),
      otherwise: schema =>
        schema.test(
          'additionalNumber',
          FieldMessages.enterFullData,
          (value: string | undefined) => value === undefined || value.trim().length == 11,
        ),
    }),
  averageIncome: setRequiredIfNotDraft(Yup.string()).max(13, 'Значение слишком большое'),
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
      then: schema => setRequiredIfNotDraft(schema),
    }),
  relatedToPublic: setRequiredIfNotDraft(Yup.boolean()),
  secondDocumentType: setRequiredIfNotDraft(Yup.number().nullable()),
  secondDocumentNumber: setRequiredIfNotDraft(
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
        then: schema => schema.min(11, FieldMessages.enterFullData),
      })
      .when('secondDocumentType', {
        is: (secondDocumentType: number | null) => secondDocumentType === ApplicantDocsType.INN,
        then: schema =>
          schema
            .length(12, 'Длина ИНН физ.лица должна составлять 12 цифр')
            .test('isInnCorrect', (value, context) =>
              value && !checkInn(value)
                ? context.createError({
                    message: 'Некорректный ИНН',
                  })
                : true,
            ),
      }),
  ),
  secondDocumentDate: Yup.date()
    .nullable()
    .when('secondDocumentType', {
      is: (secondDocumentType: number | null) =>
        secondDocumentType !== ApplicantDocsType.INN &&
        secondDocumentType !== ApplicantDocsType.PENSIONCERTIFICATE,
      then: schema => setRequiredIfNotDraft(schema).min(getMinBirthDate(), 'Дата слишком ранняя'),
    }),
  secondDocumentIssuedBy: Yup.string()
    .nullable()
    .when('secondDocumentType', {
      is: (secondDocumentType: number | null) =>
        secondDocumentType !== ApplicantDocsType.INN &&
        secondDocumentType !== ApplicantDocsType.PENSIONCERTIFICATE,
      then: schema => setRequiredIfNotDraft(schema),
    }),
  secondDocumentIssuedCode: Yup.string()
    .nullable()
    .when('secondDocumentType', {
      is: (secondDocumentType: number | null) => secondDocumentType === ApplicantDocsType.DRIVERLICENSE,
      then: schema => setRequiredIfNotDraft(schema.min(3, FieldMessages.enterFullData)),
    }),
  occupation: setRequiredIfNotDraft(Yup.number().nullable()).when('isIncomeProofUploaderTouched', {
    is: (isIncomeProofUploaderTouched: boolean, submitAction: string) =>
      isIncomeProofUploaderTouched && (submitAction === SubmitAction.SAVE || !submitAction),
    then: schema => schema.test('isHasNotOccupation', '', value => !!value),
  }),
  employmentDate: Yup.date()
    .nullable()
    .when('occupation', {
      is: (occupation: number | null) => isJobDisabled(occupation),
      otherwise: schema =>
        setRequiredIfNotDraft(schema)
          .min(getMinBirthDate(), 'Дата слишком ранняя')
          .test('isMinWorkExperience', 'Стаж работы должен быть более одного месяца', validateEmploymentDate),
    }),
  employerName: Yup.string()
    .nullable()
    .test('isLongEmployerName', (value, context) =>
      value && value.length > 120
        ? context.createError({
            message: `Наименование организации составляет ${value.length} символов из допустимых 120. Необходимо сократить наименование`,
          })
        : true,
    )
    .when('occupation', {
      is: (occupation: number | null) => isJobDisabled(occupation, [OccupationType.SELF_EMPLOYED]),
      otherwise: schema => setRequiredIfNotDraft(schema),
    }),
  employerInn: Yup.string()
    .when('occupation', {
      is: (occupation: number | null) => isJobDisabled(occupation, [OccupationType.SELF_EMPLOYED]),
      otherwise: schema => setRequiredIfNotDraft(schema),
    })
    .test('wrongInn', '', validateEmplyeeInn),
  employerPhone: Yup.string()
    .test('additionalNumberIsDuplicate', 'Такой номер уже есть', (value: string | undefined, context) => {
      const { mobileNumber, additionalNumber } = (context.options as InternalOptions)?.from?.[0].value || {}

      return !value || (value !== mobileNumber && value !== additionalNumber)
    })
    .when('occupation', {
      is: (occupation: number | null) => isJobDisabled(occupation, [OccupationType.SELF_EMPLOYED]),
      otherwise: schema => setRequiredIfNotDraft(schema).min(11, FieldMessages.enterFullData),
    }),
  employerAddressString: Yup.string().when('occupation', {
    is: (occupation: number | null) => isJobDisabled(occupation, [OccupationType.SELF_EMPLOYED]),
    otherwise: schema => setRequiredIfNotDraft(schema),
  }),

  questionnaireFile: Yup.object()
    .nullable()
    .test('badUpload', 'Ошибка при выгрузке файла', questionnaireFile =>
      fileUploadStatusNotError(questionnaireFile as unknown as FileInfo | null),
    )
    .when(['submitAction', 'isDifferentVendor'], {
      is: (submitAction: string, isDifferentVendor: boolean) =>
        submitAction === SubmitAction.SAVE || isDifferentVendor,
      then: schema => schema.required(QUESTIONNAIRE_FILE_IS_REQUIRED),
    }),
})

export const enrichedClientFormValidationSchema = clientFormValidationSchema.concat(
  Yup.object().shape({
    email: setRequiredIfNotDraft(Yup.string()).email('Введите корректный Email'),
  }),
)
