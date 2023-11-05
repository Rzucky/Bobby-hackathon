export const postLogin = (loginPayload: { email: string; password: string }) =>
  fetch('/login', {
    body: JSON.stringify(loginPayload),
    method: 'POST',
  }).then(res => res.json())
