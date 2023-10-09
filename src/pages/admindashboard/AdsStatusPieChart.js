import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Tooltip, Legend, Cell } from 'recharts';
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../FireBaseConfig2";

const COLORS = ['#0088FE', '#00C49F'];

const AdsStatusPieChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch All Ads
        const allAdsQuery = query(collection(db, "posts"));
        const allAds = await getDocs(allAdsQuery);

        // Fetch Active Ads
        const activeAdsQuery = query(
          collection(db, "posts"),
          where("status", "==", "ACTIVE")
        );
        const activeAds = await getDocs(activeAdsQuery);

        // Fetch Sold Ads
        const soldAdsQuery = query(
          collection(db, "posts"),
          where("status", "==", "SOLD")
        );
        const soldAds = await getDocs(soldAdsQuery);

        // Set Data for Pie Chart
        setData([
          { name: 'Active', value: activeAds.size },
          { name: 'Sold', value: soldAds.size },
        ]);
      } catch (error) {
        console.error("Error fetching data: ", error);
        setData([]);
      }
    };

    fetchData();
  }, []);

  return (
    <PieChart width={400} height={400}>
      <Pie
        dataKey="value"
        isAnimationActive={false}
        data={data}
        cx={200}
        cy={200}
        outerRadius={80}
        fill="#8884d8"
        label
      >
        {
          data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)
        }
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  );
};

export default AdsStatusPieChart;
