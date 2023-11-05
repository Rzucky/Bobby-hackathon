import Flex from '../../components/Flex'
import Input from '../../components/Input'
import { Formik, useFormikContext } from 'formik'
import Button from '../../components/Button'
import { INITIAL_VALUES, registrationValidator } from './const'
import { Subtitle } from './styles'
import { postRegistration } from './api'
import { useNavigate } from 'react-router'

function Register() {
  const { values, setFieldValue, submitForm, errors } = useFormikContext<typeof INITIAL_VALUES>()

  return (
    <Flex textAlign="center" height="100%" justifyContent="center" flexDirection="column">
      <h1 style={{ fontSize: '38px' }}>Bobby</h1>
      <Subtitle>
        <i>Worlds first innovative and flexible parking space management platform</i>
      </Subtitle>

      <Flex justifyContent="center">
        <Flex alignItems="flex-end" flexDirection="column">
          <div>
            <label htmlFor="email">Email</label>
            <Input
              placeholder="john.doe@example.com"
              width="200px"
              margin="4px 16px"
              id="email"
              value={values.email}
              onChange={_email => setFieldValue('email', _email)}
            />
          </div>

          <div>
            <label htmlFor="name">Name</label>
            <Input
              placeholder="John doe"
              width="200px"
              margin="4px 16px"
              id="name"
              value={values.name}
              onChange={_name => setFieldValue('name', _name)}
            />
          </div>

          <div>
            <label htmlFor="license">License plate</label>
            <Input
              placeholder="ZG1234IH"
              width="200px"
              margin="4px 16px"
              id="license"
              value={values.license}
              onChange={_license => setFieldValue('license', _license)}
            />
          </div>

          <div>
            <label htmlFor="password">Confirm password</label>
            <Input
              type="password"
              width="200px"
              margin="4px 16px"
              id="password"
              value={values.password}
              onChange={_password => setFieldValue('password', _password)}
            />
          </div>

          <Flex>
            <Flex alignItems="center" justifyContent="center" flexDirection="column">
              <label htmlFor="passwordConfirmation" style={{ color: errors.passwordConfirmation ? '#f00' : undefined }}>
                Repeat password
              </label>
            </Flex>

            <Input
              type="password"
              width="200px"
              margin="4px 16px"
              id="passwordConfirmation"
              value={values.passwordConfirmation}
              onChange={_passwordConfirmation => setFieldValue('passwordConfirmation', _passwordConfirmation)}
            />
          </Flex>
        </Flex>
      </Flex>
      <Flex justifyContent="center" marginTop="16px">
        <Button onClick={submitForm}>Register</Button>
      </Flex>
    </Flex>
  )
}

function RegistrationWrapper() {
  const navigate = useNavigate()

  return (
    <Formik
      initialValues={INITIAL_VALUES}
      onSubmit={values => {
        postRegistration({ licencePlate: values.license, ...values })
          .then(() => navigate('/login'))
          .catch(() => alert('error'))
      }}
      validationSchema={registrationValidator}
    >
      <Register />
    </Formik>
  )
}

export default RegistrationWrapper
