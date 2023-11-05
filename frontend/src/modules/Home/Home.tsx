import styled from 'styled-components'
import Flex from '../../components/Flex'
import NavigationDrawer from './NavigationDrawer'
import { useState } from 'react'
import SpotDrawer from './SpotDrawer'
import { MapFiltersContextProvider, useMapFilterContext } from './context'

const Container = styled(Flex)`
  background-color: ${p => p.theme.accent};
`

function Home() {
  const [selectedSpot, setSelectedSport] = useState(false)

  const { electricCharging, handicapped } = useMapFilterContext()

  return (
    <Container height="100%" textAlign="center">
      <h1>ovdje ce doci map</h1>
      {electricCharging ? 'y' : 'n'}
      {handicapped ? 'y' : 'n'}

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
