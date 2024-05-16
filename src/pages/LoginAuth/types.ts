export enum FormFieldMap {
  LOGIN = 'login',
  PASSWORD = 'password',
  CODE = 'code',
  CONTROL_PASSWORD = 'controlPassword',
}

export interface RecoveryLoginFormFields {
  [FormFieldMap.LOGIN]: string
}

export interface LoginFormFields extends RecoveryLoginFormFields {
  [FormFieldMap.PASSWORD]: string
}

export interface PasswordFormFields {
  [FormFieldMap.CODE]: string
  [FormFieldMap.PASSWORD]: string
  [FormFieldMap.CONTROL_PASSWORD]: string
}
