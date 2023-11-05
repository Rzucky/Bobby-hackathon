import { createContext, useContext, useEffect, useState } from 'react'
import { getParkingSpots } from './api'
import { Spot } from '../../model/Spot'
import { socket } from '../Socket/Socket'

interface IContext {
  selectedMarker?: Spot
  setSelectedMarker: React.Dispatch<Spot | undefined>
  spots?: Record<string, Spot>
  setSpots: React.Dispatch<Record<string, Spot> | undefined>
}

const MapMarkerContext = createContext<IContext>(undefined!)

export const MapMarkerContextProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const [selectedMarker, setSelectedMarker] = useState<Spot>()
  const [spots, setSpots] = useState<Record<string, Spot>>()

  useEffect(() => {
    getParkingSpots()
      .then(spots => {
        console.log('loaded', spots)
        setSpots(spots)
      })
      .catch(e => alert(e))

    socket.on('ps', function (data: Spot) {
      console.log('OMG SOCKET SOCK MY BALLS', data)
    })

    return () => {
      socket.off()
    }
  }, [])

  return (
    <MapMarkerContext.Provider value={{ selectedMarker, setSelectedMarker, spots, setSpots }}>
      {children}
    </MapMarkerContext.Provider>
  )
}

export const useMapMarkerContext = () => useContext(MapMarkerContext)
