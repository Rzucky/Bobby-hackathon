import { API_URL } from '../../api/api'
import { getToken } from '../App/Auth/auth'

export const postReservation = (data: { userId: number; parkingSpotId: string; endHr: number; endMin: number }) =>
  fetch(`${API_URL}/reservations`, {
    body: JSON.stringify(data),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      authorization: getToken() || '',
    },
  }).then(res => {
    if (res.status > 299) {
      return res.json().then(r => Promise.reject(r.message as string))
    }

    return res.json().then(r => Promise.resolve(r))
  })
