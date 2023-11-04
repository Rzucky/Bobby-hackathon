import styled from 'styled-components'

const StyledButton = styled.button`
  padding: 8px 12px;
  border-radius: 4px;

  background-color: ${p => p.theme.accent};
  color: ${p => p.theme.lightPrimary};

  border: 1px solid ${p => p.theme.darkPrimary};
`

export default StyledButton
