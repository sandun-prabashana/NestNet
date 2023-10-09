import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Container } from "@mui/material";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { db } from "../FireBaseConfig2";
import EditIcon from "@mui/icons-material/Edit";
import { updateDoc, doc } from "firebase/firestore";
import PostsTimeSeries from "./PostsTimeSeries";
import AdsStatusPieChart from "./AdsStatusPieChart";
import PropertyLocationsMap from "./PropertyLocationsMap";
import UserRegistrationsBarChart from "./UserRegistrationsBarChart";
import UserActivityTimeline from "./UserActivityTimeline";
import PropertyTypePieChart from "./PropertyTypePieChart";

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
import {
  AppWidgetSummary,
  AppWebsiteVisits,
  AppCurrentVisits,
} from "../../sections/@dashboard/app";
// import "../../utils/property.css";

export default function DashboardAppPage() {
  const [customerCount, setCustomerCount] = useState(0);
  const [ongoingAdsCount, setOngoingAdsCount] = useState(0);
  const [soldAdsCount, setSoldAdsCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allAdsQuery = query(collection(db, "posts"));
        const allAds = await getDocs(allAdsQuery);
        setCustomerCount(allAds.size || 0);

        const ongoingAdsQuery = query(
          collection(db, "posts"),
          where("status", "==", "ACTIVE")
        );
        const ongoingAds = await getDocs(ongoingAdsQuery);
        setOngoingAdsCount(ongoingAds.size || 0);

        const soldAdsQuery = query(
          collection(db, "posts"), // Note: You used "ads" in your previous code. Ensure to use the correct collection name.

          where("status", "==", "SOLD")
        );
        const soldAds = await getDocs(soldAdsQuery);
        setSoldAdsCount(soldAds.size || 0);
      } catch (error) {
        console.error("Error fetching data: ", error);
        setCustomerCount(0);
        setOngoingAdsCount(0);
        setSoldAdsCount(0);
      }
    };

    fetchData();
  });

  useEffect(() => {
    console.log(soldAdsCount); // Log the updated state
  }, [soldAdsCount]);

  return (
    <>
      <Helmet>
        <title>Dashboard | Your App</title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hi, Welcome back
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <AppWidgetSummary
              title="All Ads"
              total={customerCount}
              icon={"iconoir:post"}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <AppWidgetSummary
              title="On Going Ads"
              total={ongoingAdsCount}
              color="error"
              icon={"ic:round-post-add"}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <AppWidgetSummary
              title="Sold Ads"
              total={soldAdsCount}
              color="warning"
              icon={"fluent-mdl2:post-update"}
            />
          </Grid>
        </Grid>
        <br></br>
        <Grid item xs={12}>
          <PropertyLocationsMap />
        </Grid>
        <br></br>
        <Grid item xs={12}>
          <PostsTimeSeries />
        </Grid>
        <br></br>
        <Grid item xs={12}>
          <UserRegistrationsBarChart />
        </Grid>
      </Container>
    </>
  );
}
