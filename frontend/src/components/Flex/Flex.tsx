import React from 'react'
import styled from 'styled-components'

const StyledFlex = styled.div`
  display: flex;
`

function Flex({ children, ...styles }: React.PropsWithChildren<React.CSSProperties>) {
  return <StyledFlex style={styles}>{children}</StyledFlex>
}

export default Flex
