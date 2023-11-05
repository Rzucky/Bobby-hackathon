import styled from 'styled-components'

const StyledButton = styled.button`
  padding: 8px 12px;
  border-radius: 4px;

  font-size: 20px;

  background-color: ${p => p.theme.accent};
  color: ${p => p.theme.lightPrimary};

  border: 1px solid ${p => p.theme.darkPrimary};

  transition: all ease-in-out 50ms;

  &:active {
    transform: translate(4px, 4px);
    background-color: ${p => p.theme.darkAccent};
  }
`

export default StyledButton
