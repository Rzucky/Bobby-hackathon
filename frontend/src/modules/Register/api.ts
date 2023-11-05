import { User } from '../../model/User'

export const postRegistration = (user: Omit<User, 'id' | 'type'>) =>
  fetch('http://localhost:3000/register', {
    method: 'POST',
    body: JSON.stringify(user),
  })
