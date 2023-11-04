import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Register from '../Register'
import NotFound from './components/NotFound'
import { ThemeProvider } from 'styled-components'
import { CustomTheme, THEME } from '../../styles'
import { Wrapper } from './styles'
import Login from '../Login'
import Home from '../Home/Home'

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
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Home />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </Wrapper>
    </ThemeProvider>
  )
}

export default App
