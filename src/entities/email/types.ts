import { Email } from '@sberauto/emailappdc-proto/public'

export type RequiredEmail = Omit<Email, 'emailId'> & Required<Pick<Email, 'emailId'>>
type EmailsMap = Record<string, RequiredEmail>
export type PreparedEmailData = {
  emails: RequiredEmail[]
  emailsMap: EmailsMap
}
