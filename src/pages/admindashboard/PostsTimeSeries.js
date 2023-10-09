import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "../FireBaseConfig2";
import { Container, Card, CardContent, Typography } from '@mui/material';

const PostsTimeSeries = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const postsQuery = query(
          collection(db, "posts"),
          orderBy("createTime") 
        );
        const postDocs = await getDocs(postsQuery);
        const postsData = postDocs.docs.map(doc => ({...doc.data(), id: doc.id}));

        const counts = {};
        postsData.forEach(post => {
          const date = new Date(post.createTime).toISOString().split('T')[0]; 
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
        Posts Time Series
      </Typography>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <CartesianGrid stroke="#eee" strokeDasharray="5 5"/>
              <Line type="monotone" dataKey="count" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
  );
};

export default PostsTimeSeries;
