import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useTheme } from "@mui/material/styles";
import { Grid, Container, Typography } from "@mui/material";
import Iconify from "../components/iconify";
import { fShortenNumber } from "../utils/formatNumber";
import axios from "axios";
import {
  AppCurrentVisits,
  AppWebsiteVisits,
  AppWidgetSummary,
} from "../sections/@dashboard/app";

export default function DashboardAppPage() {
  const theme = useTheme();
  const [customerCount, setCustomerCount] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [categoryCount, setCategoryCount] = useState(0);
  const [brandCount, setBrandCount] = useState(0);
  const [purchaseCount, setPurchaseCount] = useState(0);

  const [activeUserCount, setActiveUserCount] = useState(0);
const [deactiveUserCount, setDeactiveUserCount] = useState(0);

  useEffect(() => {
    const token = sessionStorage.getItem('token');
  
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
  

    axios.get('http://localhost:8080/BB/api/v1/customer/count', config)
      .then((response) => {
        setCustomerCount(response.data.data);
        console.log(response.data.data);
      })
      .catch((error) => console.error(error));
  

    axios.get('http://localhost:8080/BB/api/v1/product/count', config)
      .then((response) => {
        setProductCount(response.data.data);
        console.log(response.data.data);
      })
      .catch((error) => console.error(error));
  

    axios.get('http://localhost:8080/BB/api/v1/category/count', config)
      .then((response) => {
        setCategoryCount(response.data.data);
        console.log(response.data.data);
      })
      .catch((error) => console.error(error));
  

    axios.get('http://localhost:8080/BB/api/v1/brand/count', config)
      .then((response) => {
        setBrandCount(response.data.data);
        console.log(response.data.data);
      })
      .catch((error) => console.error(error));

      axios.get('http://localhost:8080/BB/api/v1/purchase/count', config)
      .then((response) => {
        setPurchaseCount(response.data.data);
        console.log(response.data.data);
      })
      .catch((error) => console.error(error));
  

    axios.get('http://localhost:8080/BB/api/v1/customer/ACTIVE/countByStatus', config)
      .then((response) => {
        setActiveUserCount(response.data);
      })
      .catch((error) => console.error(error));

      axios.get('http://localhost:8080/BB/api/v1/customer/DEACTIVE/countByStatus', config)
      .then((response) => {
        setDeactiveUserCount(response.data);
      })
      .catch((error) => console.error(error));

  }, []);

  return (
    <>
      <Helmet>
        <title> Dashboard | Minimal UI </title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hi, Welcome back
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Customer"
              total={customerCount}
              icon={"raphael:customer"}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Catergary"
              total={categoryCount}
              color="info"
              icon={"carbon:collapse-categories"}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Brand"
              total={brandCount}
              color="warning"
              icon={"fluent-mdl2:verified-brand"}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Product"
              total={productCount}
              color="error"
              icon={"fluent-mdl2:product"}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppWebsiteVisits
              title="Purchase Summary"
              chartLabels={[
                "01/01/2023",
                "02/01/2023",
                "03/01/2023",
                "04/01/2023",
                "05/01/2023",
                "06/01/2023",
                "07/01/2023",
                "08/01/2023",
                "09/01/2023",
                "10/01/2023",
                "11/01/2023",
                "12/01/2023",
              ]}
              chartData={[
                {
                  name: "Purchases",
                  type: "column",
                  fill: "solid",
                  data: [0, 0, 0, purchaseCount, 0, 0, 0, 0, 0, 0, 0],
                },
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentVisits
              title="User Status"
              chartData={[
                { label: "Active", value: activeUserCount },
                { label: "Deactive", value: deactiveUserCount },
              ]}
              chartColors={[
                theme.palette.primary.main,
                theme.palette.error.main,
                theme.palette.warning.main,
                theme.palette.error.main,
              ]}
            />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
