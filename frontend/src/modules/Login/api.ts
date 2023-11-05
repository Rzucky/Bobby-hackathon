import { API_URL } from '../../api/api'

export const postLogin = (loginPayload: { email: string; password: string }) =>
  fetch(`${API_URL}/login`, {
    body: JSON.stringify(loginPayload),
    method: 'POST',
  }).then(res => res.json())
