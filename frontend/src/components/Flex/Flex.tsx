import React from 'react'
import styled from 'styled-components'

const StyledFlex = styled.div`
  display: flex;
`

function Flex({
  children,
  className,
  ...styles
}: React.PropsWithChildren<React.CSSProperties & { className?: string }>) {
  return (
    <StyledFlex className={className} style={styles}>
      {children}
    </StyledFlex>
  )
}

export default Flex
