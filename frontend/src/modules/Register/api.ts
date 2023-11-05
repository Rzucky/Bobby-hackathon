import { API_URL } from '../../api/api'
import { User } from '../../model/User'

export const postRegistration = (user: Omit<User, 'id' | 'type'>) =>
  fetch(`${API_URL}/register`, {
    method: 'POST',
    body: JSON.stringify(user),
  })
