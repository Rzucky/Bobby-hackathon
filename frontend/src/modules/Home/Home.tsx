import styled from 'styled-components'
import Drawer from '../../components/Drawer'
import Flex from '../../components/Flex'
import Box from '../../components/Box'
import { TowTruckIcon, LocationIcon, MoreIcon } from '../../Icons'

const Container = styled(Flex)`
  background-color: ${p => p.theme.accent};
`

const CircleButton = styled(Box)`
  border-radius: 50%;
  background-color: ${p => p.theme.lightPrimary};
  padding: 16px;

  transition: all ease 50ms;

  &:active {
    transform: translate(2px, 2px);

    background-color: ${p => `${p.theme.lightPrimary}aa`};
  }
`

export default function Home() {
  const handleTowTruck = () => {
    // TODO
  }

  const handleNearestParking = () => {
    // TODO
  }

  const handleDetails = () => {
    // TODO
  }

  return (
    <Container height="100%" textAlign="center">
      <h1>ovdje ce doci map</h1>
      <Drawer initialHeight={100}>
        <Flex width="100%">
          <Flex flex={1} flexDirection="column" alignItems="center">
            <CircleButton width={48} height={48} marginBottom="4px" onClick={handleTowTruck}>
              <TowTruckIcon />
            </CircleButton>
            <p>Call tow truck</p>
          </Flex>

          <Flex flex={1} flexDirection="column" alignItems="center">
            <CircleButton width={48} height={48} marginBottom="4px" onClick={handleNearestParking}>
              <LocationIcon />
            </CircleButton>
            <p>Nearest parking</p>
          </Flex>

          <Flex flex={1} flexDirection="column" alignItems="center">
            <CircleButton width={48} height={48} marginBottom="4px" onClick={handleDetails}>
              <MoreIcon />
            </CircleButton>
            <p>Details</p>
          </Flex>
        </Flex>
      </Drawer>
    </Container>
  )
}
