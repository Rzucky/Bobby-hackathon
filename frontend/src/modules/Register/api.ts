import { User } from '../../model/User'

export const postRegistration = (user: Omit<User, 'id' | 'type'>) =>
  fetch('/register', {
    method: 'POST',
    body: JSON.stringify(user),
  })
