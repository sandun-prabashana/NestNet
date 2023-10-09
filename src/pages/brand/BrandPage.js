import React, { useState, useCallback, useRef } from "react";
import {
  Container,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Card,
  CardContent,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

import { useForm, Controller } from "react-hook-form";
import { LoadingButton } from "@mui/lab";
import { v4 } from "uuid";
import InfoIcon from "@mui/icons-material/Info";
import Tooltip from "@mui/material/Tooltip";
import Swal from "sweetalert2";
import { db } from "../../pages/FireBaseConfig2";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../pages/FireBaseConfig3";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { collection, addDoc } from "firebase/firestore";

const MyGoogleMap = ({ onMarkerDragEnd }) => {
  const mapRef = useRef();

  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  return (
    <LoadScript googleMapsApiKey="AIzaSyCDrYhoi1ChllFuQDG0-NxLs-pEQYEQBQ4&callback=initMap">
      <GoogleMap
        mapContainerStyle={{ width: "400px", height: "400px" }}
        center={{ lat: 7.8731, lng: 80.7718 }}
        zoom={6}
        onLoad={onMapLoad}
      >
        <Marker
          position={{ lat: 7.8731, lng: 80.7718 }}
          draggable={true}
          onDragEnd={(e) => onMarkerDragEnd(e.latLng.lat(), e.latLng.lng())}
        />
      </GoogleMap>
    </LoadScript>
  );
};

export default function BrandPage() {
  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();

  // const { setValue } = useForm(); // Get setValue from useForm hook

  const handleMarkerDragEnd = (lat, lng) => {
    setLatitude(lat);
    setLongitude(lng);
    console.log("Marker moved to:", lat, lng);

    setValue("latitude", lat);
    setValue("longitude", lng);
  };

  const [isImg1Uploaded, setIsImg1Uploaded] = useState(false);
  const [isImg2Uploaded, setIsImg2Uploaded] = useState(false);
  const [isImg3Uploaded, setIsImg3Uploaded] = useState(false);

  // const handleMarkerDragEnd = (lat, lng) => {
  //   setLatitude(lat);
  //   setLongitude(lng);
  //   console.log(lat + " " + lng);
  // };

  const propertyTypes = ["APARTMENT", "COMMERCIAL", "HOUSE", "LAND", "VILLA"];

  const districts = [
    "Ampara",
    "Anuradhapura",
    "Badulla",
    "Batticaloa",
    "Colombo",
    "Galle",
    "Gampaha",
    "Hambantota",
    "Jaffna",
    "Kalutara",
    "Kandy",
    "Kegalle",
    "Kilinochchi",
    "Kurunegala",
    "Mannar",
    "Matale",
    "Matara",
    "Monaragala",
    "Mullaitivu",
    "Nuwara Eliya",
    "Polonnaruwa",
    "Puttalam",
    "Ratnapura",
    "Trincomalee",
    "Vavuniya",
  ];

  const stories = [1, 2, 3];

  const [isLoading, setIsLoading] = useState(false);

  const [key, setKey] = useState(0); // Add a key state

  const {
    control,
    setValue, // Ensure setValue is destructured here
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const img1Ref = useRef(); // Create refs for the file inputs
  const img2Ref = useRef();
  const img3Ref = useRef();

  const handleReset = () => {
    // ... your existing reset logic
  
    // Reset file inputs by directly manipulating the DOM elements
    if (img1Ref.current) img1Ref.current.value = "";
    if (img2Ref.current) img2Ref.current.value = "";
    if (img3Ref.current) img3Ref.current.value = "";
  
    // Reset image URLs
    setImg1("");
    setImg2("");
    setImg3("");
  
    // Reset the isUploaded states
    setIsImg1Uploaded(false);
    setIsImg2Uploaded(false);
    setIsImg3Uploaded(false);
  
    // Log for debugging
    console.log('Resetting...');
    console.log('isImg1Uploaded:', isImg1Uploaded);
    console.log('isImg2Uploaded:', isImg2Uploaded);
    console.log('isImg3Uploaded:', isImg3Uploaded);
  
    reset({});
    setKey((prevKey) => prevKey + 1);
  };



  const usersCollectionRef = collection(db, "posts");

  const [img1, setImg1] = useState("");
  const [img2, setImg2] = useState("");
  const [img3, setImg3] = useState("");

  const handleUpload = async (e, setImage, setUploadSuccess) => {
    try {
      console.log("File to upload: ", e.target.files[0]);

      const image_id = v4();
      const small_image_id = image_id.slice(0, 16);

      console.log("UUID function: ", small_image_id);
      console.log("Storage instance: ", storage);

      // Use `small_image_id` for both folder and file name
      const imgs = ref(storage, `Imgs/${small_image_id}/${small_image_id}`);
      console.log("Image Reference: ", imgs);

      const uploadSnapshot = await uploadBytes(imgs, e.target.files[0]);
      console.log("Upload Bytes Data: ", uploadSnapshot);

      const imageURL = await getDownloadURL(uploadSnapshot.ref);
      console.log("Download URL: ", imageURL);

      setImage(imageURL);
      setUploadSuccess(true);
    } catch (error) {
      console.error("Error in handleUpload: ", error);
      setUploadSuccess(false);
    }
  };

  const audittraceCollectionRef = collection(db, "audittrace");

  const randomID = Math.floor(Math.random() * 1000000);

  const currentTime = new Date().toISOString();


  const unique_id = v4();
  const small_id = unique_id.slice(0, 8);

  const onSubmit = async (data) => {
    setIsLoading(true);

    try {
      await addDoc(usersCollectionRef, {
        id: small_id,

        email: sessionStorage.getItem("email"),

        district: data.district,
        propertyType: data.propertyType,
        landSize: data.landSize,
        houseSize: data.houseSize,
        stories: data.stories,
        bedRooms: data.bedrooms,

        bathsRooms: data.bathrooms,
        latitude: data.latitude,
        longitude: data.longitude,

        isNew: data.isNew,
        hasPool: data.hasPool,
        hasGarage: data.hasGarage,
        hasCCTV: data.hasCCTV,
        hasGarden: data.hasGarden,

        description: data.description,
        price: "2000000.00",

        createTime: currentTime,

        status: "ACTIVE",

        image1: img1,
        image2: img2,
        image3: img3,
      });

      const userIP = "0.0.0.0"; 

      await addDoc(audittraceCollectionRef, {
        AUDITTRACEID: `trace${randomID}`, 
        CREATEDTIME: currentTime,
        DESCRIPTION: "Add Ad (Ad ID : "+small_id+")",
        IP: userIP,
        LASTUPDATEDTIME: currentTime,
        LASTUPDATEDUSER: sessionStorage.getItem("name"),
        EMAIL: sessionStorage.getItem("email"),
      });

      // Optionally, reset the form after submitting.
      handleReset();

      // Optionally, display a success message using SweetAlert2.
      Swal.fire("Good job!", "Your post has been saved!", "success");
    } catch (e) {
      console.error("Error adding document: ", e);

      // Optionally, display an error message using SweetAlert2.
      Swal.fire("Oops...", "Something went wrong!", "error");
    } finally {
      setIsLoading(false);
    }
    setIsLoading(false);
  };

  return (
    <Container component="main" maxWidth="lg" sx={{ my: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Add Selling Post
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Property Details
                </Typography>
                <Controller
                  name="district"
                  control={control}
                  defaultValue=""
                  rules={{ required: "District is required" }}
                  render={({ field }) => (
                    <FormControl fullWidth variant="outlined" margin="normal">
                      <InputLabel id="district-label">District</InputLabel>
                      <Select
                        {...field}
                        labelId="district-label"
                        label="District"
                        error={Boolean(errors.district)}
                      >
                        {districts.map((district) => (
                          <MenuItem key={district} value={district}>
                            {district}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />

                <Controller
                  name="propertyType"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Property Type is required" }}
                  render={({ field }) => (
                    <FormControl fullWidth variant="outlined" margin="normal">
                      <InputLabel id="propertyType-label">
                        Property Type
                      </InputLabel>
                      <Select
                        {...field}
                        labelId="propertyType-label"
                        label="Property Type"
                        error={Boolean(errors.propertyType)}
                      >
                        {propertyTypes.map((type) => (
                          <MenuItem key={type} value={type}>
                            {type}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />

                <Controller
                  name="landSize"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Land Size is required" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      label="Land Size"
                      type="number"
                      error={Boolean(errors.landSize)}
                      helperText={errors.landSize?.message}
                    />
                  )}
                />

                <Controller
                  name="houseSize"
                  control={control}
                  defaultValue=""
                  rules={{ required: "House Size is required" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      label="House Size"
                      type="number"
                      error={Boolean(errors.houseSize)}
                      helperText={errors.houseSize?.message}
                    />
                  )}
                />

                <Controller
                  name="stories"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Story is required" }}
                  render={({ field }) => (
                    <FormControl fullWidth variant="outlined" margin="normal">
                      <InputLabel id="story-label">Story</InputLabel>
                      <Select
                        {...field}
                        labelId="story-label"
                        label="Story"
                        error={Boolean(errors.stories)}
                      >
                        {stories.map((story) => (
                          <MenuItem key={story} value={story}>
                            {story}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />

                <Controller
                  name="bedrooms"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Bedrooms is required" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      label="Bedrooms"
                      type="number"
                      error={Boolean(errors.bedrooms)}
                      helperText={errors.bedrooms?.message}
                    />
                  )}
                />
                <Controller
                  name="bathrooms"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Bathrooms is required" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      label="Bathrooms"
                      type="number"
                      error={Boolean(errors.bathrooms)}
                      helperText={errors.bathrooms?.message}
                    />
                  )}
                />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Location
                </Typography>
                <MyGoogleMap onMarkerDragEnd={handleMarkerDragEnd} />
                <Controller
                  name="longitude"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Longitude is required" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      label="Longitude"
                      type="number"
                      error={Boolean(errors.longitude)}
                      helperText={errors.longitude?.message}
                      disabled
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  )}
                />

                <Controller
                  name="latitude"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Latitude is required" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      label="Latitude"
                      type="number"
                      error={Boolean(errors.latitude)}
                      helperText={errors.latitude?.message}
                      disabled
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  )}
                />
              </CardContent>
            </Card>
          </Grid>

          {/* Checkboxes */}
          <Grid item xs={12}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Additional Features
                </Typography>
                <Controller
                  name="isNew"
                  control={control}
                  defaultValue={false}
                  key={`isNew-${key}`}
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Checkbox {...field} />}
                      label="Is New"
                    />
                  )}
                />

                <Controller
                  name="hasPool"
                  control={control}
                  defaultValue={false}
                  key={`hasPool-${key}`}
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Checkbox {...field} />}
                      label="Has Pool"
                    />
                  )}
                />

                <Controller
                  name="hasGarage"
                  control={control}
                  defaultValue={false}
                  key={`hasGarage-${key}`}
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Checkbox {...field} />}
                      label="Has Garage"
                    />
                  )}
                />

                <Controller
                  name="hasCCTV"
                  control={control}
                  defaultValue={false}
                  key={`hasCCTV-${key}`}
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Checkbox {...field} />}
                      label="Has CCTV"
                    />
                  )}
                />

                <Controller
                  name="hasGarden"
                  control={control}
                  key={`hasGarden-${key}`}
                  defaultValue={false}
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Checkbox {...field} />}
                      label="Has Garden"
                    />
                  )}
                />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Images
                </Typography>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <input
                    ref={img1Ref}
                    accept="image/*"
                    type="file"
                    onChange={(e) =>
                      handleUpload(e, setImg1, setIsImg1Uploaded)
                    }
                  />
                  {isImg1Uploaded && (
                    <CheckCircleOutlineIcon
                      style={{ color: "green", marginLeft: "10px" }}
                    />
                  )}
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <input
                    ref={img2Ref}
                    accept="image/*"
                    type="file"
                    onChange={(e) =>
                      handleUpload(e, setImg2, setIsImg2Uploaded)
                    }
                  />
                  {isImg2Uploaded && (
                    <CheckCircleOutlineIcon
                      style={{ color: "green", marginLeft: "10px" }}
                    />
                  )}
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <input
                    ref={img3Ref}
                    accept="image/*"
                    type="file"
                    onChange={(e) =>
                      handleUpload(e, setImg3, setIsImg3Uploaded)
                    }
                  />
                  {isImg3Uploaded && (
                    <CheckCircleOutlineIcon
                      style={{ color: "green", marginLeft: "10px" }}
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card elevation={3}>
              <CardContent>
                <Controller
                  name="description"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Description is required" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      label="Description"
                      type="text"
                      error={Boolean(errors.description)}
                      helperText={errors.description?.message}
                    />
                  )}
                />
              </CardContent>
            </Card>
          </Grid>

          {/* Buttons */}
          <Grid item xs={12} sm={6}>
            <Button
              variant="outlined"
              color="primary"
              fullWidth
              onClick={handleReset}
            >
              Reset
            </Button>
          </Grid>
          <Grid item xs={12} sm={6}>
            <LoadingButton
              fullWidth
              variant="contained"
              loading={isLoading}
              type="submit"
            >
              Add Post
            </LoadingButton>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}
