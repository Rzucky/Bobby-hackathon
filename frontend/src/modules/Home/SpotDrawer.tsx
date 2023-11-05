import styled from 'styled-components'
import Drawer from '../../components/Drawer'
import Box from '../../components/Box'
import Flex from '../../components/Flex'
import Button from '../../components/Button'
import Input from '../../components/Input'
import { useState } from 'react'
import { postReservation } from './api'
import { getUser } from '../App/Auth/auth'
import { useMapMarkerContext } from '../Map/context'

const Tag = styled(Box)`
  padding: 4px 12px;

  background-color: ${p => p.theme.darkAccent};
  border-radius: 16px;

  white-space: nowrap;
  font-size: 14px;
  font-weight: bold;
`

export default function SpotDrawer() {
  const { selectedMarker, setSelectedMarker, setReservation } = useMapMarkerContext()
  const now = new Date()

  const nowHours = `0${now.getHours()}`.slice(-2)
  const nowMInutes = `0${now.getMinutes()}`.slice(-2)

  const [hours, setHours] = useState(nowHours)
  const [minutes, setMinutes] = useState(nowMInutes)

  const handleHours = () => {
    if (+hours > 23 || +hours < 0) {
      setHours(nowHours)
      return
    }

    setHours(`0${hours}`.slice(-2))
  }

  const handleMinutes = () => {
    if (+minutes > 59 || +minutes < 0) {
      setMinutes(nowMInutes)
      return
    }

    setMinutes(`0${minutes}`.slice(-2))
  }

  const handleReserve = () => {
    if (!selectedMarker) return

    const user = getUser()

    if (!user) return

    postReservation({ userId: user.id, parkingSpotId: selectedMarker.id, endHr: +hours, endMin: +minutes })
      .then(res => {
        console.log('success', res)
        setSelectedMarker(undefined)
        setReservation({ h: +hours, m: +minutes, spotId: selectedMarker.id })
      })
      .catch(e => console.log('err', e))
  }

  return (
    <Drawer disabled initialHeight={300}>
      <Flex justifyContent="space-between" flexDirection="column" paddingBottom="16px">
        <Box>
          <Box marginBottom="16px">
            <h3>Information about selected parking spot</h3>

            <Flex marginTop="12px">
              <Flex flexWrap="wrap" justifyContent="space-around">
                <Tag marginRight="8px" marginBottom="4px">
                  Accessible
                </Tag>
                <Tag marginRight="8px" marginBottom="4px">
                  Difficult
                </Tag>
                <Tag marginRight="8px" marginBottom="4px">
                  Family friendly
                </Tag>
                <Tag marginRight="8px" marginBottom="4px">
                  Electric charging
                </Tag>
              </Flex>
            </Flex>
          </Box>

          <Box>
            <h3>Reserve until:</h3>

            <Flex justifyContent="center" marginTop="12px">
              <Input
                min={0}
                max={23}
                onBlur={handleHours}
                type="number"
                value={hours}
                onChange={setHours}
                fontSize="24px"
                width="40px"
              />
              <h1>:</h1>
              <Input
                min={0}
                max={59}
                onBlur={handleMinutes}
                type="number"
                value={minutes}
                onChange={setMinutes}
                fontSize="24px"
                width="40px"
              />
            </Flex>
          </Box>
        </Box>

        <Button onClick={handleReserve}>Reserve parking</Button>
      </Flex>
    </Drawer>
  )
}
