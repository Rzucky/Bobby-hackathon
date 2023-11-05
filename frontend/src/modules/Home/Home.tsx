import styled from 'styled-components'
import Flex from '../../components/Flex'
import NavigationDrawer from './NavigationDrawer'
import SpotDrawer from './SpotDrawer'
import { MapFiltersContextProvider, useMapFilterContext } from './context'
import Map from '../Map'
import { MapMarkerContextProvider, useMapMarkerContext } from '../Map/context'

const Container = styled(Flex)`
  background-color: ${p => p.theme.accent};
`

function Home() {
  const { selectedMarker } = useMapMarkerContext()
  const { electricCharging, handicapped } = useMapFilterContext()

  return (
    <Container height="100%" textAlign="center">
      <Map />
      {/* {electricCharging ? 'y' : 'n'}
      {handicapped ? 'y' : 'n'} */}

      {!!selectedMarker ? <SpotDrawer /> : <NavigationDrawer />}
    </Container>
  )
}

export default function HomeWrapper() {
  return (
    <MapMarkerContextProvider>
      <MapFiltersContextProvider>
        <Home />
      </MapFiltersContextProvider>
    </MapMarkerContextProvider>
  )
}
