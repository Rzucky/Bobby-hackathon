import styled from 'styled-components'
import Box from '../Box'

export const CircleButton = styled(Box)`
  border-radius: 50%;
  background-color: ${p => p.theme.lightPrimary};
  padding: 16px;

  transition: all ease 50ms;

  &:active {
    transform: translate(2px, 2px);

    background-color: ${p => `${p.theme.lightPrimary}aa`};
  }
`
