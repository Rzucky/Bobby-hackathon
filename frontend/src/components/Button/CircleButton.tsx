import styled, { css } from 'styled-components'
import Box from '../Box'

export const CircleButton = styled(Box)<{ isActive?: boolean }>`
  border-radius: 50%;
  background-color: ${p => p.theme.lightPrimary};
  padding: 16px;

  transition: all ease 50ms;

  ${p =>
    p.isActive &&
    css`
      outline: 2px solid ${p.theme.accent};
    `}

  &:active {
    transform: translate(2px, 2px);

    background-color: ${p => `${p.theme.lightPrimary}aa`};
  }
`
