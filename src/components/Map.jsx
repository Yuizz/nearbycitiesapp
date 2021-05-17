import React from 'react'
import {
    GoogleMap,
    withScriptjs,
    withGoogleMap, Marker
} from "react-google-maps"

const Map = ({centerPoint, markers, props}) => {
    return(
        <GoogleMap
            defaultZoom={8}
            defaultCenter={{lat: centerPoint.lat, lng: centerPoint.lon}}
        >
            <Marker
                label={'Punto central'}
                icon={{url:'http://maps.google.com/mapfiles/ms/icons/ylw-pushpin.png'}}
                position={{lat:centerPoint.lat, lng:centerPoint.lon}}
            />

            {
                markers.map(marker => <Marker
                label={marker.name}
                labelStyle={{backgroundColor:'yellow', fontSize:'32px'}}

                icon={{url:'http://maps.google.com/mapfiles/ms/icons/red.png'}}
                position={{lat:marker.lat, lng:marker.lon}}/>)
            }
        </GoogleMap>
    )
}

export default withScriptjs(
    withGoogleMap(
        Map
    )
)

