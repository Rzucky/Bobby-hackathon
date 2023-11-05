import { createContext, useContext, useEffect, useState } from 'react'
import { getParkingSpots } from './api'
import { Spot } from '../../model/Spot'
import { socket } from '../Socket/Socket'

interface IContext {
  selectedMarker?: Spot
  setSelectedMarker: React.Dispatch<Spot | undefined>
  spots?: Record<string, Spot>
  setSpots: React.Dispatch<Record<string, Spot> | undefined>
  reservation?: { h: number; m: number; spotId: string }
  setReservation: (obj: { h: number; m: number; spotId: string }) => void
}

const MapMarkerContext = createContext<IContext>(undefined!)

export const MapMarkerContextProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const [selectedMarker, setSelectedMarker] = useState<Spot>()
  const [spots, setSpots] = useState<Record<string, Spot>>()
  const [reservation, setReservation] = useState<{ h: number; m: number; spotId: string }>()

  useEffect(() => {
    getParkingSpots()
      .then(spots => {
        console.log('loaded', spots)
        setSpots(spots)
      })
      .catch(e => console.log(e))

    socket.on('ps', function (data: Spot) {
      setSpots(_spots => {
        if (!_spots) return

        _spots[data.id] = data

        return _spots
      })
    })

    return () => {
      socket.off()
    }
  }, [])

  return (
    <MapMarkerContext.Provider
      value={{ selectedMarker, setSelectedMarker, spots, setSpots, reservation, setReservation }}
    >
      {children}
    </MapMarkerContext.Provider>
  )
}

export const useMapMarkerContext = () => useContext(MapMarkerContext)
