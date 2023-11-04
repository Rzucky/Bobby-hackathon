import Flex from '../../components/Flex'
import DefaultProfile from '../../assets/user.png'
import styled from 'styled-components'
import Box from '../../components/Box'
import { User } from '../../model/User'
import Drawer from '../../components/Drawer'
import { BackIcon } from '../../Icons'
import { CircleButton } from '../../components/Button'
import { useNavigate } from 'react-router'

const Container = styled(Flex)`
  background-color: ${p => p.theme.lightPrimary};
  height: 100%;
`

const ImageWrapper = styled(Box)`
  background-color: #fff;
  border-radius: 50%;
  padding: 16px;

  width: 64px;
  height: 64px;

  filter: drop-shadow(0 0 0.75rem #bbbbbb88);
`

const MainContent = styled(Flex)`
  background-color: ${p => p.theme.darkPrimary};
`

const UserTitle = styled.h1`
  color: ${p => p.theme.lightPrimary};
`

const Divider = styled(Box)`
  border-bottom: 1px solid ${p => p.theme.accent};
`

export default function Profile() {
  const navigate = useNavigate()

  const user: User = {
    email: 'johndoe@gmail.com',
    name: 'John doe',
    id: 123,
    licencePlate: 'ZG1234AH',
    type: 1,
    password: 'asd',
  }

  return (
    <Container flexDirection="column" overflowY="scroll" overflowX="hidden">
      <MainContent flexDirection="column" justifyContent="center" width="100%" alignItems="center" padding="32px 12px">
        <ImageWrapper marginBottom="16px">
          <img width="100%" height="100%" src={DefaultProfile} alt="Users profile avatar" />
        </ImageWrapper>
        <UserTitle>{user.name}</UserTitle>
      </MainContent>

      <Flex padding="16px 12px 0" flexDirection="column">
        <Flex alignItems="center">
          <Divider flex={1} />
          <h2>User details</h2>
          <Divider flex={1} />
        </Flex>

        <Flex padding="16px 12px" flexDirection="column">
          <Flex justifyContent="space-between" alignItems="center">
            <p>Email:</p>
            <p>{user.email}</p>
          </Flex>
        </Flex>

        <Flex padding="16px 12px" flexDirection="column">
          <Flex justifyContent="space-between" alignItems="center">
            <p>License plate:</p>
            <p>{user.licencePlate}</p>
          </Flex>
        </Flex>

        <Flex alignItems="center">
          <Divider flex={1} />
          <h2>History</h2>
          <Divider flex={1} />
        </Flex>

        <Flex flexDirection="column" marginBottom="156px">
          <p>Lorem ipsum dolor sit.</p>
          <p>Lorem ipsum dolor sit.</p>
          <p>Lorem ipsum dolor sit.</p>
          <p>Lorem ipsum dolor sit.</p>
          <p>Lorem ipsum dolor sit.</p>
          <p>Lorem ipsum dolor sit.</p>
          <p>Lorem ipsum dolor sit.</p>
          <p>Lorem ipsum dolor sit.</p>
          <p>Lorem ipsum dolor sit.</p>
          <p>Lorem ipsum dolor sit.</p>
          <p>Lorem ipsum dolor sit.</p>
          <p>Lorem ipsum dolor sit.</p>
          <p>Lorem ipsum dolor sit.</p>
          <p>Lorem ipsum dolor sit.</p>
          <p>Lorem ipsum dolor sit.</p>
          <p>Lorem ipsum dolor sit.</p>
          <p>Lorem ipsum dolor sit.</p>
          <p>Lorem ipsum dolor sit.</p>
          <p>Lorem ipsum dolor sit.</p>
          <p>Lorem ipsum dolor sit.</p>
          <p>Lorem ipsum dolor sit.</p>
          <p>Lorem ipsum dolor sit.</p>
          <p>Lorem ipsum dolor sit.</p>
          <p>Lorem ipsum dolor sit.</p>
          <p>Lorem ipsum dolor sit.</p>
          <p>Lorem ipsum dolor sit.</p>
          <p>Lorem ipsum dolor sit.</p>
          <p>Lorem ipsum dolor sit.</p>
          <p>Lorem ipsum dolor sit.</p>
          <p>Lorem ipsum dolor sit.</p>
          <p>Lorem ipsum dolor sit.</p>
          <p>Lorem ipsum dolor sit.</p>
          <p>Lorem ipsum dolor sit.</p>
          <p>Lorem ipsum dolor sit.</p>
          <p>Lorem ipsum dolor sit.</p>
          <p>Lorem ipsum dolor sit.</p>
          <p>Lorem ipsum dolor sit.</p>
          <p>Lorem ipsum dolor sit.</p>
          <p>Lorem ipsum dolor sit.</p>
          <p>Lorem ipsum dolor sit.</p>
          <p>Lorem ipsum dolor sit.</p>
          <p>Lorem ipsum dolor sit.</p>
        </Flex>
      </Flex>

      <Drawer initialHeight={100} disabled>
        <Flex flexDirection="column" width="100%">
          <Flex width="100%" marginBottom="16px">
            <Flex flex={1} flexDirection="column" alignItems="center">
              <CircleButton width={48} height={48} marginBottom="4px" onClick={() => navigate('/')}>
                <BackIcon />
              </CircleButton>
              <p>Back</p>
            </Flex>
          </Flex>
        </Flex>
      </Drawer>
    </Container>
  )
}
