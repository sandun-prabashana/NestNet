import React, { useCallback, useRef, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

export function MyGoogleMap({ onMarkerDragEnd }) {
  const mapRef = useRef();

  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  return (
    // <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCDrYhoi1ChllFuQDG0-NxLs-pEQYEQBQ4&callback=initMap" asyncdefer></script>

    <LoadScript googleMapsApiKey="AIzaSyCDrYhoi1ChllFuQDG0-NxLs-pEQYEQBQ4&callback=initMap">
      <GoogleMap
        mapContainerStyle={{ width: '400px', height: '400px' }}
        center={{ lat: 0, lng: 0 }}
        zoom={3}
        onLoad={onMapLoad}
      >
        <Marker
          position={{ lat: 0, lng: 0 }}
          draggable={true}
          onDragEnd={(e) => onMarkerDragEnd(e.latLng.lat(), e.latLng.lng())}
        />
      </GoogleMap>
    </LoadScript>
  );
}
