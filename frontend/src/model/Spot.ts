export enum SpotType {
  Regular = 'Regular',
  Handicapped = 'Handicapped',
  ECharging = 'ECharging',
  Family = 'Family',
}

export interface Spot {
  difficult: boolean
  id: string
  latitude: number
  longitude: number
  occupied: boolean
  occupiedTimestamp: string
  parkingSpotZone: string
  type: SpotType
}
