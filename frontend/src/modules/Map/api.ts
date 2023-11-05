import { API_URL } from '../../api/api'
import { Spot } from '../../model/Spot'
import { getToken } from '../App/Auth/auth'

export const getParkingSpots = () => {
  return fetch(`${API_URL}/parkingSpots`, {
    headers: {
      'Content-Type': 'application/json',
      authorization: getToken() || '',
    },
  }).then(res => {
    if (res.status > 299) {
      return res.json().then(r => Promise.reject(r.message as string))
    }

    return res.json().then(r => Promise.resolve(r as Record<string, Spot>))
  })
}
