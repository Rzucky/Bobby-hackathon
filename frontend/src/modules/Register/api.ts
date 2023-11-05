import { API_URL } from '../../api/api'
import { User } from '../../model/User'

interface RegistrationResponse {
  user: User
  message: string
}

export const postRegistration = (user: Omit<User, 'id' | 'type'>): Promise<RegistrationResponse> =>
  fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    body: JSON.stringify(user),
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(res => res.json())
