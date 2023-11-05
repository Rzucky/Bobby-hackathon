import { createContext, useContext, useState } from 'react'

const MapFiltersContext = createContext<{
  electricCharging: boolean
  setElectricCharging: React.Dispatch<boolean>
  handicapped: boolean
  setHandicapped: React.Dispatch<boolean>
}>(undefined!)

export const useMapFilterContext = () => useContext(MapFiltersContext)

export const MapFiltersContextProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const [electricCharging, setElectricCharging] = useState(false)
  const [handicapped, setHandicapped] = useState(false)

  return (
    <MapFiltersContext.Provider
      value={{
        electricCharging,
        setElectricCharging,
        handicapped,
        setHandicapped,
      }}
    >
      {children}
    </MapFiltersContext.Provider>
  )
}
