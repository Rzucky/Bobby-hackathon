import { useState } from 'react'
import Flex from '../../components/Flex'
import Input from '../../components/Input'
import { Subtitle } from '../Register/styles'
import Button from '../../components/Button'
import Link from '../../components/Link'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = () => {
    // TODO: handle login
  }

  return (
    <Flex textAlign="center" height="100%" justifyContent="center" flexDirection="column">
      <h1 style={{ fontSize: '38px' }}>Bobby</h1>
      <Subtitle>
        <i>Worlds first innovative and flexible parking space management platform</i>
      </Subtitle>

      <Flex alignItems="flex-end" flexDirection="column">
        <div>
          <label htmlFor="email">Email</label>
          <Input width="200px" margin="4px 16px" id="email" value={email} onChange={setEmail} />
        </div>

        <div>
          <label htmlFor="password">Confirm password</label>
          <Input
            type="password"
            width="200px"
            margin="4px 16px"
            id="password"
            value={password}
            onChange={setPassword}
          />
        </div>
      </Flex>
      <Flex marginTop="16px" justifyContent="center" flexDirection="column">
        <div style={{ marginBottom: '12px' }}>
          <Button onClick={handleLogin}>Sign in</Button>
        </div>

        <p>
          New here? Register by <Link to="/register">clicking here</Link>
        </p>
      </Flex>
    </Flex>
  )
}
