import * as yup from 'yup'

export const INITIAL_VALUES = {
  name: '',
  email: '',
  password: '',
  license: '',
  passwordConfirmation: '',
}

export const registrationValidator = yup.object({
  password: yup.string().required('Password is required'),
  passwordConfirmation: yup.string().oneOf([yup.ref('password'), ''], 'Passwords must match'),
})
