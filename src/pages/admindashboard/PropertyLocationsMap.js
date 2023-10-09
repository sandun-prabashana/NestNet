import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { collection, getDocs } from "firebase/firestore";
import { Container, Card, CardContent, Typography } from '@mui/material';
import { db } from "../FireBaseConfig2";

const mapContainerStyle = {
  height: '500px',
  width: '100%'
};

const center = {
  lat: 20.5937, 
  lng: 78.9629  // Centering around India as an example
};

const options = {
  disableDefaultUI: true,
  zoomControl: true,
};

const PropertyLocationsMap = () => {
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const postsQuery = collection(db, "posts");
        const postDocs = await getDocs(postsQuery);
        const postsData = postDocs.docs.map(doc => ({...doc.data(), id: doc.id}));

        // Extract locations
        const locs = postsData.map(post => ({
          id: post.id,
          lat: parseFloat(post.latitude),
          lng: parseFloat(post.longitude),
          status: post.status
        }));
        setLocations(locs);

      } catch (error) {
        console.error("Error fetching data: ", error);
        setLocations([]);
      }
    };
    fetchData();
  }, []);

  return (
    <Card>
    <CardContent>
    <Typography variant="h6" gutterBottom>
    Property Locations
      </Typography>
    <LoadScript googleMapsApiKey="AIzaSyCDrYhoi1ChllFuQDG0-NxLs-pEQYEQBQ4&callback=initMap">
      <GoogleMap 
        id="marker-example"
        mapContainerStyle={mapContainerStyle}
        center={{ lat: 7.8731, lng: 80.7718 }}
        zoom={6}
        options={options}
      >
        {locations.map(loc => (
          <Marker 
            key={loc.id}
            position={{ lat: loc.lat, lng: loc.lng }}
            onClick={() => setSelectedLocation(loc)}
          />
        ))}
        
        {selectedLocation && (
          <InfoWindow
            position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
            onCloseClick={() => setSelectedLocation(null)}
          >
            <div>
              <h2>Property ID: {selectedLocation.id}</h2>
              <p>Status: {selectedLocation.status}</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
    </CardContent>
      </Card>
  );
};

export default PropertyLocationsMap;
