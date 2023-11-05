import { useCallback, useEffect, useMemo } from 'react'
import { useState } from 'react'
import { GoogleMap, useLoadScript, MarkerF, DirectionsRenderer, DirectionsService } from '@react-google-maps/api'
import { Libraries } from '@googlemaps/js-api-loader'
import { useMapMarkerContext } from './modules/Map/context'
const libraries: Libraries = ['places', 'marker', 'routes']

const MAPS_API_KEY = process.env.REACT_APP_MAPS_API_KEY

const mapContainerStyle = {
  width: '100vw',
  height: '100vh',
}
const mapCenter = {
  // lat: 7.2905715, // default latitude
  // lng: 80.6337262, // default longitude
  lat: 45.807886572584735,
  lng: 16.00218318614229,
}
function ParkingMap() {
  const { selectedMarker, setSelectedMarker, spots: markerList } = useMapMarkerContext()
  const mapZoom = 15

  // const [map, setMap] = useState<google.maps.Map>()
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [dirResult, setDirResult] = useState<google.maps.DirectionsResult | null>(null)

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: MAPS_API_KEY!,
    libraries: libraries,
  })

  const [directionsFormValue, setDirectionsFormValue] = useState({
    origin: { lat: 0, lng: -180 },
    dest: { lat: 0, lng: -180 },
  })

  const getCurrLocation = (cb_success: CallableFunction, cb_fail: CallableFunction) => {
    if (!navigator.geolocation) {
      cb_fail()
      return
    }
    navigator.geolocation.getCurrentPosition(pos => {
      const p: google.maps.LatLngLiteral = { lat: pos.coords.latitude, lng: pos.coords.longitude }
      cb_success(p)
    })
  }

  const getShortestDistance = (
    origin: google.maps.LatLngLiteral,
    markerList: google.maps.LatLngLiteral[],
    cb_success: CallableFunction,
    cb_fail: CallableFunction
  ) => {
    let service = new google.maps.DistanceMatrixService()
    service.getDistanceMatrix(
      {
        origins: [origin],
        destinations: markerList,
        region: 'hr',
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (...resp) => {
        console.log(`### DISTANCE MATRIX RESPONSE`)
        console.log(resp)

        let minIdx = -1,
          minDist = 9999999

        resp[0]?.rows[0].elements.forEach((elem, idx) => {
          if (elem.status === google.maps.DistanceMatrixElementStatus.OK && elem.distance.value <= minDist) {
            minDist = elem.distance.value
            minIdx = idx
          }
        })

        // 'NOT_FOUND','OK','ZERO_RESULTS'
        if (minIdx === -1) {
          console.log(`Unable to find a valid route`)
          cb_fail()
        }

        cb_success(minIdx, minDist)
      }
    )
  }

  const onLoad = useCallback(
    (mapInst: google.maps.Map) => {
      setMap(mapInst)

      const bounds: google.maps.LatLngBounds = new window.google.maps.LatLngBounds(mapCenter)
      // console.log(`Bounds: `, bounds)
      mapInst.fitBounds(bounds)

      const btn: HTMLButtonElement = document.createElement('button')
      btn.textContent = 'Get location'
      btn.classList.add('custom-map-control-button')
      btn.onclick = () => {
        const buildDistances = () => {
          if (!markerList) return

          getCurrLocation(
            (loc: google.maps.LatLngLiteral) => {
              const nearestByAir = Object.values(markerList)
                .map(({ latitude, longitude }) => ({ lat: +latitude, lng: +longitude }))
                .sort((a, b) => {
                  const x1 = loc.lat - a.lat
                  const y1 = loc.lng - a.lng
                  const distA = Math.sqrt(x1 * x1 + y1 * y1)

                  const x2 = loc.lat - b.lat
                  const y2 = loc.lng - b.lng
                  const distB = Math.sqrt(x2 * x2 + y2 * y2)

                  return distA - distB
                })
                .slice(0, 20)

              getShortestDistance(
                loc,
                Object.values(markerList)
                  .map(({ latitude, longitude }) => ({ lat: +latitude, lng: +longitude }))
                  .slice(0, 20),
                (minIdx: number, minDist: number) => {
                  setDirectionsFormValue({
                    origin: loc,
                    dest: nearestByAir[minIdx],
                  })
                },
                () => {}
              )
            },
            () => {}
          )
        }
        buildDistances()
      }
      mapInst.controls[google.maps.ControlPosition.TOP_CENTER].push(btn)
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [markerList, mapCenter]
  )

  const directionsCallback = useCallback(
    (result: google.maps.DirectionsResult | null, status: google.maps.DirectionsStatus) => {
      if (result !== null) {
        if (status === google.maps.DirectionsStatus.OK) {
          setDirResult(result)
        } else {
          console.log('dirResult: ', result)
        }
      }
    },
    []
  )

  useEffect(() => {
    if (!directionsFormValue || !markerList) return

    const approximateParkingSpot = Object.keys(markerList).find(id => {
      const spot = markerList[id]

      return (
        Math.abs(spot.latitude - directionsFormValue.dest.lat) < 10e-13 &&
        Math.abs(spot.longitude - directionsFormValue.dest.lng) < 10e-13
      )
    })

    if (!approximateParkingSpot) return

    setSelectedMarker(markerList[approximateParkingSpot])
  }, [directionsFormValue, markerList])

  // @ts-ignore
  const directionsServiceOptions = useMemo<google.maps.DirectionsRequest>(() => {
    return {
      origin: directionsFormValue.origin,
      destination: directionsFormValue.dest,
      travelMode: 'DRIVING',
      region: 'hr',
    }
  }, [directionsFormValue])

  const directionsResult = useMemo(() => {
    return {
      directions: dirResult,
      suppressMarkers: true,
    }
  }, [dirResult])

  if (loadError) {
    return <div> Error loading maps </div>
  }
  if (!isLoaded) {
    return <div> Loading maps... </div>
  }

  const mapOnClick = (e: google.maps.MapMouseEvent) => {
    console.log('## Map click: ', e)
    console.log(`${e.latLng?.lat()}, ${e.latLng?.lng()}`)

    setSelectedMarker(undefined)
  }

  const latLngEqual = (a?: google.maps.LatLngLiteral, b?: google.maps.LatLngLiteral): boolean => {
    if (!a || !b) return false
    return a.lat === b.lat && a.lng === b.lng
  }

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={mapZoom}
        center={
          selectedMarker
            ? {
                lat: +selectedMarker.latitude,
                lng: +selectedMarker.longitude,
              }
            : mapCenter
        }
        onLoad={onLoad}
        onClick={mapOnClick}
        onIdle={() => {
          let bounds = map?.getBounds()?.toJSON()
          console.log(`## Marker IDLE, bounds: `)
          console.log(bounds)
        }}
      >
        <MarkerF
          key={'origin'}
          position={directionsFormValue.origin}
          icon="pins/yellow_pin.png"
          onClick={e => {
            console.log(`## ORIGIN CLICKED: ${e}`)
          }}
        />
        {markerList &&
          Object.keys(markerList).map((id, idx) => {
            const mpos = {
              lat: +markerList[id].latitude,
              lng: +markerList[id].longitude,
            }
            return (
              <MarkerF
                key={`${mpos.lat}-${mpos.lng}-${idx}-${selectedMarker?.latitude}`}
                position={mpos}
                icon={
                  latLngEqual(
                    mpos,
                    selectedMarker
                      ? {
                          lat: +selectedMarker.latitude,
                          lng: +selectedMarker.longitude,
                        }
                      : undefined
                  )
                    ? 'pins/green_pin.png'
                    : 'pins/red_pin.png'
                }
                onClick={e => {
                  if (!e.latLng) return

                  setSelectedMarker(markerList[id])
                }}
              />
            )
          })}

        {!latLngEqual(directionsFormValue.origin, { lat: 0, lng: -180 }) &&
          !latLngEqual(directionsFormValue.dest, { lat: 0, lng: -180 }) && (
            //directionsFormValue.dest != {lat:0,lng:-180} &&
            //directionsFormValue.origin != {lat:0,lng:-180} && (
            <DirectionsService options={directionsServiceOptions} callback={directionsCallback} />
          )}

        {directionsResult.directions && <DirectionsRenderer options={directionsResult} />}
      </GoogleMap>
    </div>
  )
}

export default ParkingMap
