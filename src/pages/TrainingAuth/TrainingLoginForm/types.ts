export enum FormFieldMap {
  login = 'login',
  password = 'password',
}

export interface LoginFormFields {
  [FormFieldMap.login]: string
  [FormFieldMap.password]: string
}
