import styled from 'styled-components'

const StyledInput = styled.input`
  border-radius: 4px;
  border: 1px solid ${p => p.theme.darkPrimary};

  padding: 8px 12px;

  &:focus {
    outline: 1px solid ${p => p.theme.accent};
  }
`

export default function Input({
  onChange = () => {},
  ...props
}: React.CSSProperties &
  React.HTMLAttributes<HTMLInputElement> & {
    type?: React.HTMLInputTypeAttribute
    value?: string
    onChange?: (value: string) => void
  }) {
  return <StyledInput onChange={e => onChange(e.target.value)} {...props} style={props} />
}
