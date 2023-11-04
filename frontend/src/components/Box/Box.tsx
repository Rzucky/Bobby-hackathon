import React from 'react'
import styled from 'styled-components'

const StyledBox = styled.div``

function Flex({
  children,
  className,
  onClick,
  ...styles
}: React.PropsWithChildren<
  React.CSSProperties & { className?: string; onClick?: (e: React.MouseEvent<HTMLDivElement>) => void }
>) {
  return (
    <StyledBox className={className} style={styles} onClick={onClick}>
      {children}
    </StyledBox>
  )
}

export default Flex
