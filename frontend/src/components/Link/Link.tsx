import { useNavigate } from 'react-router'
import styled from 'styled-components'

const StyledLink = styled.a`
  color: ${p => p.theme.linkColor};
  text-decoration: underline;
`

export default function Link({ to, children }: React.PropsWithChildren<{ to: string }>) {
  const navigate = useNavigate()

  return (
    <StyledLink
      onClick={e => {
        e.preventDefault()
        navigate(to)
      }}
    >
      {children}
    </StyledLink>
  )
}
