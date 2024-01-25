import Cookies from 'js-cookie'

export const AUTH_COOKIE = 'authCookie'

export const setAuthCookie = () => Cookies.set(AUTH_COOKIE, 'true')
export const removeAuthCookie = () => Cookies.remove(AUTH_COOKIE)
export const checkIsAuth = () => !!Cookies.get(AUTH_COOKIE)
