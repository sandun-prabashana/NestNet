import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { collection, query, getDocs } from "firebase/firestore";
import { db } from "../FireBaseConfig2";
import { Card, CardContent, Typography } from "@mui/material";

const PropertyTypePieChart = () => {
  const [propertyTypeData, setPropertyTypeData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const postsQuery = query(collection(db, "posts"));
        const postsDocs = await getDocs(postsQuery);
        
        // Counting property types
        const propertyTypeCounts = {};
        postsDocs.forEach(doc => {
          const type = doc.data().propertyType;
          propertyTypeCounts[type] = (propertyTypeCounts[type] || 0) + 1;
        });

        // Preparing chart data
        const labels = Object.keys(propertyTypeCounts);
        const data = Object.values(propertyTypeCounts);
        setPropertyTypeData({
          labels,
          datasets: [{
            data,
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#FF9999', '#66ff66', '#c2c2f0'],
            hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#FF9999', '#66ff66', '#c2c2f0']
          }]
        });

      } catch (error) {
        console.error("Error fetching data: ", error);
        setPropertyTypeData({});
      }
    };
    fetchData();
  }, []);

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Property Type Distribution
        </Typography>
        {propertyTypeData.labels && propertyTypeData.labels.length > 0 ? (
            <Pie data={propertyTypeData} />
        ) : (
            <Typography color="textSecondary">
              No Data Available
            </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default PropertyTypePieChart;
