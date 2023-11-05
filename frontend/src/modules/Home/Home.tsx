import styled from 'styled-components'
import Flex from '../../components/Flex'
import NavigationDrawer from './NavigationDrawer'
import { useState } from 'react'
import SpotDrawer from './SpotDrawer'
import { MapFiltersContextProvider, useMapFilterContext } from './context'
import { Coords } from '../../model/Coords'
import { getUser } from '../App/Auth/auth'
import Map from '../Map'

const Container = styled(Flex)`
  background-color: ${p => p.theme.accent};
`

function Home() {
  const [selectedSpot, setSelectedSpot] = useState<Coords>()

  const token = getUser()

  const { electricCharging, handicapped } = useMapFilterContext()

  const handleReservation = (coords: Coords) => {
    if (!token) return

    setSelectedSpot(coords)
  }

  return (
    <Container height="100%" textAlign="center">
      <Map />
      {/* {electricCharging ? 'y' : 'n'}
      {handicapped ? 'y' : 'n'} */}

      {!!selectedSpot ? <SpotDrawer /> : <NavigationDrawer />}
    </Container>
  )
}

export default function HomeWrapper() {
  return (
    <MapFiltersContextProvider>
      <Home />
    </MapFiltersContextProvider>
  )
}
