import { Checkbox, Label, LabelText, ToggleComponent } from './styles'

const Toggle = ({ label, toggled, handleToggle }: { label: string; toggled?: boolean; handleToggle: () => void }) => {
  return (
    <Label>
      <Checkbox type="checkbox" defaultChecked={toggled} onClick={handleToggle} />
      <ToggleComponent />
      <LabelText>{label}</LabelText>
    </Label>
  )
}

export default Toggle
