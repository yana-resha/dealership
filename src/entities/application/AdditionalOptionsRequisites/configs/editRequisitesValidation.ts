import * as Yup from 'yup'

const MANDATORY_FIELD_MESSAGE = 'Поле обязательно для заполнения'
const FIELD_NOT_COMPLETED = 'Введите значение полностью'

const dealerServiceValidationSchema = Yup.object().shape({
  productType: Yup.string().required(MANDATORY_FIELD_MESSAGE),
  provider: Yup.string().required(MANDATORY_FIELD_MESSAGE),
  broker: Yup.string().required(MANDATORY_FIELD_MESSAGE),
  loanTerm: Yup.number().required(MANDATORY_FIELD_MESSAGE),
  productCost: Yup.number().required(MANDATORY_FIELD_MESSAGE),
  beneficiaryBank: Yup.string().required(MANDATORY_FIELD_MESSAGE),
  bankAccountNumber: Yup.string().required(MANDATORY_FIELD_MESSAGE).min(20, FIELD_NOT_COMPLETED),
  bankIdentificationCode: Yup.string().required(MANDATORY_FIELD_MESSAGE).min(9, FIELD_NOT_COMPLETED),
  correspondentAccount: Yup.string().required(MANDATORY_FIELD_MESSAGE).min(20, FIELD_NOT_COMPLETED),
  taxation: Yup.string().required(MANDATORY_FIELD_MESSAGE),
})

const additionalEquipmentValidationSchema = Yup.object().shape({
  productType: Yup.string().required(MANDATORY_FIELD_MESSAGE),
  productCost: Yup.string().required(MANDATORY_FIELD_MESSAGE),
  broker: Yup.string().required(MANDATORY_FIELD_MESSAGE),
  beneficiaryBank: Yup.string().required(MANDATORY_FIELD_MESSAGE),
  bankAccountNumber: Yup.string().required(MANDATORY_FIELD_MESSAGE).min(20, FIELD_NOT_COMPLETED),
  bankIdentificationCode: Yup.string().required(MANDATORY_FIELD_MESSAGE).min(9, FIELD_NOT_COMPLETED),
  correspondentAccount: Yup.string().required(MANDATORY_FIELD_MESSAGE).min(20, FIELD_NOT_COMPLETED),
  taxation: Yup.string().required(MANDATORY_FIELD_MESSAGE),
})

export const editRequisitesValidationSchema = Yup.object().shape({
  legalPersonCode: Yup.string().required(MANDATORY_FIELD_MESSAGE),
  loanAmount: Yup.string().required(MANDATORY_FIELD_MESSAGE),
  bankIdentificationCode: Yup.string().required(MANDATORY_FIELD_MESSAGE).min(9, FIELD_NOT_COMPLETED),
  beneficiaryBank: Yup.string().required(MANDATORY_FIELD_MESSAGE),
  bankAccountNumber: Yup.string().required(MANDATORY_FIELD_MESSAGE).min(20, FIELD_NOT_COMPLETED),
  correspondentAccount: Yup.string().required(MANDATORY_FIELD_MESSAGE).min(20, FIELD_NOT_COMPLETED),
  taxation: Yup.string().required(MANDATORY_FIELD_MESSAGE),
  dealerAdditionalServices: Yup.array().of(dealerServiceValidationSchema),
  additionalEquipments: Yup.array().of(additionalEquipmentValidationSchema),
})
