import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "../FireBaseConfig2";
import {Typography } from '@mui/material';
import Timeline from "@mui/lab/Timeline"; 
import TimelineItem from "@mui/lab/TimelineItem"; 
import TimelineSeparator from "@mui/lab/TimelineSeparator"; 
import TimelineConnector from "@mui/lab/TimelineConnector"; 
import TimelineContent from "@mui/lab/TimelineContent"; 
import TimelineDot from "@mui/lab/TimelineDot"; 

const UserActivityTimeline = () => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const auditTraceQuery = query(
          collection(db, "audittrace"),
          orderBy("CREATEDTIME") 
        );
        const auditTraceDocs = await getDocs(auditTraceQuery);
        const auditTraceData = auditTraceDocs.docs.map(doc => ({...doc.data(), id: doc.id}));

        setActivities(auditTraceData);

      } catch (error) {
        console.error("Error fetching data: ", error);
        setActivities([]);
      }
    };
    fetchData();
  }, []);

  return (
    <Timeline position="alternate">
      {activities.map((activity, index) => (
        <TimelineItem key={activity.AUDITTRACEID}>
          <TimelineSeparator>
            <TimelineDot color={index % 2 === 0 ? "primary" : "secondary"} />
            {index !== activities.length - 1 && <TimelineConnector />}
          </TimelineSeparator>
          <TimelineContent>
            <Typography variant="h6" component="span">
              {activity.DESCRIPTION}
            </Typography>
            <Typography>
              {new Date(activity.CREATEDTIME).toLocaleString()}
            </Typography>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );
};

export default UserActivityTimeline;
