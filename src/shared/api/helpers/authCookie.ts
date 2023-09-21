import Cookies from 'js-cookie'

export const AUTH_COOKIE = 'authCookie'
export const MAX_SESSION_AGE = 15 * 60 * 60

export const setAuthCookie = () => Cookies.set(AUTH_COOKIE, 'true', { maxAge: `${MAX_SESSION_AGE}` })
export const removeAuthCookie = () => Cookies.remove(AUTH_COOKIE)
export const checkIsAuth = () => !!Cookies.get(AUTH_COOKIE)
