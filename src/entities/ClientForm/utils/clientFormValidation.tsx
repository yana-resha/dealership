import * as Yup from 'yup'

const minAge = 21
const maxAge = 65

function clientNameIsCorrect(value: string | undefined) {
  if (value == undefined) {
    return false
  }
  const nameParts = value.trim().split(' ')
  if (nameParts.length == 3) {
    return true
  }

  return false
}

function clientNameIsCorrectOptional(value: string | undefined) {
  if (value == undefined || value == '') {
    return true
  }

  return clientNameIsCorrect(value)
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

export const clientFormValidationSchema = Yup.object().shape({
  clientName: Yup.string()
    .required('Поле обязательно для заполнения')
    .test('nameIsCorrect', 'Введите корректное ФИО', clientNameIsCorrect),
  clientFormerName: Yup.string().test(
    'nameIsCorrectOptional',
    'Введите корректное ФИО',
    clientNameIsCorrectOptional,
  ),
  numOfChildren: Yup.string()
    .required('Поле обязательно для заполнения')
    .max(20, 'Введено слишком большое значение'),
  familyStatus: Yup.string().required('Поле обязательно для заполнения'),
  passport: Yup.string().required('Поле обязательно для заполнения').min(10, 'Введите данные полностью'),
  birthDate: Yup.date()
    .required('Поле обязательно для заполнения')
    .min(getMinBirthDate(), 'Превышен максимальный возраст')
    .max(getMaxBirthDate(), `Минимальный возраст ${minAge} год`),
  birthPlace: Yup.string().required('Поле обязательно для заполнения'),
  passportDate: Yup.date()
    .required('Поле обязательно для заполнения')
    .min(getMinPassportDate(), 'Дата слишком ранняя'),
  divisionCode: Yup.string().required('Поле обязательно для заполнения').min(6, 'Введите данные полностью'),
  issuedBy: Yup.string().required('Поле обязательно для заполнения'),
  registrationAddress: Yup.string().required('Поле обязательно для заполнения'),
  livingAddress: Yup.string().when('regAddrIsLivingAddr', {
    is: 0,
    then: schema => schema.required('Поле обязательно для заполнения'),
  }),
  regDate: Yup.date()
    .required('Поле обязательно для заполнения')
    .min(getMinBirthDate(), 'Дата слишком ранняя'),
  phoneType: Yup.string().required('Поле обязательно для заполнения'),
  phoneNumber: Yup.string().required('Поле обязательно для заполнения').min(9, 'Введите номер полностью'),
  email: Yup.string().required('Поле обязательно для заполнения').email('Введите корретный Email'),
  averageIncome: Yup.string().required('Поле обязательно для заполнения').max(13, 'Значение слишком большое'),
  additionalIncome: Yup.string()
    .required('Поле обязательно для заполнения')
    .max(13, 'Значение слишком большое'),
  familyIncome: Yup.string().required('Поле обязательно для заполнения').max(13, 'Значение слишком большое'),
  expenses: Yup.string().required('Поле обязательно для заполнения').max(13, 'Значение слишком большое'),
  relatedToPublic: Yup.string().required('Поле обязательно для заполнения'),
  secondDocumentType: Yup.string().required('Поле обязательно для заполнения'),
  secondDocumentNumber: Yup.string().required('Поле обязательно для заполнения'),
  secondDocumentDate: Yup.date()
    .required('Поле обязательно для заполнения')
    .min(getMinBirthDate(), 'Дата слишком ранняя'),
  secondDocumentIssuedBy: Yup.string().required('Поле обязательно для заполнения'),
  occupation: Yup.string().required('Поле обязательно для заполнения'),
  employmentDate: Yup.date()
    .required('Поле обязательно для заполнения')
    .min(getMinBirthDate(), 'Дата слишком ранняя'),
  anketaSigned: Yup.number().min(1, 'Необходимо подписать анкету'),
})
