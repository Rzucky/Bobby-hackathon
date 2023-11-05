import React, { ReactNode, useCallback } from 'react'
import { useState } from 'react'
import { GoogleMap, useLoadScript, MarkerF } from '@react-google-maps/api'
import { Libraries } from '@googlemaps/js-api-loader'
const libraries: Libraries = ['places', 'marker', 'routes']

function ParkingMap() {
  const MAPS_API_KEY = process.env.REACT_APP_MAPS_API_KEY ?? ''

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
  const mapZoom = 15

  // const [map, setMap] = useState<google.maps.Map>()
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [listOfMarkers, setListOfMarkers] = useState<google.maps.LatLngLiteral[]>([
    /*{
			lat: mapCenter.lat + ofst,
			lng: mapCenter.lng,
		},
		{
			lat: mapCenter.lat,
			lng: mapCenter.lng - ofst,
		},
		{
			lat: mapCenter.lat - ofst,
			lng: mapCenter.lng,
		},
		{
			lat: mapCenter.lat,
			lng: mapCenter.lng + ofst,
		},*/
    {
      lat: 45.80254,
      lng: 15.96631,
    },
    {
      lat: 45.8031,
      lng: 15.9688,
    },
    {
      lat: 45.8042,
      lng: 15.966,
    },
    {
      lat: 45.80305,
      lng: 15.96888,
    },
  ])
  const [dists, setDists] = useState<google.maps.LatLngLiteral[] | null>(null)

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: MAPS_API_KEY,
    libraries: libraries,
  })

  const getCurrLocation = (cb: CallableFunction) => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(pos => {
      const p: google.maps.LatLngLiteral = { lat: pos.coords.latitude, lng: pos.coords.longitude }
      cb(p)
    })
  }

  const getShortestDistance = (
    origin: google.maps.LatLngLiteral,
    markerList: google.maps.LatLngLiteral[],
    cb: CallableFunction
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
        //	console.log("COUNT:: ", resp[0]?.rows[0].elements.length)
        resp[0]?.rows[0].elements.forEach((elem, idx) => {
          if (elem.status === google.maps.DistanceMatrixElementStatus.OK && elem.distance.value <= minDist) {
            minDist = elem.distance.value
            minIdx = idx
          }
        })
        /**
				 * The origin and/or destination of this pairing could not be geocoded.
				 *
				NOT_FOUND = 'NOT_FOUND',
				/**
				 * The response contains a valid result.
				 *
				OK = 'OK',
				/**
				 * No route could be found between the origin and destination.
				 *
				ZERO_RESULTS = 'ZERO_RESULTS',
				*/
        if (minIdx === -1) {
          // sheisse
          console.log(`Unable to find a valid route`)
          //return
        }

        cb(minIdx, minDist)
      }
    )
  }

  const onLoad = useCallback((mapInst: google.maps.Map) => {
    setMap(mapInst)

    const bounds = new window.google.maps.LatLngBounds(mapCenter)
    console.log(`bounds  >>>  `, bounds)
    mapInst.fitBounds(bounds)

    const btn = document.createElement('button')
    btn.textContent = 'Get location'
    btn.classList.add('custom-map-control-button')
    btn.onclick = () => {
      /*if (! navigator.geolocation)
				return;
			navigator.geolocation.getCurrentPosition((pos) => {
				const p = {lat: pos.coords.latitude, lng: pos.coords.longitude}
				mapInst.setCenter(p)
			})*/

      const origg = {
        lat: 45.80528,
        lng: 15.96649,
      }

      const buildDistances = () => {
        getCurrLocation((loc: google.maps.LatLngLiteral) => {
          getShortestDistance(loc, listOfMarkers, (minIdx: number, minDist: number) => {
            // orig
            // markerList[minIdx]
            console.log(`IDX: ${minIdx} , ${minDist}`)
          })
        })
      }
      buildDistances()
    }
    mapInst.controls[google.maps.ControlPosition.TOP_CENTER].push(btn)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (loadError) {
    return <div> Error loading maps </div>
  }
  if (!isLoaded) {
    return <div> Loading maps... </div>
  }

  const mapOnClick = (e: google.maps.MapMouseEvent) => {
    console.log('## Map click: ', e)
    console.log(`${e.latLng?.lat()}, ${e.latLng?.lng()}`)
  }

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={mapZoom}
        center={mapCenter}
        onLoad={onLoad}
        onClick={mapOnClick}
        onIdle={() => {
          let bounds = map!.getBounds()?.toJSON()
          console.log(`## Marker IDLE, bounds: `)
          console.log(bounds)
        }}
      >
        <MarkerF
          position={mapCenter}
          icon="pins/green_pin.png"
          onClick={e => {
            console.log(`## Marker center Click: `, e)
          }}
        />
        {listOfMarkers.map((mpos, idx) => (
          <MarkerF
            key={`${mpos.lat}-${mpos.lat}`}
            position={mpos}
            icon="pins/green_pin.png"
            onClick={e => {
              console.log(`## Marker (`, idx, `) click: `, e)
            }}
          />
        ))}
      </GoogleMap>
    </div>
  )
}

export default ParkingMap
