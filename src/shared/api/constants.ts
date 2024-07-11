export enum Service {
  Authdc = 'authdc',
  Filestoragedc = 'filestoragedc',
  Authsberteamid = 'authsberteamid',
  Dadata = 'dadata',
  Dictionarydc = 'dictionarydc',
  Loanapplifecycledc = 'loanapplifecycledc',
  EMAILAPPDC = 'emailappdc',
}

export enum ServiceApi {
  CreateSession = 'createSession',
  TrainingCreateSession = 'trainingCreateSession',
  RemoveCatalog = 'removeCatalog',
  AuthorizeUser = 'authorizeUser',
  CheckCode = 'checkCode',
  CHECK_USER_BY_LOGIN = 'checkUserByLogin',
  CHANGE_PASSWORD = 'changePassword',
  GET_EMAILS = 'getEmails',
  SEND_EMAIL_DECISION = 'sendEmailDecision',
  CALCULATE_CREDIT = 'calculateCredit',
  GET_CREDIT_PRODUCT_LIST = 'getCreditProductList',
}
