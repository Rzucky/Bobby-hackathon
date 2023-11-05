import styled from 'styled-components'
import Flex from '../../components/Flex'
import Box from '../../components/Box'

export const Container = styled(Flex)`
  background-color: ${p => p.theme.lightPrimary};
  height: 100%;
`

export const ImageWrapper = styled(Box)`
  background-color: #fff;
  border-radius: 50%;
  padding: 16px;

  width: 64px;
  height: 64px;

  filter: drop-shadow(0 0 0.75rem #bbbbbb88);
`

export const MainContent = styled(Flex)`
  background-color: ${p => p.theme.darkPrimary};
`

export const UserTitle = styled.h1`
  color: ${p => p.theme.lightPrimary};
`
