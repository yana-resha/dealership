import * as Yup from 'yup'

import {
  clientNameIsCorrect,
  clientNameIsCorrectOptional,
  getMaxBirthDate,
  getMinBirthDate,
  MIN_AGE,
} from 'shared/utils/clientFormValidation'

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
    .nullable()
    .required('Поле обязательно для заполнения')
    .min(getMinBirthDate(), 'Превышен максимальный возраст')
    .max(getMaxBirthDate(), `Минимальный возраст ${MIN_AGE} год`),
  birthPlace: Yup.string().required('Поле обязательно для заполнения'),
  passportDate: Yup.date()
    .nullable()
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
    .nullable()
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
    .nullable()
    .required('Поле обязательно для заполнения')
    .min(getMinBirthDate(), 'Дата слишком ранняя'),
  secondDocumentIssuedBy: Yup.string().required('Поле обязательно для заполнения'),
  occupation: Yup.string().required('Поле обязательно для заполнения'),
  employmentDate: Yup.date()
    .nullable()
    .required('Поле обязательно для заполнения')
    .min(getMinBirthDate(), 'Дата слишком ранняя'),
  // anketaSigned: Yup.number().min(1, 'Необходимо подписать анкету'),
})
