import Flex from '../../components/Flex'
import DefaultProfile from '../../assets/user.png'
import Drawer from '../../components/Drawer'
import { BackIcon } from '../../Icons'
import { CircleButton } from '../../components/Button'
import { useNavigate } from 'react-router'
import Divider from '../../components/Divider'
import { Container, ImageWrapper, MainContent, UserTitle } from './style'
import { getUser } from '../App/Auth/auth'

export default function Profile() {
  const navigate = useNavigate()

  const user = getUser() || {
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

        {/* <Flex flexDirection="column" marginBottom="156px">
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
        </Flex> */}
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
