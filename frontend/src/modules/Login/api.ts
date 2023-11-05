import { API_URL } from '../../api/api'
import { User } from '../../model/User'

export const postLogin = (loginPayload: { email: string; password: string }) =>
  fetch(`${API_URL}/auth/login`, {
    body: JSON.stringify(loginPayload),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(res => {
    if (res.status > 299) {
      return res.json().then(r => Promise.reject(r.message as string))
    }

    return res.json().then(r =>
      Promise.resolve({
        user: r.user as User,
        token: r.token as string,
      })
    )
  })
