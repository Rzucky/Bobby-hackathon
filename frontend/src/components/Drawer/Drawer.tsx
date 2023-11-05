import styled from 'styled-components'
import React, { useState } from 'react'
import Box from '../Box'
import Flex from '../Flex'

const StyledDrawer = styled(Box)`
  position: fixed;
  bottom: 0;
  width: 100%;

  color: ${p => p.theme.lightPrimary};
`

const DrawerHandle = styled.div`
  display: block;
  width: 100%;
  height: 32px;

  background-color: ${p => `${p.theme.darkSecondary}88`};
  backdrop-filter: blur(5px);
  border-radius: 16px 16px 0 0;

  &::after {
    content: '';
    position: relative;
    display: block;
    width: 48px;
    height: 4px;
    border-radius: 8px;
    background-color: ${p => p.theme.lightPrimary};
    opacity: 0.6;
    transform: translateX(-50%);
    left: 50%;
    top: 12px;
  }
`

const DrawerContent = styled(Flex)<{ isOpen?: boolean; drawerHeight: number; initialHeight: number }>`
  background-color: ${p => `${p.theme.darkSecondary}88`};
  backdrop-filter: blur(5px);
  height: ${p => (p.isOpen ? `${p.drawerHeight}px` : `${p.initialHeight}px`)};

  transition: height ease-in-out 500ms;
`

export default function Drawer({
  children,
  height = 400,
  initialHeight = 50,
  disabled,
  ...props
}: React.PropsWithChildren<{
  height?: number
  initialHeight?: number
  disabled?: boolean
  isOpen?: boolean
  setIsOpen?: (open: boolean) => void
}>) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleDrawer = () => {
    if (!!disabled) return

    if (typeof props.setIsOpen === 'undefined') {
      setIsOpen(_open => !_open)
      return
    }

    props.setIsOpen(!props.isOpen)
  }

  const _isOpen = typeof props.isOpen === 'undefined' ? isOpen : props.isOpen

  return (
    <StyledDrawer>
      <DrawerHandle onClick={toggleDrawer} />
      <DrawerContent isOpen={_isOpen} drawerHeight={height} initialHeight={initialHeight} padding="8px 16px">
        {children}
      </DrawerContent>
    </StyledDrawer>
  )
}
