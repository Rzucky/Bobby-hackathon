import { User } from '../../../model/User'

export const TOKEN_KEY = 'auth'
export const USER_KEY = 'user'

export const getToken = () => {
  const token = localStorage.getItem(TOKEN_KEY)

  if (token === null) return false

  return token
}

export const setToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token)
}

export const getUser = () => {
  const user = localStorage.getItem(USER_KEY)

  if (user === null) return false

  return JSON.parse(user) as User
}

export const setUser = (user: User) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}
