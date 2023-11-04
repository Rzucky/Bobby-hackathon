import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Register from '../Register'
import NotFound from './components/NotFound'
import { ThemeProvider } from 'styled-components'
import { CustomTheme, THEME } from '../../styles'
import { Wrapper } from './styles'

declare module 'styled-components' {
  export interface DefaultTheme extends CustomTheme {}
}

function App() {
  return (
    <ThemeProvider theme={THEME}>
      <Wrapper>
        <BrowserRouter>
          <Routes>
            <Route path="/register" element={<Register />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </Wrapper>
    </ThemeProvider>
  )
}

export default App
