import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "../FireBaseConfig2";
import { Card, CardContent, Typography } from '@mui/material';

const UserRegistrationsBarChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersQuery = query(
          collection(db, "users"),
          orderBy("createTime") 
        );
        const userDocs = await getDocs(usersQuery);
        const usersData = userDocs.docs.map(doc => ({...doc.data(), id: doc.id}));

        const counts = {};
        usersData.forEach(user => {
          const date = new Date(user.createTime).toISOString().split('T')[0];
          counts[date] = (counts[date] || 0) + 1;
        });

        const chartData = Object.keys(counts).map(date => ({date, count: counts[date]}));
        setData(chartData);

      } catch (error) {
        console.error("Error fetching data: ", error);
        setData([]);
      }
    };
    fetchData();
  }, []);

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          User Registrations Over Time
        </Typography>
        <BarChart width={600} height={300} data={data}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <CartesianGrid stroke="#eee" strokeDasharray="5 5"/>
          <Bar dataKey="count" fill="#8884d8" />
        </BarChart>
      </CardContent>
    </Card>
  );
};

export default UserRegistrationsBarChart;
