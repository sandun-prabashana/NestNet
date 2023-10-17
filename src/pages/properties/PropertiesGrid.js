import React, { useEffect, useState } from "react";
import { db } from "../../pages/FireBaseConfig2";
import { collection, getDocs, query, where } from "firebase/firestore";
import LoadingImage from '../../images/assets/images/loading.gif';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Grid,
  Box,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  TextField,
  InputAdornment,
  IconButton,
  Drawer,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import ContactMailIcon from "@mui/icons-material/ContactMail";

import "../../utils/property.css";

export default function PropertiesGrid() {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [filters, setFilters] = useState({
    district: "",
    maxPrice: "",
    landSize: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const [contactDetails, setContactDetails] = useState(null);
  const [openContactDialog, setOpenContactDialog] = useState(false);

  const handleContactClick = async (email) => {
    const usersCollection = collection(db, "users");
    const userQuery = query(usersCollection, where("email", "==", email));
    const userSnapshot = await getDocs(userQuery);

    if (!userSnapshot.empty) {
      setContactDetails(userSnapshot.docs[0].data());
      setOpenContactDialog(true);
    } else {
      // Handle case when user not found
    }
  };

  const timeSince = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
  };

  const toSentenceCase = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({ district: "", maxPrice: "", landSize: "" });
  };

  useEffect(() => {
    const fetchProperties = async () => {
      const propertiesCollection = collection(db, "posts");
      const propertiesQuery = query(propertiesCollection, where("status", "==", "ACTIVE"));
      const propertiesSnapshot = await getDocs(propertiesQuery);
      const propertiesList = propertiesSnapshot.docs.map((doc) => doc.data());
      setProperties(propertiesList);
      setLoading(false);
    };
    fetchProperties();
  }, []);

  useEffect(() => {
    let result = properties;
    if (filters.district) {
      result = result.filter(
        (property) => property.district === filters.district
      );
    }
    if (filters.maxPrice) {
      result = result.filter(
        (property) => parseFloat(property.price) <= filters.maxPrice
      );
    }
    if (filters.landSize) {
      result = result.filter(
        (property) => parseFloat(property.landSize) <= filters.landSize
      );
    }
    setFilteredProperties(result);
  }, [properties, filters]);

  const handleCardClick = (property) => {
    setSelectedProperty(property);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedProperty(null);
  };

  const drawer = (
    <div style={{ padding: 16, width: 300 }}>
      <Typography variant="h6">Filter Options</Typography>
      <Divider />
      <Box my={2}>
        <FormControl variant="outlined" fullWidth>
          <InputLabel>District</InputLabel>
          <Select
            value={filters.district}
            onChange={handleFilterChange}
            label="District"
            name="district"
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {[
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
            ].map((district) => (
              <MenuItem value={district} key={district}>
                {district}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Box my={2}>
        <TextField
          label="Max Price"
          variant="outlined"
          type="number"
          fullWidth
          value={filters.maxPrice}
          onChange={handleFilterChange}
          name="maxPrice"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">LKR</InputAdornment>
            ),
          }}
        />
      </Box>
      <Box my={2}>
        <TextField
          label="Max Land Size"
          variant="outlined"
          type="number"
          fullWidth
          value={filters.landSize}
          onChange={handleFilterChange}
          name="landSize"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">Perches</InputAdornment>
            ),
          }}
        />
      </Box>
      <Button variant="outlined" color="primary" onClick={clearFilters}>
        Clear Filters
      </Button>
    </div>
  );

  return (
    <Box>
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
        >
          <img src={LoadingImage} alt="Loading..." />
        </Box>
      ) : (
        <>
          <Box my={2} display="flex" justifyContent="flex-end">
            <IconButton onClick={() => setShowFilters(!showFilters)}>
              <FilterListIcon />
            </IconButton>
          </Box>
          <Drawer
            anchor="right"
            open={showFilters}
            onClose={() => setShowFilters(false)}
          >
            {drawer}
          </Drawer>
          <Grid container spacing={3}>
            {filteredProperties.map((property, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  onClick={() => handleCardClick(property)}
                  className="card"
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={property.image1}
                    alt="Property Image"
                  />
                  <CardContent>
                    <Typography variant="h5" color="text.secondary">
                      {property.description}
                    </Typography>
                    <Typography variant="body2" color="black">
                      {property.landSize} perches
                    </Typography>
                    <Typography variant="body2" color="black">
                      {property.district} ,{" "}
                      {toSentenceCase(property.propertyType)} For Sale
                    </Typography>
                    <Typography variant="h5" component="div">
                      LKR {property.price}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      align="right"
                      style={{ padding: "0 16px 16px" }}
                    >
                      {timeSince(property.createTime)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Dialog
            open={openDialog}
            onClose={handleCloseDialog}
            maxWidth="md"
            fullWidth
          >
            {selectedProperty && (
              <>
                <DialogTitle>{selectedProperty.description}</DialogTitle>
                <DialogContent>
                  <Typography variant="h5">
                    Price: LKR {selectedProperty.price}
                  </Typography>
                  <Grid container spacing={2}>
                    {["image1", "image2", "image3"].map((imageName, index) => (
                      <Grid item xs={4} key={index}>
                        <img
                          src={selectedProperty[imageName]}
                          alt={`Property ${index + 1}`}
                          style={{
                            width: "100%",
                            maxHeight: "150px",
                            objectFit: "cover",
                          }}
                        />
                      </Grid>
                    ))}
                  </Grid>
                  <br></br>
                  <Typography variant="body1" style={{ fontWeight: "bold" }}>
                    Land Size:{" "}
                    <span style={{ fontWeight: "normal" }}>
                      {selectedProperty.landSize} perches
                    </span>
                  </Typography>
                  <Typography variant="body1" style={{ fontWeight: "bold" }}>
                    District:{" "}
                    <span style={{ fontWeight: "normal" }}>
                      {selectedProperty.district}
                    </span>
                  </Typography>
                  <Typography variant="body1" style={{ fontWeight: "bold" }}>
                    Type:{" "}
                    <span style={{ fontWeight: "normal" }}>
                      {toSentenceCase(selectedProperty.propertyType)}
                    </span>
                  </Typography>
                  <Typography variant="body1" style={{ fontWeight: "bold" }}>
                    Bathrooms:{" "}
                    <span style={{ fontWeight: "normal" }}>
                      {selectedProperty.bathsRooms}
                    </span>
                  </Typography>
                  <Typography variant="body1" style={{ fontWeight: "bold" }}>
                    Bedrooms:{" "}
                    <span style={{ fontWeight: "normal" }}>
                      {selectedProperty.bedRooms}
                    </span>
                  </Typography>
                  <Typography variant="body1" style={{ fontWeight: "bold" }}>
                    CCTV:{" "}
                    <span style={{ fontWeight: "normal" }}>
                      {selectedProperty.hasCCTV ? "Yes" : "No"}
                    </span>
                  </Typography>
                  <Typography variant="body1" style={{ fontWeight: "bold" }}>
                    Garage:{" "}
                    <span style={{ fontWeight: "normal" }}>
                      {selectedProperty.hasGarage ? "Yes" : "No"}
                    </span>
                  </Typography>
                  <Typography variant="body1" style={{ fontWeight: "bold" }}>
                    Garden:{" "}
                    <span style={{ fontWeight: "normal" }}>
                      {selectedProperty.hasGarden ? "Yes" : "No"}
                    </span>
                  </Typography>
                  <Typography variant="body1" style={{ fontWeight: "bold" }}>
                    Pool:{" "}
                    <span style={{ fontWeight: "normal" }}>
                      {selectedProperty.hasPool ? "Yes" : "No"}
                    </span>
                  </Typography>
                  <Typography variant="body1" style={{ fontWeight: "bold" }}>
                    House Size:{" "}
                    <span style={{ fontWeight: "normal" }}>
                      {selectedProperty.houseSize}
                    </span>
                  </Typography>
                  <Typography variant="body1" style={{ fontWeight: "bold" }}>
                    Is New:{" "}
                    <span style={{ fontWeight: "normal" }}>
                      {selectedProperty.isNew ? "Yes" : "No"}
                    </span>
                  </Typography>
                  <Typography variant="body1" style={{ fontWeight: "bold" }}>
                    Latitude:{" "}
                    <span style={{ fontWeight: "normal" }}>
                      {selectedProperty.latitude}
                    </span>
                  </Typography>
                  <Typography variant="body1" style={{ fontWeight: "bold" }}>
                    Longitude:{" "}
                    <span style={{ fontWeight: "normal" }}>
                      {selectedProperty.longitude}
                    </span>
                  </Typography>
                  <Typography variant="body1" style={{ fontWeight: "bold" }}>
                    Stories:{" "}
                    <span style={{ fontWeight: "normal" }}>
                      {selectedProperty.stories}
                    </span>
                  </Typography>
                  <br></br>
                  <Typography variant="body1" style={{ fontWeight: "bold" }}>
                    Contact Details{" "}
                  </Typography>
                  <IconButton
                    onClick={() => handleContactClick(selectedProperty.email)}
                  >
                    <ContactMailIcon />
                    <span style={{ fontWeight: "bold" }}></span>
                  </IconButton>
                </DialogContent>
              </>
            )}
          </Dialog>
          <Dialog
            open={openContactDialog}
            onClose={() => setOpenContactDialog(false)}
          >
            {contactDetails && (
              <>
                <DialogTitle>Contact Details</DialogTitle>
                <DialogContent>
                  <Typography variant="body1">
                    Name: {contactDetails.userName}
                  </Typography>
                  <Typography variant="body1">
                    Email: {contactDetails.email}
                  </Typography>
                  <Typography variant="body1">
                    Phone: {contactDetails.phoneNumber}
                  </Typography>
                  <Typography variant="body1">
                    Address: {contactDetails.address}, {contactDetails.city}
                  </Typography>
                </DialogContent>
                <DialogActions>
                  <Button
                    onClick={() => setOpenContactDialog(false)}
                    color="primary"
                  >
                    Close
                  </Button>
                </DialogActions>
              </>
            )}
          </Dialog>
        </>
      )}
    </Box>
  );
}
