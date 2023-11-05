import { useNavigate } from 'react-router'
import { FilterIcon, LocationIcon, MoreIcon, ProfileIcon, TowTruckIcon } from '../../Icons'
import { CircleButton } from '../../components/Button'
import Drawer from '../../components/Drawer'
import Flex from '../../components/Flex'
import { useState } from 'react'
import Toggle from '../../components/Toggle'
import Divider from '../../components/Divider'
import { useMapFilterContext } from './context'

export default function NavigationDrawer() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  const { electricCharging, handicapped, setElectricCharging, setHandicapped } = useMapFilterContext()

  const handleTowTruck = () => {
    // TODO
  }

  const handleNearestParking = () => {
    // TODO
  }

  const handleFilters = () => {
    setShowFilters(_showFilters => !_showFilters)
  }

  const navigation = useNavigate()

  const handleDetails = () => {
    setIsDrawerOpen(_open => !_open)
    setShowFilters(false)
  }

  const handleProfile = () => navigation('/profile')

  return (
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
            <CircleButton isActive={isDrawerOpen} width={48} height={48} marginBottom="4px" onClick={handleDetails}>
              <MoreIcon />
            </CircleButton>
            <p>More</p>
          </Flex>
        </Flex>

        {/* extra details */}

        <Flex>
          <Flex flex={1} flexDirection="column" alignItems="center">
            <CircleButton width={48} height={48} marginBottom="4px" onClick={handleProfile}>
              <ProfileIcon />
            </CircleButton>
            <p>Profile</p>
          </Flex>

          <Flex flex={1} flexDirection="column" alignItems="center">
            <CircleButton isActive={showFilters} width={48} height={48} marginBottom="4px" onClick={handleFilters}>
              <FilterIcon />
            </CircleButton>
            <p>Filters</p>
          </Flex>

          <Flex flex={1} />
        </Flex>

        {showFilters && (
          <Flex padding="16px 12px" flexDirection="column">
            <Flex alignItems="center" marginBottom="12px">
              <Divider marginRight="12px" flex={1} />
              <p>Filters:</p>
              <Divider marginLeft="12px" flex={1} />
            </Flex>

            <Flex marginBottom="16px">
              <Toggle
                toggled={electricCharging}
                label="Electric charging"
                handleToggle={() => setElectricCharging(!electricCharging)}
              />
            </Flex>

            <Flex>
              <Toggle toggled={handicapped} label="Handicapped" handleToggle={() => setHandicapped(!handicapped)} />
            </Flex>
          </Flex>
        )}
      </Flex>
    </Drawer>
  )
}
