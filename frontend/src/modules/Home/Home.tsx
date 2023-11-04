import styled from 'styled-components'
import Drawer from '../../components/Drawer'
import Flex from '../../components/Flex'
import Box from '../../components/Box'
import { TowTruckIcon, LocationIcon, MoreIcon } from '../../Icons'
import { useState } from 'react'
import { useNavigate } from 'react-router'

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
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const navigation = useNavigate()

  const handleTowTruck = () => {
    // TODO
  }

  const handleNearestParking = () => {
    // TODO
  }

  const handleDetails = () => {
    setIsDrawerOpen(_open => !_open)
  }

  const handleProfile = () => navigation('/profile')

  return (
    <Container height="100%" textAlign="center">
      <h1>ovdje ce doci map</h1>
      <Drawer initialHeight={100} isOpen={isDrawerOpen} setIsOpen={() => {}}>
        <Flex flexDirection="column" width="100%">
          <Flex width="100%" marginBottom="16px">
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
              <p>More</p>
            </Flex>
          </Flex>

          {/* extra details */}

          <Flex>
            <Flex flex={1} flexDirection="column" alignItems="center">
              <CircleButton width={48} height={48} marginBottom="4px" onClick={handleProfile}>
                <LocationIcon />
              </CircleButton>
              <p>Profile</p>
            </Flex>

            <Flex flex={1} flexDirection="column" alignItems="center">
              <CircleButton width={48} height={48} marginBottom="4px" onClick={handleNearestParking}>
                <LocationIcon />
              </CircleButton>
              <p>Filters</p>
            </Flex>

            <Flex flex={1} />
          </Flex>
        </Flex>
      </Drawer>
    </Container>
  )
}
