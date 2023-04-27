import { GetTokenResponse, RefreshAuthByTokenResponse } from '@sberauto/authdc-proto/public'
import { GetStateAndNonceResponse } from '@sberauto/authsberteamid-proto/public'

export function mockStartAuthSessionResponse(): GetStateAndNonceResponse {
  return {
    state: 'test_state',
    nonce: 'test_nonce',
    clientId: 'frontDC',
    redirectUri: 'dc.ru/auth',
    scope: 'username+phone+lastname',
  }
}

export function mockGetTokenResponse(): GetTokenResponse {
  return {
    accessJwt: 'test_accessJwt',
    refreshToken: 'test_refreshToken',
  }
}

export function mockGetRefreshTokenResponse(): RefreshAuthByTokenResponse {
  return {
    accessJwt: 'test_accessJwt',
    refreshToken: 'test_refreshToken',
  }
}
