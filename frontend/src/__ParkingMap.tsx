import {
	useState,
	useCallback,
	
} from 'react';
import {
	GoogleMap,
	useLoadScript,
	// withScriptjs,
	// withGoogleMap,
} from '@react-google-maps/api';

import { shapeStyles } from './styles'

const MAPS_API_KEY : string = "AIzaSyAKPWn2CpkeYOypOiIbnpaDhbnZP3fky_M"

function ParkingMap() {
	const [map, setMap] = useState();

	const onLoad = useCallback((mapInstance: any) => {
			console.log(`## Map before: ${map}`);
			setMap(mapInstance);
			console.log("## map loaded " + MAPS_API_KEY);
			console.log(`## Map after set ${map}`);
		}, [map]
	);

	const { isLoaded, loadError } = useLoadScript({
		googleMapsApiKey: MAPS_API_KEY,
	})

	const renderMap = () => {
		const mapOptions = {
			//mapContainerStyle:shapeStyles.container,
			//zoom:2,
			// zoomControlOptions: {
			// 	position: map.maps.ControlPosition.RIGHT_CENTER // ,
			// 	// ...otherOptions
			// },
		}

		return <GoogleMap
				options={mapOptions}
				onLoad={onLoad}>
			{
				
			}
		</GoogleMap>
	}

	if (loadError) {
		return <div>Map cannot be loaded right now, sorry.</div>
	}
	
	return isLoaded ? renderMap() : null // <Spinner />
}

export default ParkingMap