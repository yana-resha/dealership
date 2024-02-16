import { GetUserResponse } from '@sberauto/authdc-proto/public'

export enum Role {
  FrontdcCreditExpert = 'frontdc_credit_expert',
  FrontdcContentManager = 'frontdc_content_manager',
}

export interface PreparedUser extends Omit<GetUserResponse, 'roles'> {
  roles: Record<string, boolean>
}
