import * as Yup from 'yup'

import { Occupation } from 'shared/api/requests/loanAppLifeCycleDc.mock'

const minAge = 21
const maxAge = 65

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
  maxBirthDay.setFullYear(maxBirthDay.getFullYear() - minAge)

  return maxBirthDay
}

function getMinBirthDate() {
  const minBirthDay = new Date()
  minBirthDay.setFullYear(minBirthDay.getFullYear() - maxAge)

  return minBirthDay
}

function getMinPassportDate() {
  const minPassportDate = getMinBirthDate()
  minPassportDate.setFullYear(minPassportDate.getFullYear() + 14)

  return minPassportDate
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

export const clientAddressValidationSchema = Yup.object().shape(
  {
    region: Yup.string().required('Поле обязательно для заполнения'),
    settlement: Yup.string().when('city', {
      is: undefined,
      then: schema => schema.required('Необходимо указать город или населенный пункт'),
    }),
    city: Yup.string().when('settlement', {
      is: undefined,
      then: schema => schema.required('Необходимо указать город или населенный пункт'),
    }),

    cityType: Yup.string().when('city', {
      is: (city?: string) => city,
      then: schema => schema.required('Необходимо указать тип города'),
    }),
    settlementType: Yup.string().when('settlement', {
      is: (settlement?: string) => settlement,
      then: schema => schema.required('Необходимо указать тип населенного пункта'),
    }),
    areaType: Yup.string().when('area', {
      is: (area?: string) => area,
      then: schema => schema.required('Необходимо указать тип района'),
    }),

    streetType: Yup.string().required('Поле обязательно для заполнения'),
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
      schema
        .required('Поле обязательно для заполнения')
        .test('nameIsCorrect', 'Введите корректное ФИО', clientNameIsCorrect),
  }),
  numOfChildren: Yup.string()
    .required('Поле обязательно для заполнения')
    .max(20, 'Введено слишком большое значение'),
  familyStatus: Yup.number().required('Поле обязательно для заполнения'),
  passport: Yup.string().required('Поле обязательно для заполнения').min(10, 'Введите данные полностью'),
  birthDate: Yup.date()
    .nullable()
    .required('Поле обязательно для заполнения')
    .min(getMinBirthDate(), 'Превышен максимальный возраст')
    .max(getMaxBirthDate(), `Минимальный возраст ${minAge} год`),
  birthPlace: Yup.string().required('Поле обязательно для заполнения'),
  passportDate: Yup.date()
    .nullable()
    .required('Поле обязательно для заполнения')
    .min(getMinPassportDate(), 'Дата слишком ранняя'),
  divisionCode: Yup.string().required('Поле обязательно для заполнения').min(6, 'Введите данные полностью'),
  issuedBy: Yup.string().required('Поле обязательно для заполнения'),
  registrationAddressString: Yup.string().required('Поле обязательно для заполнения'),
  livingAddressString: Yup.string().when('regAddrIsLivingAddr', {
    is: false,
    then: schema => schema.required('Поле обязательно для заполнения'),
  }),
  mobileNumber: Yup.string().required('Поле обязательно для заполнения').min(11, 'Введите номер полностью'),
  additionalNumber: Yup.string().when('occupation', {
    is: Occupation.WithoutWork,
    then: schema => schema.required('Поле обязательно для заполнения').min(11, 'Введите номер полностью'),
    otherwise: schema =>
      schema.test(
        'additionalNumber',
        'Введите номер полностью',
        (value: string | undefined) => value === undefined || value.trim().length == 11,
      ),
  }),
  email: Yup.string().required('Поле обязательно для заполнения').email('Введите корректный Email'),
  averageIncome: Yup.string().required('Поле обязательно для заполнения').max(13, 'Значение слишком большое'),
  additionalIncome: Yup.string()
    .required('Поле обязательно для заполнения')
    .max(13, 'Значение слишком большое'),
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
  familyIncome: Yup.string().required('Поле обязательно для заполнения').max(13, 'Значение слишком большое'),
  expenses: Yup.string().required('Поле обязательно для заполнения').max(13, 'Значение слишком большое'),
  relatedToPublic: Yup.number().required('Поле обязательно для заполнения'),
  secondDocumentType: Yup.number().required('Поле обязательно для заполнения'),
  secondDocumentNumber: Yup.string().required('Поле обязательно для заполнения'),
  secondDocumentDate: Yup.date()
    .nullable()
    .required('Поле обязательно для заполнения')
    .min(getMinBirthDate(), 'Дата слишком ранняя'),
  secondDocumentIssuedBy: Yup.string().required('Поле обязательно для заполнения'),
  occupation: Yup.number().required('Поле обязательно для заполнения'),
  employmentDate: Yup.date()
    .nullable()
    .when('occupation', {
      is: Occupation.WithoutWork,
      otherwise: schema =>
        schema.required('Поле обязательно для заполнения').min(getMinBirthDate(), 'Дата слишком ранняя'),
    }),
  employerName: Yup.string().when('occupation', {
    is: Occupation.WithoutWork,
    otherwise: schema => schema.required('Поле обязательно для заполнения'),
  }),
  employerPhone: Yup.string().when('occupation', {
    is: Occupation.WithoutWork,
    otherwise: schema =>
      schema.required('Поле обязательно для заполнения').min(11, 'Введите номер полностью'),
  }),
  employerAddressString: Yup.string().when('occupation', {
    is: Occupation.WithoutWork,
    otherwise: schema => schema.required('Поле обязательно для заполнения'),
  }),
  employerInn: Yup.string().when('occupation', {
    is: Occupation.WithoutWork,
    otherwise: schema => schema.required('Поле обязательно для заполнения'),
  }),
  questionnaireFile: Yup.string().nullable().required('Необходимо загрузить анкету'),
})
