import Icon from '../assets/more.png'

export default function More({
  width = '100%',
  height = '100%',
}: {
  width?: React.CSSProperties['width']
  height?: React.CSSProperties['height']
}) {
  return <img src={Icon} alt="Icon" width={width} height={height} />
}
